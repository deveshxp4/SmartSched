"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const MyTimetable = () => {
  const [userName, setUserName] = useState(null);
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState("week");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStartDate(new Date()));

  // Helper function to get the start date of a week (Monday)
  function getWeekStartDate(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  }

  // Helper function to format date for display
  function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  }

  // Helper function to format month and year
  function formatMonthYear(date) {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'long', 
      year: 'numeric' 
    }).format(date);
  }

  // Format time string for display
  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString;
  };

  // Get days of the current week
  const getDaysOfWeek = (startDate) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Get time slots for the day view
  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour < 23; hour++) {
      slots.push(`${hour % 12 || 12}:00 ${hour < 12 ? 'AM' : 'PM'}`);
    }
    return slots;
  };

  // Safely parse JSON
  const safelyParseJSON = (jsonString) => {
    try {
      if (typeof jsonString === 'object') return jsonString;
      return JSON.parse(jsonString);
    } catch (e) {
      console.error("Error parsing JSON:", e);
      return { error: "Could not parse timetable data" };
    }
  };

  // Navigate to previous week
  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  // Navigate to next week
  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  // Navigate to today
  const goToToday = () => {
    setCurrentWeekStart(getWeekStartDate(new Date()));
    setSelectedDate(new Date());
  };

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        console.log("Fetching user data for timetable...");
        const userResponse = await fetch("/api/auth/User");
        const userData = await userResponse.json();
        
        if (userResponse.ok) {
          setUserName(userData.name);
          
          const timetableResponse = await fetch(`/api/timetable?userId=${userData.id}`);
          const data = await timetableResponse.json();
          
          if (timetableResponse.ok && data.success) {
            setTimetable(data.timetable);
          } else {
            setError(`No timetable found: ${data.error || 'Please generate one first'}`);
          }
        } else {
          setError(`Authentication failed: ${userData.error || 'Unknown error'}`);
          setTimeout(() => {
            window.location.href = "/login";
          }, 5000);
        }
      } catch (error) {
        setError(`Failed to load timetable: ${error.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  // Get activities for a specific day
  const getActivitiesForDay = (date) => {
    if (!timetable) return [];
    
    const weekday = date.getDay();
    const isWeekend = weekday === 0 || weekday === 6; // 0 is Sunday, 6 is Saturday
    
    const scheduleData = isWeekend ? 
      safelyParseJSON(timetable.weekends) : 
      safelyParseJSON(timetable.weekdays);
    
    if (!Array.isArray(scheduleData)) return [];
    
    // Map day number to day name
    const dayMap = {
      0: "Sunday",
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday"
    };
    
    const dayName = dayMap[weekday];
    const daySchedule = scheduleData.find(day => day.day === dayName);
    
    return daySchedule?.schedule || [];
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading your timetable...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-10">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">Productivity</h1>
          </div>
          
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Welcome,</p>
                <p className="font-medium text-gray-800">{userName || "User"}</p>
              </div>
            </div>
            
            <nav className="space-y-1">
              <Link href="/dashboard" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
                <span className="font-medium">Dashboard</span>
              </Link>
              
              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">My Timetable</span>
              </a>
              
              <Link href="/daily-timetable" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Daily Tasks</span>
              </Link>
              
              <Link href="/timetable" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Generate Timetable</span>
              </Link>
            </nav>
          </div>
          
          <div className="mt-auto p-6 border-t border-gray-200">
            <Link href="/dashboard" className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">My Timetable</h1>
            <Link href="/timetable">
              <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Update Timetable
              </button>
            </Link>
          </div>
          
          {error && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-red-500">{error}</h3>
                <p className="text-gray-600 mb-6">Please generate a timetable to view your schedule.</p>
                <Link href="/timetable">
                  <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    Generate Timetable
                  </button>
                </Link>
              </div>
            </div>
          )}
          
          {timetable && (
            <>
              <div className="bg-white rounded-xl shadow-sm mb-6">
                {/* Calendar Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">{formatMonthYear(currentWeekStart)}</h2>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setActiveView("week")}
                      className={`px-3 py-1 text-sm font-medium rounded ${activeView === "week" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"}`}
                    >
                      Week
                    </button>
                    <button 
                      onClick={() => setActiveView("day")}
                      className={`px-3 py-1 text-sm font-medium rounded ${activeView === "day" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"}`}
                    >
                      Day
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={goToPreviousWeek}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button 
                      onClick={goToToday}
                      className="px-3 py-1 text-sm font-medium bg-gray-100 rounded hover:bg-gray-200 text-gray-700"
                    >
                      Today
                    </button>
                    <button 
                      onClick={goToNextWeek}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Week View */}
                {activeView === "week" && (
                  <div className="calendar-week overflow-x-auto">
                    <div className="grid grid-cols-7 min-w-max">
                      {/* Days Header */}
                      {getDaysOfWeek(currentWeekStart).map((date, index) => {
                        const isToday = new Date().toDateString() === date.toDateString();
                        const isSelected = selectedDate.toDateString() === date.toDateString();
                        
                        return (
                          <div 
                            key={index}
                            className={`border-r last:border-r-0 p-2 text-center ${isToday ? "bg-blue-50" : ""}`}
                          >
                            <p className="text-gray-500 text-xs uppercase font-medium">
                              {new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date)}
                            </p>
                            <button 
                              onClick={() => {
                                setSelectedDate(date);
                                setActiveView("day");
                              }}
                              className={`w-10 h-10 mx-auto mt-1 flex items-center justify-center rounded-full 
                                ${isSelected ? "bg-blue-600 text-white" : isToday ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}`}
                            >
                              {date.getDate()}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Time Slots */}
                    <div className="grid grid-cols-7 border-t min-w-max">
                      {getDaysOfWeek(currentWeekStart).map((date, dayIndex) => {
                        const activities = getActivitiesForDay(date);
                        const isToday = new Date().toDateString() === date.toDateString();
                        
                        return (
                          <div 
                            key={dayIndex} 
                            className={`border-r last:border-r-0 relative ${isToday ? "bg-blue-50" : ""}`}
                          >
                            {getTimeSlots().map((timeSlot, slotIndex) => (
                              <div 
                                key={slotIndex}
                                className="h-16 border-b last:border-b-0 px-2 py-1"
                              >
                                <div className="text-xs text-gray-400 mt-1">
                                  {slotIndex === 0 && timeSlot}
                                </div>
                              </div>
                            ))}
                            
                            {/* Activities for this day */}
                            {activities.map((activity, actIndex) => {
                              // Calculate position and height based on start/end times
                              // This is a simplified calculation for demonstration
                              const startHour = parseInt(activity.start?.split(':')[0] || "9");
                              const endHour = parseInt(activity.end?.split(':')[0] || (startHour + 1));
                              const duration = endHour - startHour;
                              
                              const topPosition = (startHour - 6) * 64; // 6 is the start hour, 64 is height of each slot
                              const height = duration * 64;
                              
                              // Assign a color based on activity type or index
                              const colorClasses = [
                                "bg-blue-100 border-blue-300 text-blue-800",
                                "bg-green-100 border-green-300 text-green-800",
                                "bg-yellow-100 border-yellow-300 text-yellow-800",
                                "bg-purple-100 border-purple-300 text-purple-800",
                                "bg-pink-100 border-pink-300 text-pink-800",
                              ];
                              
                              const colorClass = colorClasses[actIndex % colorClasses.length];
                              
                              return (
                                <div
                                  key={actIndex}
                                  className={`absolute left-1 right-1 rounded border ${colorClass} p-1 overflow-hidden`}
                                  style={{
                                    top: `${topPosition}px`,
                                    height: `${height - 2}px`, // Subtract for borders
                                  }}
                                >
                                  <div className="text-xs font-medium">
                                    {formatTime(activity.start || activity.startTime)}
                                  </div>
                                  <div className="text-xs truncate">
                                    {activity.activity || activity.name}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* Day View */}
                {activeView === "day" && (
                  <div className="calendar-day">
                    <div className="text-center py-4 border-b">
                      <h3 className="text-lg font-medium">{formatDate(selectedDate)}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 divide-y">
                      {getTimeSlots().map((timeSlot, index) => {
                        const hour = index + 6; // starting from 6 AM
                        const activities = getActivitiesForDay(selectedDate).filter(activity => {
                          const startHour = parseInt(activity.start?.split(':')[0] || "0");
                          return startHour === hour;
                        });
                        
                        return (
                          <div key={index} className="flex h-20">
                            <div className="w-20 flex-shrink-0 border-r p-2 flex items-start">
                              <span className="text-sm text-gray-500">{timeSlot}</span>
                            </div>
                            <div className="flex-1 p-1 relative">
                              {activities.map((activity, actIndex) => {
                                // Assign a color based on activity type or index
                                const colorClasses = [
                                  "bg-blue-100 border-blue-300 text-blue-800",
                                  "bg-green-100 border-green-300 text-green-800", 
                                  "bg-yellow-100 border-yellow-300 text-yellow-800",
                                  "bg-purple-100 border-purple-300 text-purple-800",
                                  "bg-pink-100 border-pink-300 text-pink-800"
                                ];
                                
                                const colorClass = colorClasses[actIndex % colorClasses.length];
                                
                                return (
                                  <div
                                    key={actIndex}
                                    className={`border ${colorClass} rounded p-2 mb-1`}
                                  >
                                    <div className="font-medium text-sm">
                                      {activity.activity || activity.name}
                                    </div>
                                    <div className="text-xs">
                                      {formatTime(activity.start || activity.startTime)} - {formatTime(activity.end || activity.endTime)}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center space-y-4">
                  <Link href="/daily-timetable">
                    <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      View Daily Tasks
                    </button>
                  </Link>
                  <p className="text-gray-500 text-sm">Track your daily progress and complete your scheduled activities</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTimetable;