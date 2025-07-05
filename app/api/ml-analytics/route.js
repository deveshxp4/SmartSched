// app/api/ml-analytics/route.js - ML-Powered Analytics and Insights
import prisma from '@/lib/prisma';
import mlUtils from '@/lib/ml-utils';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const days = parseInt(searchParams.get('days')) || 30;

    if (!userId) {
      return Response.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get user's historical data
    const historicalData = await prisma.taskStats.findMany({
      where: { user_id: Number(userId) },
      orderBy: { date: 'desc' },
      take: days
    });

    // Get task completion data
    const taskCompletions = await prisma.taskCompletion.findMany({
      where: { user_id: Number(userId) },
      orderBy: { date: 'desc' },
      take: days * 10 // Assume average 10 tasks per day
    });

    // Get user's timetables
    const timetables = await prisma.timetable.findMany({
      where: { user_id: Number(userId) },
      orderBy: { created_at: 'desc' },
      take: 5
    });

    // Generate comprehensive analytics
    const analytics = await generateComprehensiveAnalytics(
      userId,
      historicalData,
      taskCompletions,
      timetables
    );

    return Response.json({
      success: true,
      analytics
    });

  } catch (error) {
    console.error('ML Analytics error:', error);
    return Response.json(
      { success: false, error: error.message || 'Failed to generate analytics' },
      { status: 500 }
    );
  }
}

// Generate comprehensive analytics
async function generateComprehensiveAnalytics(userId, historicalData, taskCompletions, timetables) {
  const analytics = {
    productivity: await analyzeProductivity(historicalData),
    patterns: await analyzeStudyPatterns(historicalData, taskCompletions),
    predictions: await generatePredictions(historicalData),
    recommendations: await generatePersonalizedRecommendations(historicalData, taskCompletions),
    insights: await generateInsights(historicalData, timetables),
    trends: await analyzeTrends(historicalData),
    optimization: await analyzeOptimizationOpportunities(historicalData, timetables)
  };

  return analytics;
}

// Analyze productivity patterns
async function analyzeProductivity(historicalData) {
  if (historicalData.length === 0) {
    return {
      averageProductivity: 0,
      bestDays: [],
      worstDays: [],
      productivityTrend: 'no_data',
      consistency: 0,
      dayBreakdown: []
    };
  }

  // Calculate average productivity (convert from percentage to decimal)
  const avgProductivity = historicalData.reduce((sum, day) => 
    sum + (day.completion_rate / 100), 0) / historicalData.length;

  // Analyze by day of week
  const dayStats = {};
  for (let i = 0; i < 7; i++) {
    dayStats[i] = { total: 0, count: 0 };
  }

  historicalData.forEach(day => {
    const dayOfWeek = new Date(day.date).getDay();
    dayStats[dayOfWeek].total += (day.completion_rate / 100);
    dayStats[dayOfWeek].count += 1;
  });

  const dayAverages = Object.entries(dayStats)
    .filter(([_, stats]) => stats.count > 0)
    .map(([day, stats]) => ({
      day: parseInt(day),
      average: stats.total / stats.count,
      dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][parseInt(day)]
    }))
    .sort((a, b) => b.average - a.average);

  const bestDays = dayAverages.slice(0, 3).map(d => d.dayName);
  const worstDays = dayAverages.slice(-3).reverse().map(d => d.dayName);

  // Calculate productivity trend
  const recentData = historicalData.slice(0, 7);
  const olderData = historicalData.slice(-7);
  const recentAvg = recentData.reduce((sum, day) => sum + (day.completion_rate / 100), 0) / recentData.length;
  const olderAvg = olderData.reduce((sum, day) => sum + (day.completion_rate / 100), 0) / olderData.length;
  
  let productivityTrend = 'stable';
  if (recentAvg > olderAvg + 0.1) productivityTrend = 'improving';
  else if (recentAvg < olderAvg - 0.1) productivityTrend = 'declining';

  // Calculate consistency (standard deviation)
  const variance = historicalData.reduce((sum, day) => 
    sum + Math.pow((day.completion_rate / 100) - avgProductivity, 2), 0) / historicalData.length;
  const consistency = Math.max(0, 1 - Math.sqrt(variance));

  return {
    averageProductivity: Math.round(avgProductivity * 100) / 100,
    bestDays,
    worstDays,
    productivityTrend,
    consistency: Math.round(consistency * 100) / 100,
    dayBreakdown: dayAverages
  };
}

// Analyze study patterns
async function analyzeStudyPatterns(historicalData, taskCompletions) {
  if (historicalData.length === 0) {
    return {
      studyHabits: ['No study data available yet'],
      peakHours: [],
      breakPatterns: ['Start using your timetable to see patterns'],
      focusDuration: 0
    };
  }

  // Analyze task completion patterns by time
  const timeSlots = {};
  for (let hour = 6; hour < 24; hour++) {
    timeSlots[hour] = { completed: 0, total: 0 };
  }

  taskCompletions.forEach(task => {
    // Extract time from task_id (assuming format like "09:00-10:00_Study Math")
    const timeMatch = task.task_id.match(/(\d{2}):\d{2}/);
    if (timeMatch) {
      const hour = parseInt(timeMatch[1]);
      if (hour >= 6 && hour < 24) {
        timeSlots[hour].total += 1;
        if (task.completed) {
          timeSlots[hour].completed += 1;
        }
      }
    }
  });

  // Find peak productivity hours
  const peakHours = Object.entries(timeSlots)
    .filter(([_, stats]) => stats.total > 0)
    .map(([hour, stats]) => ({
      hour: parseInt(hour),
      productivity: stats.completed / stats.total,
      totalTasks: stats.total
    }))
    .sort((a, b) => b.productivity - a.productivity)
    .slice(0, 3)
    .map(item => `${item.hour}:00`);

  // Analyze study habits
  const studyHabits = [];
  const avgTasksPerDay = taskCompletions.length / Math.max(1, historicalData.length);
  
  if (avgTasksPerDay > 8) {
    studyHabits.push('High study intensity - You complete many tasks daily');
  } else if (avgTasksPerDay > 5) {
    studyHabits.push('Moderate study intensity - Good balance of tasks');
  } else if (avgTasksPerDay > 0) {
    studyHabits.push('Light study schedule - Consider adding more tasks');
  } else {
    studyHabits.push('No tasks completed yet - Start using your timetable');
  }

  // Add more specific insights based on completion patterns
  const completedTasks = taskCompletions.filter(task => task.completed).length;
  const totalTasks = taskCompletions.length;
  
  if (totalTasks > 0) {
    const completionRate = (completedTasks / totalTasks) * 100;
    if (completionRate > 80) {
      studyHabits.push('Excellent task completion rate');
    } else if (completionRate > 60) {
      studyHabits.push('Good task completion rate');
    } else {
      studyHabits.push('Consider improving task completion rate');
    }
  }

  // Calculate average focus duration
  const focusDuration = Math.round(avgTasksPerDay * 30); // Assuming 30 minutes per task

  return {
    studyHabits,
    peakHours,
    breakPatterns: ['Regular breaks recommended'],
    focusDuration,
    timeSlotAnalysis: timeSlots
  };
}

// Generate predictions
async function generatePredictions(historicalData) {
  if (historicalData.length === 0) {
    return {
      nextWeekProductivity: 0,
      optimalStudyTimes: ['Start using timetable for predictions'],
      expectedCompletionRate: 0,
      confidence: 0
    };
  }

  // Predict next week's productivity
  const recentTrend = historicalData.slice(0, 7);
  const avgRecent = recentTrend.reduce((sum, day) => sum + (day.completion_rate / 100), 0) / recentTrend.length;
  
  // Simple trend prediction
  const trend = recentTrend.length > 1 ? 
    ((recentTrend[0].completion_rate / 100) - (recentTrend[recentTrend.length - 1].completion_rate / 100)) / (recentTrend.length - 1) : 0;
  
  const nextWeekProductivity = Math.min(1, Math.max(0, avgRecent + trend * 7));

  // Predict optimal study times based on historical patterns
  // For now, use default times - this could be enhanced with time-based analysis
  const optimalStudyTimes = ['09:00', '14:00', '16:00'];

  // Calculate expected completion rate
  const expectedCompletionRate = Math.round(nextWeekProductivity * 100) / 100;

  return {
    nextWeekProductivity: Math.round(nextWeekProductivity * 100) / 100,
    optimalStudyTimes,
    expectedCompletionRate,
    confidence: 0.8
  };
}

// Generate personalized recommendations
async function generatePersonalizedRecommendations(historicalData, taskCompletions) {
  const recommendations = [];

  if (historicalData.length === 0) {
    recommendations.push({
      type: 'info',
      title: 'Start Using Your Timetable',
      description: 'Create and use your timetable to get personalized AI recommendations based on your actual study patterns',
      priority: 'high'
    });
    recommendations.push({
      type: 'tip',
      title: 'Track Your Progress',
      description: 'Mark tasks as completed to see your productivity trends and get better insights',
      priority: 'high'
    });
    return recommendations;
  }

  // Analyze completion patterns
  const avgCompletion = historicalData.reduce((sum, day) => sum + (day.completion_rate / 100), 0) / historicalData.length;
  
  if (avgCompletion < 0.5) {
    recommendations.push({
      type: 'warning',
      title: 'Low Completion Rate',
      description: `Your average completion rate is ${Math.round(avgCompletion * 100)}%. Consider reducing study load or improving time management.`,
      priority: 'high'
    });
  } else if (avgCompletion > 0.8) {
    recommendations.push({
      type: 'success',
      title: 'Excellent Progress',
      description: `Your average completion rate is ${Math.round(avgCompletion * 100)}%! You might be ready to increase your study goals.`,
      priority: 'medium'
    });
  } else {
    recommendations.push({
      type: 'tip',
      title: 'Good Progress',
      description: `Your average completion rate is ${Math.round(avgCompletion * 100)}%. Keep up the good work!`,
      priority: 'medium'
    });
  }

  // Analyze consistency
  const consistency = calculateConsistency(historicalData);
  if (consistency < 0.6) {
    recommendations.push({
      type: 'tip',
      title: 'Improve Consistency',
      description: `Your consistency score is ${Math.round(consistency * 100)}%. Try to maintain a more regular study schedule.`,
      priority: 'medium'
    });
  } else {
    recommendations.push({
      type: 'success',
      title: 'Great Consistency',
      description: `Your consistency score is ${Math.round(consistency * 100)}%. You maintain a very regular study schedule!`,
      priority: 'low'
    });
  }

  // Recommend based on patterns
  const dayPatterns = analyzeDayPatterns(historicalData);
  if (dayPatterns.weekendDrop) {
    recommendations.push({
      type: 'suggestion',
      title: 'Weekend Study',
      description: 'Consider adding some study time on weekends for better retention',
      priority: 'medium'
    });
  }

  // Add general recommendations
  recommendations.push({
    type: 'tip',
    title: 'Take Regular Breaks',
    description: 'Schedule 5-10 minute breaks every 90 minutes',
    priority: 'low'
  });

  return recommendations.slice(0, 5); // Return top 5 recommendations
}

// Generate insights
async function generateInsights(historicalData, timetables) {
  const insights = [];

  if (historicalData.length === 0) {
    insights.push({
      type: 'info',
      message: 'Start using your timetable to unlock personalized insights based on your actual study patterns',
      impact: 'medium'
    });
    return insights;
  }

  // Analyze productivity trends
  const recentAvg = historicalData.slice(0, 7).reduce((sum, day) => sum + (day.completion_rate / 100), 0) / 7;
  const overallAvg = historicalData.reduce((sum, day) => sum + (day.completion_rate / 100), 0) / historicalData.length;

  if (recentAvg > overallAvg + 0.1) {
    insights.push({
      type: 'positive',
      message: 'Your productivity has improved recently! Keep up the good work.',
      impact: 'high'
    });
  } else if (recentAvg < overallAvg - 0.1) {
    insights.push({
      type: 'warning',
      message: 'Your productivity has declined recently. Consider reviewing your study habits.',
      impact: 'high'
    });
  }

  // Analyze best performing days
  const dayStats = {};
  historicalData.forEach(day => {
    const dayOfWeek = new Date(day.date).getDay();
    if (!dayStats[dayOfWeek]) dayStats[dayOfWeek] = [];
    dayStats[dayOfWeek].push(day.completion_rate / 100);
  });

  const bestDay = Object.entries(dayStats)
    .map(([day, rates]) => ({
      day: parseInt(day),
      average: rates.reduce((sum, rate) => sum + rate, 0) / rates.length
    }))
    .sort((a, b) => b.average - a.average)[0];

  if (bestDay) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    insights.push({
      type: 'insight',
      message: `${dayNames[bestDay.day]} is your most productive day with ${Math.round(bestDay.average * 100)}% completion rate`,
      impact: 'medium'
    });
  }

  // Add insights about data quality
  if (historicalData.length < 7) {
    insights.push({
      type: 'tip',
      message: `You have ${historicalData.length} days of data. More data will provide better insights.`,
      impact: 'low'
    });
  } else {
    insights.push({
      type: 'positive',
      message: `You have ${historicalData.length} days of data. Great for generating accurate insights!`,
      impact: 'medium'
    });
  }

  return insights;
}

// Analyze trends
async function analyzeTrends(historicalData) {
  if (historicalData.length < 7) {
    return {
      weeklyTrend: 'insufficient_data',
      monthlyTrend: 'insufficient_data',
      seasonalPatterns: []
    };
  }

  // Weekly trend
  const lastWeek = historicalData.slice(0, 7);
  const previousWeek = historicalData.slice(7, 14);
  
  const lastWeekAvg = lastWeek.reduce((sum, day) => sum + (day.completion_rate / 100), 0) / lastWeek.length;
  const previousWeekAvg = previousWeek.reduce((sum, day) => sum + (day.completion_rate / 100), 0) / previousWeek.length;
  
  let weeklyTrend = 'stable';
  if (lastWeekAvg > previousWeekAvg + 0.05) weeklyTrend = 'improving';
  else if (lastWeekAvg < previousWeekAvg - 0.05) weeklyTrend = 'declining';

  // Monthly trend (if enough data)
  let monthlyTrend = 'insufficient_data';
  if (historicalData.length >= 28) {
    const lastMonth = historicalData.slice(0, 28);
    const previousMonth = historicalData.slice(28, 56);
    
    if (previousMonth.length >= 28) {
      const lastMonthAvg = lastMonth.reduce((sum, day) => sum + (day.completion_rate / 100), 0) / lastMonth.length;
      const previousMonthAvg = previousMonth.reduce((sum, day) => sum + (day.completion_rate / 100), 0) / previousMonth.length;
      
      if (lastMonthAvg > previousMonthAvg + 0.05) monthlyTrend = 'improving';
      else if (lastMonthAvg < previousMonthAvg - 0.05) monthlyTrend = 'declining';
      else monthlyTrend = 'stable';
    }
  }

  return {
    weeklyTrend,
    monthlyTrend,
    seasonalPatterns: []
  };
}

// Analyze optimization opportunities
async function analyzeOptimizationOpportunities(historicalData, timetables) {
  const opportunities = [];

  if (historicalData.length === 0) {
    opportunities.push({
      type: 'baseline',
      title: 'Establish Baseline',
      description: 'Start tracking to identify optimization opportunities',
      potential: 'medium'
    });
    return opportunities;
  }

  // Analyze low productivity periods
  const dayStats = {};
  historicalData.forEach(day => {
    const dayOfWeek = new Date(day.date).getDay();
    if (!dayStats[dayOfWeek]) dayStats[dayOfWeek] = [];
    dayStats[dayOfWeek].push(day.completion_rate / 100);
  });

  const worstDay = Object.entries(dayStats)
    .map(([day, rates]) => ({
      day: parseInt(day),
      average: rates.reduce((sum, rate) => sum + rate, 0) / rates.length
    }))
    .sort((a, b) => a.average - b.average)[0];

  if (worstDay && worstDay.average < 0.6) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    opportunities.push({
      type: 'productivity',
      title: `Improve ${dayNames[worstDay.day]} Productivity`,
      description: `Your productivity on ${dayNames[worstDay.day]} is ${Math.round(worstDay.average * 100)}%. Consider adjusting your schedule.`,
      potential: 'high'
    });
  }

  // Analyze consistency opportunities
  const consistency = calculateConsistency(historicalData);
  if (consistency < 0.7) {
    opportunities.push({
      type: 'consistency',
      title: 'Improve Schedule Consistency',
      description: 'Your study schedule varies significantly. Try to maintain more consistent study times.',
      potential: 'medium'
    });
  }

  return opportunities;
}

// Helper functions
function calculateConsistency(historicalData) {
  if (historicalData.length < 2) return 0.5;
  
  const avg = historicalData.reduce((sum, day) => sum + (day.completion_rate / 100), 0) / historicalData.length;
  const variance = historicalData.reduce((sum, day) => 
    sum + Math.pow((day.completion_rate / 100) - avg, 2), 0) / historicalData.length;
  
  return Math.max(0, 1 - Math.sqrt(variance));
}

function analyzeDayPatterns(historicalData) {
  const weekdayData = [];
  const weekendData = [];

  historicalData.forEach(day => {
    const dayOfWeek = new Date(day.date).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendData.push(day.completion_rate / 100);
    } else {
      weekdayData.push(day.completion_rate / 100);
    }
  });

  const weekdayAvg = weekdayData.length > 0 ? 
    weekdayData.reduce((sum, rate) => sum + rate, 0) / weekdayData.length : 0;
  const weekendAvg = weekendData.length > 0 ? 
    weekendData.reduce((sum, rate) => sum + rate, 0) / weekendData.length : 0;

  return {
    weekendDrop: weekendAvg < weekdayAvg - 0.1,
    weekdayAvg,
    weekendAvg
  };
} 