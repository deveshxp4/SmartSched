// app/api/chatbot-timetable/route.js

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required." }), { status: 400 });
    }

    // For now, return a mock response since OpenAI API key is not configured
    const mockResponse = `Based on your request: "${prompt}", here's a suggested timetable:

Morning (8:00 AM - 12:00 PM):
- 8:00-9:00: Breakfast and morning routine
- 9:00-10:30: Study session
- 10:30-11:00: Break
- 11:00-12:00: Continue studying

Afternoon (12:00 PM - 5:00 PM):
- 12:00-1:00: Lunch break
- 1:00-3:00: Focused work/study
- 3:00-3:30: Short break
- 3:30-5:00: Complete tasks

Evening (5:00 PM - 10:00 PM):
- 5:00-6:00: Exercise or relaxation
- 6:00-7:00: Dinner
- 7:00-9:00: Review and planning
- 9:00-10:00: Wind down and prepare for bed`;

    return new Response(JSON.stringify({ timetable: mockResponse }), { 
      status: 200, 
      headers: { "Content-Type": "application/json" } 
    });
  } catch (error) {
    console.error("Error generating timetable:", error);
    return new Response(JSON.stringify({ error: "Error generating timetable" }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  }
}
