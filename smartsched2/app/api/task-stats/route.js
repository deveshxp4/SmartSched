import prisma from '../../../lib/prisma';

// Get task statistics for a user
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : 30;

    // Validate required parameters
    if (!userId || isNaN(userId)) {
      return Response.json(
        { success: false, error: "Missing or invalid user ID" },
        { status: 400 }
      );
    }

    // Build the query
    const where = { user_id: parseInt(userId) };

    // Add date range if provided
    if (startDate && endDate) {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);

      if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
        return Response.json(
          { success: false, error: "Invalid date format" },
          { status: 400 }
        );
      }

      where.date = {
        gte: startDateObj,
        lte: endDateObj
      };
    }

    // Fetch statistics
    const stats = await prisma.taskStats.findMany({
      where,
      orderBy: { date: 'desc' },
      take: limit
    });

    return Response.json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching task statistics:', error);
    return Response.json(
      { success: false, error: error.message || 'Database operation failed' },
      { status: 500 }
    );
  }
}

// Create or update task statistics
export async function POST(request) {
  try {
    const { userId, date, totalTasks, completedTasks } = await request.json();

    // Validate required fields
    if (!userId || !date || totalTasks === undefined || completedTasks === undefined) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Parse date
    const statsDate = new Date(date);
    if (isNaN(statsDate.getTime())) {
      return Response.json(
        { success: false, error: "Invalid date format" },
        { status: 400 }
      );
    }

    // Calculate completion rate
    const completionRate = totalTasks > 0
      ? (completedTasks / totalTasks) * 100
      : 0;

    // Check if stats already exist for this date
    const existingStats = await prisma.taskStats.findFirst({
      where: {
        user_id: Number(userId),
        date: {
          gte: new Date(statsDate.setHours(0, 0, 0, 0)),
          lt: new Date(new Date(date).setHours(23, 59, 59, 999))
        }
      }
    });

    let result;

    if (existingStats) {
      // Update existing stats
      result = await prisma.taskStats.update({
        where: { id: existingStats.id },
        data: {
          total_tasks: totalTasks,
          completed_tasks: completedTasks,
          completion_rate: completionRate,
          updated_at: new Date()
        }
      });
    } else {
      // Create new stats record
      result = await prisma.taskStats.create({
        data: {
          user_id: Number(userId),
          date: statsDate,
          total_tasks: totalTasks,
          completed_tasks: completedTasks,
          completion_rate: completionRate
        }
      });
    }

    return Response.json(
      { success: true, stats: result },
      { status: 201 }
    );
  } catch (error) {
    console.error('Database error:', error);
    return Response.json(
      { success: false, error: error.message || 'Database operation failed' },
      { status: 500 }
    );
  }
} 