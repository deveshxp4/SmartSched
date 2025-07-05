// app/api/ml-timetable/route.js - ML-Powered Timetable Generation
import prisma from '@/lib/prisma';
import mlUtils from '@/lib/ml-utils';

export async function POST(request) {
  try {
    const { 
      userId, 
      subjects, 
      activities, 
      userPreferences, 
      examMode = false,
      useML = true 
    } = await request.json();

    if (!userId) {
      return Response.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get user's historical data for ML insights
    const historicalData = await prisma.taskStats.findMany({
      where: { user_id: Number(userId) },
      orderBy: { date: 'desc' },
      take: 30 // Last 30 days
    });

    // Get user preferences and schedule constraints
    const userData = {
      wakeUpTime: userPreferences?.wakeUpTime || '07:00',
      sleepTime: userPreferences?.sleepTime || '23:00',
      preferredStudyTime: userPreferences?.preferredStudyTime,
      collegeDays: userPreferences?.collegeDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      collegeStart: userPreferences?.collegeStart || '08:30',
      collegeEnd: userPreferences?.collegeEnd || '17:00',
      lunchTime: userPreferences?.lunchTime || '12:20',
      dinnerTime: userPreferences?.dinnerTime || '19:00'
    };

    let optimizedTimetable;

    if (useML) {
      // Use ML-powered optimization
      optimizedTimetable = await generateMLTimetable(
        userData, 
        subjects, 
        activities, 
        historicalData, 
        examMode
      );
    } else {
      // Use traditional algorithm
      optimizedTimetable = await generateTraditionalTimetable(
        userData, 
        subjects, 
        activities, 
        examMode
      );
    }

    // Save the optimized timetable
    const savedTimetable = await prisma.timetable.create({
      data: {
        user_id: Number(userId),
        weekdays: optimizedTimetable.weekdays,
        weekends: optimizedTimetable.weekends,
        metadata: {
          generatedWithML: useML,
          examMode: examMode,
          optimizationScore: optimizedTimetable.optimizationScore,
          generatedAt: new Date().toISOString()
        }
      }
    });

    return Response.json({
      success: true,
      timetable: savedTimetable,
      insights: optimizedTimetable.insights,
      recommendations: optimizedTimetable.recommendations
    });

  } catch (error) {
    console.error('ML Timetable generation error:', error);
    return Response.json(
      { success: false, error: error.message || 'Failed to generate ML timetable' },
      { status: 500 }
    );
  }
}

// ML-powered timetable generation
async function generateMLTimetable(userData, subjects, activities, historicalData, examMode) {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const weekdays = [];
  const weekends = [];

  // Calculate productivity prediction for today
  const todayProductivity = mlUtils.predictProductivity(null, new Date(), historicalData);

  // Generate optimized schedules for each day
  for (const day of daysOfWeek) {
    const isCollegeDay = userData.collegeDays.includes(day);
    const daySchedule = await generateOptimizedDaySchedule(
      day, 
      isCollegeDay, 
      userData, 
      subjects, 
      activities, 
      historicalData, 
      examMode,
      todayProductivity
    );

    if (isCollegeDay) {
      weekdays.push(daySchedule);
    } else {
      weekends.push(daySchedule);
    }
  }

  // Generate insights and recommendations
  const insights = mlUtils.analyzeStudyPatterns(historicalData);
  const recommendations = generateSmartRecommendations(
    userData, 
    subjects, 
    activities, 
    historicalData, 
    examMode
  );

  // Calculate optimization score
  const optimizationScore = calculateOptimizationScore(weekdays, weekends, subjects, examMode);

  return {
    weekdays,
    weekends,
    insights,
    recommendations,
    optimizationScore
  };
}

// Generate optimized schedule for a single day
async function generateOptimizedDaySchedule(
  day, 
  isCollegeDay, 
  userData, 
  subjects, 
  activities, 
  historicalData, 
  examMode,
  productivityPrediction
) {
  const schedule = [];
  let currentTime = mlUtils.timeToMinutes(userData.wakeUpTime);

  // Add morning routine
  if (isCollegeDay) {
    const collegeStartMins = mlUtils.timeToMinutes(userData.collegeStart);
    if (currentTime < collegeStartMins) {
      schedule.push({
        start: mlUtils.minutesToTime(currentTime),
        end: mlUtils.minutesToTime(collegeStartMins),
        activity: "Morning Routine",
        type: "routine",
        productivity: 0.6
      });
      currentTime = collegeStartMins;
    }
  }

  // College time (for weekdays)
  if (isCollegeDay) {
    const collegeStartMins = mlUtils.timeToMinutes(userData.collegeStart);
    const collegeEndMins = mlUtils.timeToMinutes(userData.collegeEnd);
    const lunchMins = mlUtils.timeToMinutes(userData.lunchTime);
    const lunchDuration = 40; // minutes

    // College before lunch
    if (collegeStartMins < lunchMins) {
      const collegeBeforeLunch = Math.min(collegeEndMins, lunchMins) - collegeStartMins;
      if (collegeBeforeLunch > 0) {
        schedule.push({
          start: mlUtils.minutesToTime(collegeStartMins),
          end: mlUtils.minutesToTime(collegeStartMins + collegeBeforeLunch),
          activity: "College",
          type: "fixed",
          productivity: 0.8
        });
        currentTime = collegeStartMins + collegeBeforeLunch;
      }
    }

    // Lunch break
    if (lunchMins >= collegeStartMins && lunchMins < collegeEndMins) {
      schedule.push({
        start: mlUtils.minutesToTime(lunchMins),
        end: mlUtils.minutesToTime(lunchMins + lunchDuration),
        activity: "Lunch Break",
        type: "break",
        productivity: 0.3
      });
      currentTime = lunchMins + lunchDuration;

      // College after lunch
      const remainingCollege = collegeEndMins - lunchMins - lunchDuration;
      if (remainingCollege > 0) {
        schedule.push({
          start: mlUtils.minutesToTime(lunchMins + lunchDuration),
          end: mlUtils.minutesToTime(collegeEndMins),
          activity: "College",
          type: "fixed",
          productivity: 0.7 // Slightly lower after lunch
        });
        currentTime = collegeEndMins;
      }
    }
  } else {
    // Weekend morning activities
    const lunchMins = mlUtils.timeToMinutes(userData.lunchTime);
    if (currentTime < lunchMins) {
      schedule.push({
        start: mlUtils.minutesToTime(currentTime),
        end: mlUtils.minutesToTime(lunchMins),
        activity: "Morning Activities",
        type: "flexible",
        productivity: 0.6
      });
      currentTime = lunchMins;
    }
  }

  // Lunch for all days
  const lunchMins = mlUtils.timeToMinutes(userData.lunchTime);
  const lunchDuration = 40;
  schedule.push({
    start: mlUtils.minutesToTime(lunchMins),
    end: mlUtils.minutesToTime(lunchMins + lunchDuration),
    activity: "Lunch",
    type: "break",
    productivity: 0.3
  });
  currentTime = lunchMins + lunchDuration;

  // Optimize study and activity scheduling using ML
  const optimizedActivities = await optimizeActivitiesForDay(
    day,
    currentTime,
    mlUtils.timeToMinutes(userData.dinnerTime),
    subjects,
    activities,
    examMode,
    productivityPrediction
  );

  // Add optimized activities
  optimizedActivities.forEach(activity => {
    schedule.push({
      start: mlUtils.minutesToTime(currentTime),
      end: mlUtils.minutesToTime(currentTime + activity.duration),
      activity: activity.name,
      type: activity.type,
      productivity: activity.productivity,
      priority: activity.priority
    });
    currentTime += activity.duration;
  });

  // Dinner
  const dinnerMins = mlUtils.timeToMinutes(userData.dinnerTime);
  const dinnerDuration = 30;
  schedule.push({
    start: mlUtils.minutesToTime(dinnerMins),
    end: mlUtils.minutesToTime(dinnerMins + dinnerDuration),
    activity: "Dinner",
    type: "break",
    productivity: 0.3
  });
  currentTime = dinnerMins + dinnerDuration;

  // Evening activities
  const sleepMins = mlUtils.timeToMinutes(userData.sleepTime);
  if (currentTime < sleepMins) {
    const eveningActivities = await optimizeActivitiesForDay(
      day,
      currentTime,
      sleepMins,
      subjects,
      activities,
      examMode,
      productivityPrediction * 0.8 // Evening productivity is lower
    );

    eveningActivities.forEach(activity => {
      schedule.push({
        start: mlUtils.minutesToTime(currentTime),
        end: mlUtils.minutesToTime(currentTime + activity.duration),
        activity: activity.name,
        type: activity.type,
        productivity: activity.productivity * 0.8, // Evening adjustment
        priority: activity.priority
      });
      currentTime += activity.duration;
    });
  }

  return { day, schedule };
}

// Optimize activities for a specific time period
async function optimizeActivitiesForDay(
  day,
  startTime,
  endTime,
  subjects,
  activities,
  examMode,
  productivityPrediction
) {
  const availableMinutes = endTime - startTime;
  const optimizedActivities = [];

  // Calculate daily study requirements
  const examModeMultiplier = examMode ? 1.5 : 1;
  const dailyStudyHours = subjects.reduce((sum, subject) => 
    sum + (subject.hours * examModeMultiplier), 0) / 7;

  // Get activities for this day
  const dayActivities = [
    // Study subjects
    ...subjects.map(subject => ({
      name: `Study ${subject.name}`,
      duration: Math.round((subject.hours * 60 * examModeMultiplier) / 7),
      type: 'study',
      priority: examMode ? Math.min(subject.priority + 2, 10) : subject.priority,
      difficulty: mlUtils.subjectDifficulty[subject.name] || mlUtils.subjectDifficulty.default
    })),
    // Personal activities
    ...activities
      .filter(act => act.days.includes(day))
      .map(act => ({
        name: act.name,
        duration: act.duration,
        type: 'activity',
        priority: examMode ? Math.max(act.priority - 2, 1) : act.priority,
        difficulty: 0.5
      }))
  ].filter(act => act.duration > 0);

  // Sort by ML-optimized priority (difficulty + productivity + user priority)
  const sortedActivities = dayActivities.sort((a, b) => {
    const scoreA = (a.difficulty * 0.4) + (productivityPrediction * 0.3) + (a.priority * 0.3);
    const scoreB = (b.difficulty * 0.4) + (productivityPrediction * 0.3) + (b.priority * 0.3);
    return scoreB - scoreA;
  });

  // Allocate time slots
  let remainingTime = availableMinutes;
  for (const activity of sortedActivities) {
    if (remainingTime <= 0) break;

    const duration = Math.min(activity.duration, remainingTime);
    if (duration >= 15) { // Minimum 15-minute slots
      optimizedActivities.push({
        ...activity,
        duration: duration,
        productivity: calculateActivityProductivity(activity, productivityPrediction)
      });
      remainingTime -= duration;
    }
  }

  return optimizedActivities;
}

// Calculate productivity for a specific activity
function calculateActivityProductivity(activity, baseProductivity) {
  let productivity = baseProductivity;

  // Adjust based on activity type
  if (activity.type === 'study') {
    productivity *= 1.1; // Study activities are more productive
  } else if (activity.type === 'activity') {
    productivity *= 0.9; // Personal activities slightly less productive
  }

  // Adjust based on difficulty
  if (activity.difficulty > 0.8) {
    productivity *= 0.9; // Harder subjects might be slightly less productive
  }

  return Math.min(1, Math.max(0.3, productivity));
}

// Generate smart recommendations
function generateSmartRecommendations(userData, subjects, activities, historicalData, examMode) {
  const recommendations = [];

  // Analyze study load
  const totalStudyHours = subjects.reduce((sum, subject) => sum + subject.hours, 0);
  const avgProductivity = historicalData.length > 0 ? 
    historicalData.reduce((sum, day) => sum + day.completion_rate, 0) / historicalData.length : 0.7;

  if (totalStudyHours > 30 && avgProductivity < 0.6) {
    recommendations.push({
      type: 'warning',
      title: 'High Study Load Detected',
      description: 'Consider reducing study hours or improving time management',
      priority: 'high'
    });
  }

  if (examMode && totalStudyHours < 20) {
    recommendations.push({
      type: 'suggestion',
      title: 'Increase Study Time for Exam Mode',
      description: 'Consider adding more study hours for better exam preparation',
      priority: 'medium'
    });
  }

  // Recommend breaks
  recommendations.push({
    type: 'tip',
    title: 'Schedule Regular Breaks',
    description: 'Take 5-10 minute breaks every 90 minutes for better focus',
    priority: 'medium'
  });

  return recommendations;
}

// Calculate optimization score
function calculateOptimizationScore(weekdays, weekends, subjects, examMode) {
  let score = 0;
  let totalSlots = 0;

  // Analyze weekday schedules
  weekdays.forEach(day => {
    day.schedule.forEach(slot => {
      if (slot.type === 'study') {
        score += slot.productivity || 0.7;
        totalSlots++;
      }
    });
  });

  // Analyze weekend schedules
  weekends.forEach(day => {
    day.schedule.forEach(slot => {
      if (slot.type === 'study') {
        score += slot.productivity || 0.7;
        totalSlots++;
      }
    });
  });

  const avgScore = totalSlots > 0 ? score / totalSlots : 0.7;
  return Math.round(avgScore * 100);
}

// Traditional timetable generation (fallback)
async function generateTraditionalTimetable(userData, subjects, activities, examMode) {
  // This would be the original algorithm
  // For now, return a basic structure
  return {
    weekdays: [],
    weekends: [],
    insights: { averageProductivity: 0.7, recommendations: [] },
    recommendations: [],
    optimizationScore: 70
  };
} 