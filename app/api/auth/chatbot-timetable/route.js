// app/api/chatbot-timetable/route.js

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required." }), { status: 400 });
    }

    const chatPrompt = `Generate a detailed daily timetable based on the following instructions: ${prompt}`;

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: chatPrompt,
      max_tokens: 250,
      temperature: 0.7,
    });

    const timetableText = completion.data.choices[0].text.trim();
    return new Response(JSON.stringify({ timetable: timetableText }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error from OpenAI:", error);
    return new Response(JSON.stringify({ error: "Error generating timetable" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
