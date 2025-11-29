"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, CheckSquare, Settings, LogOut, User, PieChart } from "lucide-react";
import "../dashboard/style.css";
import "./style.css";

const TimetableGenerator = () => {
  // State for daily schedule
  const [weekdayWakeUp, setWeekdayWakeUp] = useState("07:00");
  const [weekdaySleep, setWeekdaySleep] = useState("23:00");
  const [weekendWakeUp, setWeekendWakeUp] = useState("08:00");
  const [weekendSleep, setWeekendSleep] = useState("24:00");
  const [examMode, setExamMode] = useState(false);

  // Meal times
  const [lunchTime, setLunchTime] = useState("12:20");
  const [lunchDuration, setLunchDuration] = useState(40); // minutes
  const [dinnerTime, setDinnerTime] = useState("19:00");
  const [dinnerDuration, setDinnerDuration] = useState(30); // minutes

  // College schedule
  const [collegeDays, setCollegeDays] = useState(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
  const [collegeStart, setCollegeStart] = useState("08:30");
  const [collegeEnd, setCollegeEnd] = useState("17:00");

  // Activities and Subjects
  const [activities, setActivities] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [activityName, setActivityName] = useState("");
  const [activityDuration, setActivityDuration] = useState({ hours: 1, minutes: 0 });
  const [activityPriority, setActivityPriority] = useState(5);
  const [activityDays, setActivityDays] = useState([]);

  // Subject inputs
  const [subjectName, setSubjectName] = useState("");
  const [subjectHours, setSubjectHours] = useState(0);
  const [subjectPriority, setSubjectPriority] = useState(5);

  // Study plan
  const [weeklyStudyHours, setWeeklyStudyHours] = useState(20);

  // User and timetable state
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [timetable, setTimetable] = useState({ weekdays: [], weekends: [] });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Calendar timeline state
  const [activeView, setActiveView] = useState('weekdays');
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Fetch user data and timetable on mount
  useEffect(() => {
    const fetchUserAndTimetable = async () => {
      setFetching(true);
      try {
        // First fetch user data
        console.log("Fetching user data...");
        const userResponse = await fetch("/api/auth/User");
        const userData = await userResponse.json();

        if (userResponse.ok) {
          setUserId(userData.id);
          setUserName(userData.name);
          console.log("User authenticated:", userData.name, "ID:", userData.id);

          // Then fetch timetable for this user
          console.log("Fetching timetable for user ID:", userData.id);
          const timetableResponse = await fetch(`/api/timetable?userId=${userData.id}`);
          const timetableData = await timetableResponse.json();

          if (timetableResponse.ok && timetableData.success) {
            console.log("Timetable loaded successfully");
            setTimetable({
              weekdays: timetableData.timetable.weekdays,
              weekends: timetableData.timetable.weekends
            });
          } else {
            console.log("No timetable found for user");
          }
        } else {
          console.error("Authentication failed:", userData.error);
          // Redirect to login if not authenticated
          window.location.href = "/login";
        }
      } catch (error) {
        console.error('Error fetching user/timetable data:', error);
      } finally {
        setFetching(false);
      }
    };

    fetchUserAndTimetable();
  }, []);

  // Convert time string to minutes
  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Convert minutes to time string
  const minutesToTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Format duration for display
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };

  // Add new activity
  const addActivity = () => {
    if (!activityName || (activityDuration.hours === 0 && activityDuration.minutes === 0) || activityDays.length === 0) {
      alert("Please fill all activity details and select at least one day");
      return;
    }

    const durationInMinutes = activityDuration.hours * 60 + activityDuration.minutes;

    const newActivity = {
      name: activityName,
      duration: durationInMinutes,
      priority: activityPriority,
      days: [...activityDays]
    };

    setActivities([...activities, newActivity]);
    setActivityName("");
    setActivityDuration({ hours: 1, minutes: 0 });
    setActivityPriority(5);
    setActivityDays([]);
  };

  // Add new subject
  const addSubject = () => {
    if (!subjectName || subjectHours <= 0) {
      alert("Please enter subject name and valid hours");
      return;
    }

    const newSubject = {
      name: subjectName,
      hours: subjectHours,
      priority: subjectPriority
    };

    setSubjects([...subjects, newSubject]);
    setSubjectName("");
    setSubjectHours(0);
    setSubjectPriority(5);
  };

  // Remove activity
  const removeActivity = (index) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  // Remove subject
  const removeSubject = (index) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  // Toggle day selection
  const toggleDay = (day, type) => {
    if (type === 'college') {
      setCollegeDays(prev =>
        prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
      );
    } else {
      setActivityDays(prev =>
        prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
      );
    }
  };

  // Save timetable function
  const saveTimetable = async (timetableData) => {
    if (!userId) {
      alert("User not authenticated. Please login again.");
      return;
    }

    try {
      console.log("Saving timetable for user ID:", userId);
      const response = await fetch('/api/timetable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          weekdays: timetableData.weekdays,
          weekends: timetableData.weekends
        })
      });

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Invalid response: ${text}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save timetable');
      }

      console.log("Timetable saved successfully");
      return data.timetable;
    } catch (error) {
      console.error('Error saving timetable:', error);
      alert(`Error saving timetable: ${error.message}`);
    }
  };

  // Reset all task completions for the user
  const resetTaskCompletions = async () => {
    if (!userId) return;

    try {
      console.log("Resetting all task completions for user ID:", userId);
      const response = await fetch(`/api/task-completion?userId=${userId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to reset task completions:', errorData.error);
      } else {
        console.log("Task completions reset successfully");
      }
    } catch (error) {
      console.error('Error resetting task completions:', error);
    }
  };

  // Generate timetable
  const generateTimetable = async () => {
    setLoading(true);

    // Calculate total subject hours
    const totalSubjectHours = subjects.reduce((sum, subject) => sum + subject.hours, 0);

    // Calculate remaining hours for general study
    const remainingHours = Math.max(0, weeklyStudyHours - totalSubjectHours);

    // Generate weekday schedules
    const weekdaySchedules = daysOfWeek
      .filter(day => collegeDays.includes(day))
      .map(day => generateDaySchedule(day, true, weekdayWakeUp, weekdaySleep));

    // Generate weekend schedules
    const weekendSchedules = daysOfWeek
      .filter(day => !collegeDays.includes(day))
      .map(day => generateDaySchedule(day, false, weekendWakeUp, weekendSleep));

    const newTimetable = {
      weekdays: weekdaySchedules,
      weekends: weekendSchedules
    };

    setTimetable(newTimetable);

    // Save the timetable to the database
    await saveTimetable(newTimetable);

    // Reset all task completions when a new timetable is created
    await resetTaskCompletions();

    setLoading(false);
  };

  // Generate schedule for a single day
  const generateDaySchedule = (day, isCollegeDay, wakeTime, sleepTime) => {
    const wakeMins = timeToMinutes(wakeTime);
    const sleepMins = timeToMinutes(sleepTime);
    let currentTime = wakeMins;

    const schedule = [];

    // Add morning routine if there's time before college
    if (isCollegeDay) {
      const collegeStartMins = timeToMinutes(collegeStart);
      if (currentTime < collegeStartMins) {
        schedule.push({
          start: minutesToTime(currentTime),
          end: minutesToTime(collegeStartMins),
          activity: "Morning Routine"
        });
        currentTime = collegeStartMins;
      }
    } else {
      // For weekends, add morning routine until lunch
      const lunchMins = timeToMinutes(lunchTime);
      if (currentTime < lunchMins) {
        schedule.push({
          start: minutesToTime(currentTime),
          end: minutesToTime(lunchMins),
          activity: "Morning Routine"
        });
        currentTime = lunchMins;
      }
    }

    // College time (for weekdays)
    if (isCollegeDay) {
      const collegeStartMins = timeToMinutes(collegeStart);
      const collegeEndMins = timeToMinutes(collegeEnd);
      const lunchMins = timeToMinutes(lunchTime);
      const lunchEndMins = lunchMins + lunchDuration;

      // College before lunch
      if (collegeStartMins < lunchMins) {
        const collegeBeforeLunch = Math.min(collegeEndMins, lunchMins) - collegeStartMins;
        if (collegeBeforeLunch > 0) {
          schedule.push({
            start: minutesToTime(collegeStartMins),
            end: minutesToTime(collegeStartMins + collegeBeforeLunch),
            activity: "College"
          });
          currentTime = collegeStartMins + collegeBeforeLunch;
        }
      }

      // Lunch break during college hours
      if (lunchMins >= collegeStartMins && lunchMins < collegeEndMins) {
        schedule.push({
          start: minutesToTime(lunchMins),
          end: minutesToTime(lunchEndMins),
          activity: "Lunch Break"
        });
        currentTime = lunchEndMins;

        // College after lunch
        const remainingCollege = collegeEndMins - lunchEndMins;
        if (remainingCollege > 0) {
          schedule.push({
            start: minutesToTime(lunchEndMins),
            end: minutesToTime(collegeEndMins),
            activity: "College"
          });
          currentTime = collegeEndMins;
        }
      } else {
        // College continues if lunch is not during college hours
        if (currentTime < collegeEndMins) {
          schedule.push({
            start: minutesToTime(currentTime),
            end: minutesToTime(collegeEndMins),
            activity: "College"
          });
          currentTime = collegeEndMins;
        }
      }
    } else {
      // For non-college days, just add lunch
      const lunchMins = timeToMinutes(lunchTime);
      if (currentTime < lunchMins) {
        schedule.push({
          start: minutesToTime(currentTime),
          end: minutesToTime(lunchMins),
          activity: "Morning Activities"
        });
        currentTime = lunchMins;
      }
      schedule.push({
        start: minutesToTime(lunchMins),
        end: minutesToTime(lunchMins + lunchDuration),
        activity: "Lunch"
      });
      currentTime = lunchMins + lunchDuration;
    }

    // Only schedule study/activities after college ends (for weekdays)
    const getActivitiesForTimeSlot = (availableMinutes) => {
      // Calculate daily study multiplier based on exam mode
      const examModeMultiplier = examMode ? 1.5 : 1;

      // Get all study and personal activities for this day
      const dayActivities = [
        // Study subjects (distributed across week)
        ...subjects.map(subject => ({
          name: `Study ${subject.name}`,
          duration: Math.round((subject.hours * 60 * examModeMultiplier) / 7),
          priority: examMode ? Math.min(subject.priority + 2, 10) : subject.priority
        })),
        // General study time
        {
          name: "General Study",
          duration: Math.round((weeklyStudyHours * 60 * examModeMultiplier - subjects.reduce((sum, s) => sum + s.hours * 60 * examModeMultiplier, 0)) / 7),
          priority: examMode ? 5 : 3
        },
        // Personal activities with reduced priority in exam mode
        ...activities
          .filter(act => act.days.includes(day))
          .map(act => ({
            name: act.name,
            duration: act.duration,
            priority: examMode ? Math.max(act.priority - 2, 1) : act.priority
          }))
      ].filter(act => act.duration > 0);

      // Sort by priority (highest first)
      const sortedActivities = [...dayActivities].sort((a, b) => b.priority - a.priority);

      // Schedule activities within available time
      const scheduled = [];
      let remainingTime = availableMinutes;

      for (const activity of sortedActivities) {
        if (remainingTime <= 0) break;

        const duration = Math.min(activity.duration, remainingTime);
        if (duration > 0) {
          scheduled.push({
            name: activity.name,
            duration: duration
          });
          remainingTime -= duration;
        }
      }

      return scheduled;
    };

    const dinnerMins = timeToMinutes(dinnerTime);
    if (currentTime < dinnerMins) {
      const availableTime = dinnerMins - currentTime;
      const activities = getActivitiesForTimeSlot(availableTime);

      activities.forEach(activity => {
        schedule.push({
          start: minutesToTime(currentTime),
          end: minutesToTime(currentTime + activity.duration),
          activity: activity.name
        });
        currentTime += activity.duration;
      });
    }

    // Dinner time
    schedule.push({
      start: minutesToTime(dinnerMins),
      end: minutesToTime(dinnerMins + dinnerDuration),
      activity: "Dinner"
    });
    currentTime = dinnerMins + dinnerDuration;

    // Evening activities
    if (currentTime < sleepMins) {
      const availableTime = sleepMins - currentTime;
      const activities = getActivitiesForTimeSlot(availableTime);

      activities.forEach(activity => {
        schedule.push({
          start: minutesToTime(currentTime),
          end: minutesToTime(currentTime + activity.duration),
          activity: activity.name
        });
        currentTime += activity.duration;
      });
    }

    return { day, schedule };
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="w-16 h-16 border-4 border-t-black border-gray-200 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading timetable generator...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-10 pt-20 overflow-y-auto">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
          </div>

          <div className="p-6">
            <div className="flex items-center space-x-3 mb-12 mt-2">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white">
                <User size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Welcome,</p>
                <p className="font-medium text-black">{userName || "User"}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <Link href="/dashboard" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition">
                <PieChart size={20} />
                <span className="font-medium">Dashboard</span>
              </Link>

              <Link href="/my-timetable" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition">
                <Calendar size={20} />
                <span className="font-medium">My Timetable</span>
              </Link>

              <Link href="/daily-timetable" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition">
                <CheckSquare size={20} />
                <span className="font-medium">Daily Tasks</span>
              </Link>

              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-black text-white">
                <Settings size={20} />
                <span className="font-medium">Generate Timetable</span>
              </a>
            </nav>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-white">
            <button
              onClick={() => {
                localStorage.removeItem("isLoggedIn");
                window.dispatchEvent(new Event("storage"));
                window.dispatchEvent(new CustomEvent("loginStateChanged"));
                window.location.href = "/login";
              }}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors w-full"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">Generate Timetable</h1>
            <p className="text-gray-600">Create a personalized weekly schedule tailored to your lifestyle and goals.</p>
          </div>

          <div className="space-y-6">
            {/* Daily Schedule Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-black mb-4">Daily Schedule</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Weekdays</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Wake Up Time</label>
                      <input
                        type="time"
                        value={weekdayWakeUp}
                        onChange={(e) => setWeekdayWakeUp(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sleep Time</label>
                      <input
                        type="time"
                        value={weekdaySleep}
                        onChange={(e) => setWeekdaySleep(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Weekend</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Wake Up Time</label>
                      <input
                        type="time"
                        value={weekendWakeUp}
                        onChange={(e) => setWeekendWakeUp(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sleep Time</label>
                      <input
                        type="time"
                        value={weekendSleep}
                        onChange={(e) => setWeekendSleep(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Meal Times Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-black mb-4">Meal Times</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lunch Time</label>
                  <input
                    type="time"
                    value={lunchTime}
                    onChange={(e) => setLunchTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lunch Duration (min)</label>
                  <input
                    type="number"
                    min="15"
                    max="120"
                    value={lunchDuration}
                    onChange={(e) => setLunchDuration(parseInt(e.target.value) || 40)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dinner Time</label>
                  <input
                    type="time"
                    value={dinnerTime}
                    onChange={(e) => setDinnerTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dinner Duration (min)</label>
                  <input
                    type="number"
                    min="15"
                    max="120"
                    value={dinnerDuration}
                    onChange={(e) => setDinnerDuration(parseInt(e.target.value) || 30)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
            </div>

            {/* College Schedule Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-black mb-4">College Schedule</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <input
                    type="time"
                    value={collegeStart}
                    onChange={(e) => setCollegeStart(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                  <input
                    type="time"
                    value={collegeEnd}
                    onChange={(e) => setCollegeEnd(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">College Days</label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.slice(0, 5).map(day => (
                    <button
                      key={day}
                      type="button"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${collegeDays.includes(day)
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      onClick={() => toggleDay(day, 'college')}
                    >
                      {day.substring(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Study Plan Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-black mb-4">Study Plan</h2>

              <div className="space-y-6">
                {/* Exam Mode Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-800">Exam Preparation Mode</h3>
                    <p className="text-sm text-gray-600">Optimize your schedule for exam preparation</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={examMode}
                      onChange={() => setExamMode(!examMode)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>

                {examMode && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">📚 Exam Mode Active</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Study time allocation increased by 50%</li>
                      <li>• Study activities have higher priority</li>
                      <li>• Other activities have reduced priority</li>
                    </ul>
                  </div>
                )}

                {/* Study Hours Slider */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Weekly Study Hours: <span className="font-bold text-black">{weeklyStudyHours}</span>
                    {examMode && <span className="text-blue-600 ml-2">({Math.round(weeklyStudyHours * 1.5)} with exam mode)</span>}
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="5"
                      max="40"
                      value={weeklyStudyHours}
                      onChange={(e) => setWeeklyStudyHours(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                      style={{
                        background: `linear-gradient(to right, #000 0%, #000 ${(weeklyStudyHours - 5) / (40 - 5) * 100}%, #e5e7eb ${(weeklyStudyHours - 5) / (40 - 5) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>5h</span>
                      <span>40h</span>
                    </div>
                  </div>
                </div>

                {/* Add Subjects */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Subjects</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Subject Name"
                      value={subjectName}
                      onChange={(e) => setSubjectName(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <input
                      type="number"
                      min="0"
                      max={weeklyStudyHours}
                      placeholder="Hours per week"
                      value={subjectHours}
                      onChange={(e) => setSubjectHours(parseInt(e.target.value) || 0)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority: {subjectPriority}</label>
                    <div className="relative">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={subjectPriority}
                        onChange={(e) => setSubjectPriority(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                        style={{
                          background: `linear-gradient(to right, #000 0%, #000 ${(subjectPriority - 1) / (10 - 1) * 100}%, #e5e7eb ${(subjectPriority - 1) / (10 - 1) * 100}%, #e5e7eb 100%)`
                        }}
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1</span>
                        <span>10</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={addSubject}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    Add Subject
                  </button>
                </div>

                {/* Subjects List */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Subjects</h3>
                  {subjects.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No subjects added yet</p>
                  ) : (
                    <div className="space-y-3">
                      {subjects.map((subject, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <span className="font-medium text-gray-800">{subject.name}</span>
                            <span className="text-sm text-gray-600 ml-3">
                              {subject.hours}h/week • Priority: {subject.priority}
                            </span>
                          </div>
                          <button
                            onClick={() => removeSubject(index)}
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-800 transition-colors"
                            title="Remove subject"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                        Total subject hours: <span className="font-medium">{subjects.reduce((sum, subject) => sum + subject.hours, 0)} / {weeklyStudyHours}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Activities Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-black mb-4">Personal Activities</h2>

              <div className="space-y-6">
                {/* Add Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Activity</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Activity Name"
                      value={activityName}
                      onChange={(e) => setActivityName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={activityDuration.hours}
                          onChange={(e) => setActivityDuration({ ...activityDuration, hours: parseInt(e.target.value) || 0 })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          placeholder="Hours"
                        />
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={activityDuration.minutes}
                          onChange={(e) => setActivityDuration({ ...activityDuration, minutes: parseInt(e.target.value) || 0 })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          placeholder="Minutes"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority: {activityPriority}</label>
                      <div className="relative">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={activityPriority}
                          onChange={(e) => setActivityPriority(parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                          style={{
                            background: `linear-gradient(to right, #000 0%, #000 ${(activityPriority - 1) / (10 - 1) * 100}%, #e5e7eb ${(activityPriority - 1) / (10 - 1) * 100}%, #e5e7eb 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>1</span>
                          <span>10</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Days</label>
                      <div className="flex flex-wrap gap-2">
                        {daysOfWeek.map(day => (
                          <button
                            key={day}
                            type="button"
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${activityDays.includes(day)
                              ? "bg-black text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            onClick={() => toggleDay(day, 'activity')}
                          >
                            {day.substring(0, 3)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={addActivity}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition font-medium"
                    >
                      Add Activity
                    </button>
                  </div>
                </div>

                {/* Activities List */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Activities</h3>
                  {activities.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No activities added yet</p>
                  ) : (
                    <div className="space-y-3">
                      {activities.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <span className="font-medium text-gray-800">{activity.name}</span>
                            <span className="text-sm text-gray-600 ml-3">
                              {formatDuration(activity.duration)} • Priority: {activity.priority} • {activity.days.map(d => d.substring(0, 3)).join(', ')}
                            </span>
                          </div>
                          <button
                            onClick={() => removeActivity(index)}
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-800 transition-colors"
                            title="Remove activity"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <button
                onClick={generateTimetable}
                disabled={loading}
                className="w-full bg-black text-white py-4 px-6 rounded-lg hover:bg-gray-800 transition font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Generating Your Timetable...
                  </div>
                ) : (
                  "Generate Weekly Timetable"
                )}
              </button>
            </div>

            {/* Generated Timetable Display */}
            {timetable.weekdays.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-black">Your Weekly Timetable</h2>
                  {examMode && (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      📚 Exam Mode
                    </span>
                  )}
                </div>

                {/* Navigation Tabs */}
                <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setActiveView('weekdays')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${activeView === 'weekdays'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    Weekdays
                  </button>
                  <button
                    onClick={() => setActiveView('weekends')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${activeView === 'weekends'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    Weekends
                  </button>
                </div>

                {/* Day Navigation */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => setCurrentDayIndex(prev => Math.max(0, prev - 1))}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <h3 className="text-xl font-semibold text-gray-800">
                    {activeView === 'weekdays'
                      ? timetable.weekdays[currentDayIndex]?.day || 'No schedule'
                      : timetable.weekends[currentDayIndex]?.day || 'No schedule'
                    }
                  </h3>

                  <button
                    onClick={() => setCurrentDayIndex(prev => {
                      const maxIndex = activeView === 'weekdays'
                        ? timetable.weekdays.length - 1
                        : timetable.weekends.length - 1;
                      return Math.min(maxIndex, prev + 1);
                    })}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Calendar Timeline */}
                {(() => {
                  const currentSchedule = (activeView === 'weekdays' ? timetable.weekdays : timetable.weekends)[currentDayIndex]?.schedule || [];

                  // Google Calendar-style constants
                  const PIXELS_PER_HOUR = 60;
                  const PIXELS_PER_MINUTE = PIXELS_PER_HOUR / 60; // 1px per minute
                  const MIN_EVENT_HEIGHT = 60; // Minimum height for visibility

                  // 1. Parse and Sort
                  const items = currentSchedule.map(slot => {
                    const startMinutes = timeToMinutes(slot.start);
                    let endMinutes = timeToMinutes(slot.end);

                    // Enforce minimum duration for visibility (60 mins = 60px)
                    if (endMinutes - startMinutes < 60) {
                      endMinutes = startMinutes + 60;
                    }

                    // Calculate position and height with fixed scale
                    const top = (startMinutes / 60) * 60;
                    const duration = endMinutes - startMinutes;
                    const height = duration * PIXELS_PER_MINUTE;

                    return {
                      slot,
                      startMinutes,
                      endMinutes,
                      top,
                      height
                    };
                  }).sort((a, b) => a.startMinutes - b.startMinutes);

                  // 2. Group connected components
                  const groups = [];
                  if (items.length > 0) {
                    let currentGroup = [items[0]];
                    let maxEnd = items[0].endMinutes;

                    for (let i = 1; i < items.length; i++) {
                      const item = items[i];
                      if (item.startMinutes < maxEnd) {
                        currentGroup.push(item);
                        if (item.endMinutes > maxEnd) maxEnd = item.endMinutes;
                      } else {
                        groups.push(currentGroup);
                        currentGroup = [item];
                        maxEnd = item.endMinutes;
                      }
                    }
                    groups.push(currentGroup);
                  }

                  // 3. Process each group and calculate layout
                  const taskData = groups.flatMap((group) => {
                    const columns = [];
                    group.forEach(item => {
                      let placed = false;
                      for (let i = 0; i < columns.length; i++) {
                        const col = columns[i];
                        // Check if this item overlaps with any item in this column
                        const hasOverlap = col.some(existingItem =>
                          !(item.endMinutes <= existingItem.startMinutes || item.startMinutes >= existingItem.endMinutes)
                        );
                        if (!hasOverlap) {
                          col.push(item);
                          item.colIndex = i;
                          placed = true;
                          break;
                        }
                      }
                      if (!placed) {
                        columns.push([item]);
                        item.colIndex = columns.length - 1;
                      }
                    });

                    const widthPercent = 100 / columns.length;

                    return group.map((item) => ({
                      ...item,
                      leftPercent: item.colIndex * widthPercent,
                      widthPercent: widthPercent
                    }));
                  });

                  // Calculate total timeline height
                  const maxEndPosition = Math.max(...taskData.map(t => t.top + t.height), 0);
                  const timelineHeight = Math.max(maxEndPosition + 60, 480); // Minimum 8 hours (480px)

                  // Calculate how many hour labels to show
                  const hoursToShow = Math.ceil(timelineHeight / 60);

                  return (
                    <div className="calendar-timeline">
                      {/* Time labels */}
                      <div className="time-labels">
                        {Array.from({ length: hoursToShow }, (_, hour) => (
                          <div key={hour} className="time-label">
                            {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                          </div>
                        ))}
                      </div>

                      {/* Timeline grid */}
                      <div className="timeline-grid" style={{ minHeight: `${timelineHeight}px` }}>
                        {/* Hour lines */}
                        {Array.from({ length: hoursToShow }, (_, hour) => (
                          <div key={hour} className="hour-line" style={{ top: `${hour * 60}px` }} />
                        ))}

                        {/* Tasks */}
                        {taskData.map((data, slotIndex) => {
                          const { slot, top, height, leftPercent, widthPercent } = data;
                          const isStudyActivity = slot.activity.includes("Study");
                          const isCollegeActivity = slot.activity === "College";

                          return (
                            <div
                              key={slotIndex}
                              className={`task-block ${isStudyActivity ? 'study-task' : isCollegeActivity ? 'college-task' : 'regular-task'}`}
                              style={{
                                top: `${top}px`,
                                height: `${height}px`,
                                left: `${leftPercent}%`,
                                width: `calc(${widthPercent}% - 4px)`, // Subtract gap
                                position: 'absolute'
                              }}
                              title={`${slot.activity} (${slot.start} - ${slot.end})`}
                            >
                              <div className="task-content">
                                <div className="task-title" style={{ fontWeight: 'bold' }}>{slot.activity}</div>
                                <div className="task-time">{slot.start} - {slot.end}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {examMode && (
                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">Exam Mode Summary</h3>
                    <p className="text-blue-700 text-sm mb-3">Your timetable has been optimized for exam preparation with:</p>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Increased study time: {Math.round(weeklyStudyHours * 1.5)} hours/week (50% boost)</li>
                      <li>• Higher priority for study activities</li>
                      <li>• Focused distribution of time across subjects</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimetableGenerator;
