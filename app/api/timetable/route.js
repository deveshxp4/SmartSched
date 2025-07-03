// app/api/timetable/route.js
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { userId, weekdays, weekends } = await request.json();
    
    // Validate required fields
    if (!userId || !weekdays || !weekends) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Creating timetable for user:", userId);
    
    const newTimetable = await prisma.timetable.create({
      data: {
        user_id: Number(userId),
        weekdays,
        weekends
      }
    });
    
    console.log("Timetable created successfully:", newTimetable.id);
    
    return Response.json(
      { success: true, timetable: newTimetable },
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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    console.log("Fetching timetable for user ID:", userId);

    // Validate userId parameter
    if (!userId || isNaN(userId)) {
      console.log("Invalid user ID:", userId);
      return Response.json(
        { success: false, error: "Invalid user ID" },
        { status: 400 }
      );
    }

    // Debug: Look up all timetables
    const allTimetables = await prisma.timetable.findMany({
      take: 5, // Limit to 5 records for safety
      orderBy: { created_at: 'desc' }
    });
    
    console.log("Available timetables:", allTimetables.map(t => ({ id: t.id, user_id: t.user_id })));

    const timetable = await prisma.timetable.findFirst({
      where: { user_id: parseInt(userId) },
      orderBy: { created_at: 'desc' }
    });

    console.log("Timetable lookup result:", timetable ? `Found ID: ${timetable.id}` : "Not found");

    if (!timetable) {
      return Response.json(
        { success: false, error: "No timetable found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, timetable });
  } catch (error) {
    console.error('Fetch error:', error);
    return Response.json(
      { success: false, error: error.message || 'Database operation failed' },
      { status: 500 }
    );
  }
}