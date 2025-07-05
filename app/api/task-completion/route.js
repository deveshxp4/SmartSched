import prisma from '@/lib/prisma';

// Get task completions for a user on a specific date
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const date = searchParams.get('date');

    // Validate required parameters
    if (!userId || !date || isNaN(userId)) {
      return Response.json(
        { success: false, error: "Missing or invalid required parameters" },
        { status: 400 }
      );
    }

    // Parse date
    const queryDate = new Date(date);
    if (isNaN(queryDate.getTime())) {
      return Response.json(
        { success: false, error: "Invalid date format" },
        { status: 400 }
      );
    }

    // Query completions for this user and date
    const completions = await prisma.taskCompletion.findMany({
      where: {
        user_id: parseInt(userId),
        date: {
          gte: new Date(queryDate.setHours(0, 0, 0, 0)),
          lt: new Date(queryDate.setHours(23, 59, 59, 999))
        }
      }
    });

    return Response.json({ success: true, completions });
  } catch (error) {
    console.error('Error fetching task completions:', error);
    return Response.json(
      { success: false, error: error.message || 'Database operation failed' },
      { status: 500 }
    );
  }
}

// Toggle a task completion status (create if not exists, update if exists)
export async function POST(request) {
  try {
    const { userId, taskId, date, completed } = await request.json();
    
    // Validate required fields
    if (!userId || !taskId || !date) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Parse date
    const taskDate = new Date(date);
    if (isNaN(taskDate.getTime())) {
      return Response.json(
        { success: false, error: "Invalid date format" },
        { status: 400 }
      );
    }

    // Check if record already exists
    const existingCompletion = await prisma.taskCompletion.findFirst({
      where: {
        user_id: Number(userId),
        task_id: taskId,
        date: {
          gte: new Date(taskDate.setHours(0, 0, 0, 0)),
          lt: new Date(taskDate.setHours(23, 59, 59, 999))
        }
      }
    });

    let result;
    
    if (existingCompletion) {
      // Update existing completion status
      result = await prisma.taskCompletion.update({
        where: { id: existingCompletion.id },
        data: { completed: completed !== undefined ? completed : !existingCompletion.completed }
      });
    } else {
      // Create new completion record
      result = await prisma.taskCompletion.create({
        data: {
          user_id: Number(userId),
          task_id: taskId,
          date: taskDate,
          completed: completed !== undefined ? Boolean(completed) : true
        }
      });
    }

    // Automatically update task stats for this date
    await updateTaskStats(Number(userId), taskDate);
    
    return Response.json(
      { success: true, completion: result },
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

// Delete a task completion
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const completionId = searchParams.get('id');

    if (!completionId || isNaN(completionId)) {
      return Response.json(
        { success: false, error: "Invalid completion ID" },
        { status: 400 }
      );
    }

    await prisma.taskCompletion.delete({
      where: { id: parseInt(completionId) }
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting task completion:', error);
    return Response.json(
      { success: false, error: error.message || 'Database operation failed' },
      { status: 500 }
    );
  }
}

// Helper function to update task stats for a specific date
async function updateTaskStats(userId, date) {
  try {
    // Get all completions for this user and date
    const completions = await prisma.taskCompletion.findMany({
      where: {
        user_id: userId,
        date: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999))
        }
      }
    });

    const totalTasks = completions.length;
    const completedTasks = completions.filter(task => task.completed).length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Check if stats already exist for this date
    const existingStats = await prisma.taskStats.findFirst({
      where: {
        user_id: userId,
        date: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999))
        }
      }
    });

    if (existingStats) {
      // Update existing stats
      await prisma.taskStats.update({
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
      await prisma.taskStats.create({
        data: {
          user_id: userId,
          date: date,
          total_tasks: totalTasks,
          completed_tasks: completedTasks,
          completion_rate: completionRate
        }
      });
    }
  } catch (error) {
    console.error('Error updating task stats:', error);
  }
} 