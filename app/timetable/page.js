"use client";
import React, { useState, useEffect } from "react";
import "./style.css";

const TimetableGenerator = () => {
  // State for daily schedule
  const [weekdayWakeUp, setWeekdayWakeUp] = useState("07:00");
  const [weekdaySleep, setWeekdaySleep] = useState("23:00");
  const [weekendWakeUp, setWeekendWakeUp] = useState("08:00");
  const [weekendSleep, setWeekendSleep] = useState("24:00");
  const [examMode, setExamMode] = useState(false);
  const [useML, setUseML] = useState(true);

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

  // Generated/fetched timetable
  const [timetable, setTimetable] = useState({ weekdays: [], weekends: [] });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Fetch timetable on mount
  useEffect(() => {
    const fetchTimetable = async () => {
      setFetching(true);
      try {
        // First get the current user
        const userResponse = await fetch("/api/auth/User");
        const userData = await userResponse.json();
        
        if (userResponse.ok && userData.id) {
          const response = await fetch(`/api/timetable?userId=${userData.id}`);
          const data = await response.json();
          if (data.success) {
            setTimetable({
              weekdays: data.timetable.weekdays,
              weekends: data.timetable.weekends
            });
          }
        } else {
          // Redirect to login if not authenticated
          window.location.href = "/login";
        }
      } catch (error) {
        console.error('Error fetching timetable:', error);
      }
      setFetching(false);
    };
  
    fetchTimetable();
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

// In your TimetableGenerator component
const saveTimetable = async (timetable) => {
  try {
    // Get current user first
    const userResponse = await fetch("/api/auth/User");
    const userData = await userResponse.json();
    
    if (!userResponse.ok || !userData.id) {
      throw new Error("User not authenticated");
    }

    const response = await fetch('/api/timetable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userData.id,
        weekdays: timetable.weekdays,
        weekends: timetable.weekends,
        examMode: examMode // Include exam mode status
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

    return data;
  } catch (error) {
    console.error('Error saving timetable:', error);
    throw error;
  }
};

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading timetable...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Timetable Generator</h1>
          
          {/* Basic Schedule Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Weekday Wake Up</label>
              <input
                type="time"
                value={weekdayWakeUp}
                onChange={(e) => setWeekdayWakeUp(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Weekday Sleep</label>
              <input
                type="time"
                value={weekdaySleep}
                onChange={(e) => setWeekdaySleep(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Weekend Wake Up</label>
              <input
                type="time"
                value={weekendWakeUp}
                onChange={(e) => setWeekendWakeUp(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Weekend Sleep</label>
              <input
                type="time"
                value={weekendSleep}
                onChange={(e) => setWeekendSleep(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Options */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={examMode}
                onChange={(e) => setExamMode(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Exam Mode</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={useML}
                onChange={(e) => setUseML(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Use ML Optimization</span>
            </label>
          </div>

          {/* Meal Times */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Lunch Time</label>
              <input
                type="time"
                value={lunchTime}
                onChange={(e) => setLunchTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Lunch Duration (min)</label>
              <input
                type="number"
                value={lunchDuration}
                onChange={(e) => setLunchDuration(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Dinner Time</label>
              <input
                type="time"
                value={dinnerTime}
                onChange={(e) => setDinnerTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Dinner Duration (min)</label>
              <input
                type="number"
                value={dinnerDuration}
                onChange={(e) => setDinnerDuration(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* College Schedule */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">College Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">College Start Time</label>
                <input
                  type="time"
                  value={collegeStart}
                  onChange={(e) => setCollegeStart(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">College End Time</label>
                <input
                  type="time"
                  value={collegeEnd}
                  onChange={(e) => setCollegeEnd(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">College Days</label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.slice(0, 5).map(day => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day, 'college')}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        collegeDays.includes(day)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Activities */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Activity Name</label>
                <input
                  type="text"
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                  placeholder="e.g., Gym, Reading"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Duration</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={activityDuration.hours}
                    onChange={(e) => setActivityDuration(prev => ({ ...prev, hours: parseInt(e.target.value) || 0 }))}
                    placeholder="Hours"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={activityDuration.minutes}
                    onChange={(e) => setActivityDuration(prev => ({ ...prev, minutes: parseInt(e.target.value) || 0 }))}
                    placeholder="Minutes"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Priority (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={activityPriority}
                  onChange={(e) => setActivityPriority(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Days</label>
                <div className="flex flex-wrap gap-1">
                  {daysOfWeek.map(day => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day, 'activity')}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        activityDays.includes(day)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <button
              onClick={addActivity}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Activity
            </button>
            
            {/* Activities List */}
            <div className="mt-4 space-y-2">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">{activity.name}</span>
                    <span className="text-gray-600 ml-2">({formatDuration(activity.duration)})</span>
                    <span className="text-gray-500 ml-2">Priority: {activity.priority}</span>
                    <span className="text-gray-500 ml-2">Days: {activity.days.join(', ')}</span>
                  </div>
                  <button
                    onClick={() => removeActivity(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Subjects */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Subjects</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Subject Name</label>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="e.g., Mathematics"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Weekly Hours</label>
                <input
                  type="number"
                  value={subjectHours}
                  onChange={(e) => setSubjectHours(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Priority (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={subjectPriority}
                  onChange={(e) => setSubjectPriority(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <button
              onClick={addSubject}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Subject
            </button>
            
            {/* Subjects List */}
            <div className="mt-4 space-y-2">
              {subjects.map((subject, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">{subject.name}</span>
                    <span className="text-gray-600 ml-2">({subject.hours}h/week)</span>
                    <span className="text-gray-500 ml-2">Priority: {subject.priority}</span>
                  </div>
                  <button
                    onClick={() => removeSubject(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Study Plan */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Plan</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Weekly Study Hours</label>
              <input
                type="number"
                value={weeklyStudyHours}
                onChange={(e) => setWeeklyStudyHours(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-center">
            <button
              onClick={() => {/* Your generate function */}}
              disabled={loading}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : 'Generate Timetable'}
            </button>
          </div>
        </div>

        {/* Generated Timetable Display */}
        {(timetable.weekdays.length > 0 || timetable.weekends.length > 0) && (
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Generated Timetable</h2>
            {/* Your timetable display component */}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimetableGenerator;