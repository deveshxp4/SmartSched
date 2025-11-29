'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, CheckSquare, Settings, LogOut, User, PieChart } from 'lucide-react';
import './calendar.css';

export default function MyTimetable() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [view, setView] = useState('week'); // 'day' or 'week'
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const timeSlots = [
    '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM',
    '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
    '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'
  ];

  // Convert timetable data to events format
  const convertTimetableToEvents = (timetableData) => {
    const events = [];
    const today = new Date();
    const colors = {
      'College': '#4a90e2',
      'Study': '#5ba3f5',
      'General Study': '#5ba3f5',
      'Lunch': '#2ecc71',
      'Dinner': '#2ecc71',
      'Morning Routine': '#9b59b6',
      'default': '#e74c3c'
    };

    // Helper function to get date for a specific day of week
    const getDateForDay = (dayName, weekStartDate = today) => {
      const startOfWeek = new Date(weekStartDate);
      const dayIndex = daysOfWeek.indexOf(dayName);
      const currentDayIndex = startOfWeek.getDay();
      const diff = dayIndex - currentDayIndex;

      const targetDate = new Date(startOfWeek);
      targetDate.setDate(startOfWeek.getDate() + diff);
      return targetDate;
    };

    // Process weekdays
    if (timetableData.weekdays) {
      timetableData.weekdays.forEach(day => {
        if (day.schedule) {
          day.schedule.forEach((slot, index) => {
            const eventDate = getDateForDay(day.day);
            events.push({
              id: `${day.day}-${index}`,
              title: slot.activity,
              date: eventDate,
              startTime: slot.start,
              endTime: slot.end,
              color: colors[slot.activity] || colors.default,
              description: slot.activity
            });
          });
        }
      });
    }

    // Process weekends
    if (timetableData.weekends) {
      timetableData.weekends.forEach(day => {
        if (day.schedule) {
          day.schedule.forEach((slot, index) => {
            const eventDate = getDateForDay(day.day);
            events.push({
              id: `${day.day}-${index}`,
              title: slot.activity,
              date: eventDate,
              startTime: slot.start,
              endTime: slot.end,
              color: colors[slot.activity] || colors.default,
              description: slot.activity
            });
          });
        }
      });
    }

    return events;
  };

  // Fetch user and timetable data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch user data
        console.log("Fetching user data...");
        const userResponse = await fetch("/api/auth/User");
        const userData = await userResponse.json();

        if (!userResponse.ok) {
          throw new Error(`Authentication failed: ${userData.error || 'Unknown error'}`);
        }

        setUserName(userData.name);
        setUserId(userData.id);
        console.log("User authenticated:", userData.name, "ID:", userData.id);

        // Fetch timetable
        console.log("Fetching timetable for user ID:", userData.id);
        const timetableResponse = await fetch(`/api/timetable?userId=${userData.id}`);
        const timetableData = await timetableResponse.json();

        if (!timetableResponse.ok || !timetableData.success) {
          throw new Error(`No timetable found: ${timetableData.error || 'Please generate one first'}`);
        }

        setTimetable(timetableData.timetable);

        // Convert timetable to events
        const convertedEvents = convertTimetableToEvents(timetableData.timetable);
        setEvents(convertedEvents);

      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to load timetable');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Navigation
  const goToPrevious = () => {
    if (view === 'day') {
      setCurrentDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000));
    } else {
      setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
    }
  };

  const goToNext = () => {
    if (view === 'day') {
      setCurrentDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000));
    } else {
      setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get week dates
  const getWeekDates = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    }).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  // Calculate event position
  const getEventPosition = (startTime) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    return (totalMinutes / 60) * 60; // 60px per hour
  };

  const getEventHeight = (startTime, endTime) => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    const duration = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
    const calculatedHeight = (duration / 60) * 60; // 60px per hour

    // Minimum height based on duration for better visibility - ensure ALL events are visible
    let minHeight;
    if (duration <= 10) minHeight = 28; // Very short breaks (10 min or less)
    else if (duration <= 20) minHeight = 32; // Short breaks (11-20 min)
    else if (duration <= 30) minHeight = 36; // Medium breaks (21-30 min)
    else if (duration <= 60) minHeight = 40; // Longer activities (31-60 min)
    else minHeight = Math.max(24, calculatedHeight); // 1+ hours (use calculated height)

    return Math.max(calculatedHeight, minHeight);
  };

  // Check if two events overlap in time
  const eventsOverlap = (event1, event2) => {
    const start1 = timeToMinutes(event1.startTime);
    const end1 = timeToMinutes(event1.endTime);
    const start2 = timeToMinutes(event2.startTime);
    const end2 = timeToMinutes(event2.endTime);

    return start1 < end2 && start2 < end1;
  };

  // Convert time string to minutes
  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Group overlapping events and calculate their positions with stacked logic
  const calculateStackedLayout = (events) => {
    if (events.length === 0) return { events: [], height: 1440 }; // Default min height

    // Sort events by start time
    const sortedEvents = [...events].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

    const layoutGroups = [];
    let currentGroup = [sortedEvents[0]];

    // Group overlapping events (Logical overlap)
    for (let i = 1; i < sortedEvents.length; i++) {
      const overlapsWithGroup = currentGroup.some(event => eventsOverlap(event, sortedEvents[i]));

      if (overlapsWithGroup) {
        currentGroup.push(sortedEvents[i]);
      } else {
        layoutGroups.push(currentGroup);
        currentGroup = [sortedEvents[i]];
      }
    }
    layoutGroups.push(currentGroup);

    // Calculate positions
    let currentVisualY = 0; // In pixels
    let lastLogicalEndTime = 0; // In minutes from start of day (0)

    // Helper to get min start time of a group
    const getGroupStartTime = (group) => Math.min(...group.map(e => timeToMinutes(e.startTime)));
    const getGroupEndTime = (group) => Math.max(...group.map(e => timeToMinutes(e.endTime)));

    layoutGroups.forEach(group => {
      const groupStart = getGroupStartTime(group);
      const groupEnd = getGroupEndTime(group);

      // Calculate gap from previous group
      // If this is the first group, gap is from 0
      const gap = Math.max(0, groupStart - lastLogicalEndTime);

      // Add gap to visual Y (scale: 1 min = 1 px)
      currentVisualY += gap;

      // Calculate layout within the group (side-by-side)
      const maxOverlaps = Math.min(group.length, 3);
      const margin = 4;
      const availableWidth = 100 - (2 * margin);
      const eventWidth = availableWidth / maxOverlaps;

      let groupMaxVisualHeight = 0;

      group.forEach((event, index) => {
        const start = timeToMinutes(event.startTime);
        const end = timeToMinutes(event.endTime);
        const duration = end - start;

        // Apply min height logic: if duration < 60 min, use 60px height
        const visualHeight = duration < 60 ? 60 : duration;

        // Relative top within the group
        const relativeTop = start - groupStart;

        const top = currentVisualY + relativeTop;

        if (index < maxOverlaps) {
          positionedEvents.push({
            ...event,
            top: `${top}px`,
            height: `${visualHeight}px`,
            left: `${margin + (index * eventWidth)}%`,
            width: `${eventWidth}%`,
            zIndex: maxOverlaps - index
          });
        }

        // Track the max visual extent of this group
        groupMaxVisualHeight = Math.max(groupMaxVisualHeight, relativeTop + visualHeight);
      });

      // Advance visual Y by the group's visual height
      currentVisualY += groupMaxVisualHeight;

      // Update logical end time
      lastLogicalEndTime = groupEnd;
    });

    // Ensure minimum height of 24h
    const totalHeight = Math.max(1440, currentVisualY + 60);

    return { events: positionedEvents, height: totalHeight };
  };

  // Render Day View
  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate);
    const { events: positionedEvents, height: containerHeight } = calculateStackedLayout(dayEvents);

    return (
      <div className="schedule-container">
        <div className="schedule-header-row">
          <div className="time-column-header"></div>
          <div className="day-column-header">
            <div className="day-name">{daysOfWeek[currentDate.getDay()]}</div>
            <div className="day-date">{currentDate.getDate()}</div>
          </div>
        </div>

        <div className="schedule-grid">
          <div className="time-column">
            {timeSlots.map((time, index) => (
              <div key={index} className="time-slot">{time}</div>
            ))}
          </div>

          <div className="day-column" style={{ minHeight: `${containerHeight}px` }}>
            <div className="events-track">
              {positionedEvents.map(event => {
                const duration = timeToMinutes(event.endTime) - timeToMinutes(event.startTime);
                const durationClass = duration <= 30 ? 'short' : duration <= 60 ? 'medium' : 'long';

                return (
                  <div
                    key={event.id}
                    className="schedule-event"
                    data-duration={durationClass}
                    style={{
                      backgroundColor: event.color,
                      top: event.top,
                      height: event.height,
                      left: event.left || '0%',
                      width: event.width || '100%',
                      zIndex: event.zIndex || 1
                    }}
                  >
                    <div className="event-content">
                      <div className="event-title-schedule" style={{ fontWeight: 'bold' }}>{event.title}</div>
                      <div className="event-time-schedule">{event.startTime} - {event.endTime}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Week View
  const renderWeekView = () => {
    const weekDates = getWeekDates();

    // Calculate layouts for all days to find the max height
    const dayLayouts = weekDates.map(date => {
      const dayEvents = getEventsForDate(date);
      return calculateStackedLayout(dayEvents);
    });

    const maxDayHeight = Math.max(...dayLayouts.map(l => l.height));

    return (
      <div className="schedule-container">
        <div className="schedule-header-row">
          <div className="time-column-header"></div>
          {weekDates.map((date, index) => (
            <div key={index} className="day-column-header">
              <div className="day-name">{daysOfWeek[date.getDay()].slice(0, 3)}</div>
              <div className="day-date">{date.getDate()}</div>
            </div>
          ))}
        </div>

        <div className="schedule-grid">
          <div className="time-column">
            {timeSlots.map((time, index) => (
              <div key={index} className="time-slot">{time}</div>
            ))}
          </div>

          {weekDates.map((date, dayIndex) => {
            const { events: positionedEvents } = dayLayouts[dayIndex];
            return (
              <div key={dayIndex} className="day-column" style={{ minHeight: `${maxDayHeight}px` }}>
                <div className="events-track">
                  {positionedEvents.map(event => {
                    const duration = timeToMinutes(event.endTime) - timeToMinutes(event.startTime);
                    const durationClass = duration <= 30 ? 'short' : duration <= 60 ? 'medium' : 'long';

                    return (
                      <div
                        key={event.id}
                        className="schedule-event"
                        data-duration={durationClass}
                        style={{
                          backgroundColor: event.color,
                          top: event.top,
                          height: event.height,
                          left: event.left || '0%',
                          width: event.width || '100%',
                          zIndex: event.zIndex || 1
                        }}
                      >
                        <div className="event-content">
                          <div className="event-title-schedule" style={{ fontWeight: 'bold' }}>{event.title}</div>
                          <div className="event-time-schedule">{event.startTime}</div>
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
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Sidebar */}
        <div className="fixed top-0 left-0 h-screen w-64 bg-white border-r-2 border-gray-200 z-50 shadow-lg pt-20">
          <div className="flex flex-col h-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                  <User size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Welcome,</p>
                  <p className="font-bold text-gray-900 text-lg">Loading...</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ml-64 flex flex-col items-center justify-center min-h-screen">
          <div className="w-16 h-16 border-4 border-t-black border-gray-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your timetable...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        {/* Sidebar */}
        <div className="fixed top-0 left-0 h-screen w-64 bg-white border-r-2 border-gray-200 z-50 shadow-lg pt-20">
          <div className="flex flex-col h-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                  <User size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Welcome,</p>
                  <p className="font-bold text-gray-900 text-lg">{userName || "User"}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <Link href="/dashboard" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all">
                  <PieChart size={20} />
                  <span className="font-medium">Dashboard</span>
                </Link>

                <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-600">
                  <Calendar size={20} />
                  <span className="font-medium">My Timetable</span>
                </a>

                <Link href="/daily-timetable" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all">
                  <CheckSquare size={20} />
                  <span className="font-medium">Daily Tasks</span>
                </Link>

                <Link href="/timetable" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all">
                  <Settings size={20} />
                  <span className="font-medium">Generate Timetable</span>
                </Link>
              </nav>
            </div>

            <div className="mt-auto p-6 border-t-2 border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  localStorage.removeItem("isLoggedIn");
                  window.dispatchEvent(new Event("storage"));
                  window.dispatchEvent(new CustomEvent("loginStateChanged"));
                  window.location.href = "/login";
                }}
                className="flex items-center space-x-3 text-gray-700 hover:text-red-600 transition-colors w-full px-4 py-3 rounded-lg hover:bg-red-50"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>

        <div className="ml-64 flex flex-col items-center justify-center min-h-screen">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full border border-gray-200">
            <div className="text-red-500 mb-4 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 className="text-xl font-bold mt-2">Error</h2>
            </div>
            <p className="text-gray-700 text-center">{error}</p>
            <div className="mt-6 text-center">
              <Link href="/timetable">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Generate Timetable
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-64 bg-white border-r-2 border-gray-200 z-50 shadow-lg pt-20">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                <User size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Welcome,</p>
                <p className="font-bold text-gray-900 text-lg">{userName || "User"}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <Link href="/dashboard" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all">
                <PieChart size={20} />
                <span className="font-medium">Dashboard</span>
              </Link>

              <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-600">
                <Calendar size={20} />
                <span className="font-medium">My Timetable</span>
              </a>

              <Link href="/daily-timetable" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all">
                <CheckSquare size={20} />
                <span className="font-medium">Daily Tasks</span>
              </Link>

              <Link href="/timetable" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all">
                <Settings size={20} />
                <span className="font-medium">Generate Timetable</span>
              </Link>
            </nav>
          </div>

          <div className="mt-auto p-6 border-t-2 border-gray-200 bg-gray-50">
            <button
              onClick={() => {
                localStorage.removeItem("isLoggedIn");
                window.dispatchEvent(new Event("storage"));
                window.dispatchEvent(new CustomEvent("loginStateChanged"));
                window.location.href = "/login";
              }}
              className="flex items-center space-x-3 text-gray-700 hover:text-red-600 transition-colors w-full px-4 py-3 rounded-lg hover:bg-red-50"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="timetable-header">
            <h1 className="text-3xl font-bold text-black mb-2">My Timetable</h1>
            <p className="text-gray-600">
              {view === 'day'
                ? `${daysOfWeek[currentDate.getDay()]}, ${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`
                : `Week of ${monthNames[getWeekDates()[0].getMonth()]} ${getWeekDates()[0].getDate()}, ${getWeekDates()[0].getFullYear()}`
              }
            </p>
          </div>

          <div className="calendar-controls">
            <div className="controls-left">
              <button className="btn-today" onClick={goToToday}>
                Today
              </button>
              <div className="month-navigation">
                <button className="btn-nav" onClick={goToPrevious}>
                  ←
                </button>
                <button className="btn-nav" onClick={goToNext}>
                  →
                </button>
              </div>
            </div>

            <div className="controls-right">
              <div className="view-toggle">
                <button
                  className={`btn-view ${view === 'day' ? 'active' : ''}`}
                  onClick={() => setView('day')}
                >
                  Day
                </button>
                <button
                  className={`btn-view ${view === 'week' ? 'active' : ''}`}
                  onClick={() => setView('week')}
                >
                  Week
                </button>
              </div>
            </div>
          </div>

          {view === 'day' ? renderDayView() : renderWeekView()}
        </div>
      </div>
    </div>
  );
}
