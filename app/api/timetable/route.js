// app/api/timetable/route.js

import { prisma } from "../../../../lib/prisma";

// POST - Create a new timetable for a user
export async function POST(req) {
  try {
    const { userId, subjects, restrictedTimes, availableTimes } = await req.json();

    // Create a new timetable entry for the user
    const timetable = await prisma.timetable.create({
      data: {
        userId,
        subjects: {
          create: subjects, // Assuming `subjects` is an array of subject objects
        },
        restrictedTimes: {
          create: restrictedTimes, // Assuming `restrictedTimes` is an array of time objects
        },
        availableTimes: {
          create: availableTimes, // Assuming `availableTimes` is an array of time objects
        },
      },
    });

    return new Response(JSON.stringify(timetable), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// GET - Fetch the timetable for a user
export async function GET(req) {
  try {
    const userId = req.query.userId; // Assuming the user ID is passed in the query parameters

    const timetable = await prisma.timetable.findUnique({
      where: { userId },
      include: {
        subjects: true,
        restrictedTimes: true,
        availableTimes: true,
      },
    });

    if (!timetable) {
      return new Response("Timetable not found.", { status: 404 });
    }

    return new Response(JSON.stringify(timetable), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
