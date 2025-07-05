"use client";
import React, { useState } from "react";
import Link from "next/link";

const TimetableChatBot = () => {
  const [chatInput, setChatInput] = useState("");
  const [timetable, setTimetable] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateTimetable = async () => {
    if (!chatInput) {
      alert("Please enter your instructions");
      return;
    }
    setLoading(true);
    setTimetable("");
    try {
      const response = await fetch("/api/auth/chatbot-timetable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: chatInput }),
      });
      if (response.ok) {
        const data = await response.json();
        setTimetable(data.timetable);
      } else {
        setTimetable("Failed to generate timetable. Please try again later.");
      }
    } catch (error) {
      console.error("Error generating timetable:", error);
      setTimetable("An error occurred while generating the timetable.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">AI Timetable Generator</h1>
            <Link href="/dashboard">
              <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                Back to Dashboard
              </button>
            </Link>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe your timetable requirements:
            </label>
            <textarea
              placeholder="Enter your instructions (e.g., 'I need more time for math and science, I have classes from 9 AM to 3 PM, I want to study for 2 hours each evening')..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              rows={6}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button 
            onClick={handleGenerateTimetable} 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Generating..." : "Generate Timetable"}
          </button>
          
          {timetable && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Generated Timetable:</h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <pre className="whitespace-pre-wrap text-sm text-gray-700">{timetable}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimetableChatBot; 