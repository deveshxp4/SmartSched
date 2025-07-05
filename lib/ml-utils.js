// lib/ml-utils.js - Machine Learning Utilities for SmartSched

// Simple ML algorithms for timetable optimization and productivity prediction

class SmartSchedML {
  constructor() {
    this.productivityWeights = {
      morning: 0.9,    // 6-12 AM
      afternoon: 0.7,  // 12-6 PM
      evening: 0.5,    // 6-12 PM
      night: 0.3       // 12-6 AM
    };
    
    this.subjectDifficulty = {
      'Mathematics': 0.9,
      'Physics': 0.85,
      'Chemistry': 0.8,
      'Biology': 0.75,
      'Computer Science': 0.8,
      'English': 0.6,
      'History': 0.65,
      'Geography': 0.7,
      'Economics': 0.75,
      'default': 0.7
    };
  }

  // Calculate optimal time slots based on productivity patterns
  calculateOptimalTimeSlots(userData, subjects, activities) {
    const timeSlots = [];
    const wakeTime = this.timeToMinutes(userData.wakeUpTime || '07:00');
    const sleepTime = this.timeToMinutes(userData.sleepTime || '23:00');
    
    // Generate time slots in 30-minute intervals
    for (let time = wakeTime; time < sleepTime; time += 30) {
      const productivity = this.calculateProductivityScore(time, userData);
      timeSlots.push({
        time: this.minutesToTime(time),
        minutes: time,
        productivity: productivity,
        available: true
      });
    }
    
    return timeSlots.sort((a, b) => b.productivity - a.productivity);
  }

  // Calculate productivity score for a given time
  calculateProductivityScore(time, userData) {
    const hour = Math.floor(time / 60);
    let baseProductivity = 0.5;
    
    // Time-based productivity
    if (hour >= 6 && hour < 12) {
      baseProductivity = this.productivityWeights.morning;
    } else if (hour >= 12 && hour < 18) {
      baseProductivity = this.productivityWeights.afternoon;
    } else if (hour >= 18 && hour < 24) {
      baseProductivity = this.productivityWeights.evening;
    } else {
      baseProductivity = this.productivityWeights.night;
    }
    
    // Adjust based on user preferences (if available)
    if (userData.preferredStudyTime) {
      const preferredHour = parseInt(userData.preferredStudyTime.split(':')[0]);
      const timeDiff = Math.abs(hour - preferredHour);
      const timeBonus = Math.max(0, 1 - (timeDiff / 6)); // Bonus for preferred time
      baseProductivity += timeBonus * 0.2;
    }
    
    return Math.min(1, baseProductivity);
  }

  // Optimize subject scheduling based on difficulty and productivity
  optimizeSubjectSchedule(subjects, availableTimeSlots, examMode = false) {
    const optimizedSchedule = [];
    const sortedSubjects = subjects.sort((a, b) => {
      const difficultyA = this.subjectDifficulty[a.name] || this.subjectDifficulty.default;
      const difficultyB = this.subjectDifficulty[b.name] || this.subjectDifficulty.default;
      return difficultyB - difficultyA; // Harder subjects first
    });

    let remainingTimeSlots = [...availableTimeSlots];
    
    for (const subject of sortedSubjects) {
      const difficulty = this.subjectDifficulty[subject.name] || this.subjectDifficulty.default;
      const studyTimeNeeded = examMode ? subject.hours * 1.5 : subject.hours;
      
      // Find best time slots for this subject
      const allocatedSlots = this.allocateTimeSlots(
        remainingTimeSlots, 
        studyTimeNeeded * 60, // Convert to minutes
        difficulty
      );
      
      if (allocatedSlots.length > 0) {
        optimizedSchedule.push({
          subject: subject.name,
          timeSlots: allocatedSlots,
          totalMinutes: allocatedSlots.reduce((sum, slot) => sum + 30, 0),
          difficulty: difficulty
        });
        
        // Remove allocated slots from available
        remainingTimeSlots = remainingTimeSlots.filter(slot => 
          !allocatedSlots.some(allocated => allocated.time === slot.time)
        );
      }
    }
    
    return optimizedSchedule;
  }

  // Allocate time slots based on difficulty and productivity
  allocateTimeSlots(availableSlots, minutesNeeded, difficulty) {
    const allocated = [];
    let remainingMinutes = minutesNeeded;
    
    // Filter slots by productivity threshold based on difficulty
    const productivityThreshold = 0.6 + (difficulty * 0.3); // Higher difficulty = higher productivity needed
    const suitableSlots = availableSlots.filter(slot => 
      slot.productivity >= productivityThreshold && slot.available
    );
    
    for (const slot of suitableSlots) {
      if (remainingMinutes <= 0) break;
      
      allocated.push(slot);
      remainingMinutes -= 30; // Each slot is 30 minutes
    }
    
    return allocated;
  }

  // Predict productivity based on historical data
  predictProductivity(userId, date, historicalData) {
    if (!historicalData || historicalData.length === 0) {
      return 0.7; // Default prediction
    }
    
    // Calculate average completion rate
    const avgCompletionRate = historicalData.reduce((sum, day) => 
      sum + day.completion_rate, 0) / historicalData.length;
    
    // Day of week factor
    const dayOfWeek = date.getDay();
    const dayFactors = [0.6, 0.8, 0.85, 0.9, 0.85, 0.7, 0.5]; // Sun to Sat
    const dayFactor = dayFactors[dayOfWeek];
    
    // Recent trend (last 7 days)
    const recentData = historicalData.slice(-7);
    const recentAvg = recentData.length > 0 ? 
      recentData.reduce((sum, day) => sum + day.completion_rate, 0) / recentData.length : 
      avgCompletionRate;
    
    // Weighted prediction
    const prediction = (avgCompletionRate * 0.4) + (recentAvg * 0.4) + (dayFactor * 0.2);
    
    return Math.min(1, Math.max(0, prediction));
  }

  // Generate smart task recommendations
  generateTaskRecommendations(userId, currentSchedule, userPreferences) {
    const recommendations = [];
    
    // Analyze current schedule gaps
    const gaps = this.findScheduleGaps(currentSchedule);
    
    // Recommend based on gaps and preferences
    for (const gap of gaps) {
      if (gap.duration >= 30) { // Only recommend for gaps >= 30 minutes
        const recommendation = this.createRecommendation(gap, userPreferences);
        if (recommendation) {
          recommendations.push(recommendation);
        }
      }
    }
    
    // Add general recommendations
    recommendations.push(...this.getGeneralRecommendations(userPreferences));
    
    return recommendations.slice(0, 5); // Return top 5 recommendations
  }

  // Find gaps in current schedule
  findScheduleGaps(schedule) {
    const gaps = [];
    const dayStart = 6 * 60; // 6 AM
    const dayEnd = 24 * 60;  // 12 AM
    
    for (let time = dayStart; time < dayEnd; time += 30) {
      const hasActivity = schedule.some(activity => {
        const start = this.timeToMinutes(activity.start);
        const end = this.timeToMinutes(activity.end);
        return time >= start && time < end;
      });
      
      if (!hasActivity) {
        // Find the end of this gap
        let gapEnd = time;
        while (gapEnd < dayEnd && !schedule.some(activity => {
          const start = this.timeToMinutes(activity.start);
          const end = this.timeToMinutes(activity.end);
          return gapEnd >= start && gapEnd < end;
        })) {
          gapEnd += 30;
        }
        
        gaps.push({
          start: this.minutesToTime(time),
          end: this.minutesToTime(gapEnd),
          duration: gapEnd - time
        });
        
        time = gapEnd - 30; // Skip to end of gap
      }
    }
    
    return gaps;
  }

  // Create specific recommendation for a time gap
  createRecommendation(gap, preferences) {
    const hour = Math.floor(this.timeToMinutes(gap.start) / 60);
    
    if (gap.duration >= 60) {
      // Long gap - recommend focused study
      return {
        type: 'study',
        title: 'Focused Study Session',
        description: `Use this ${gap.duration / 60} hour block for deep work`,
        priority: 'high',
        timeSlot: gap,
        estimatedProductivity: 0.85
      };
    } else if (gap.duration >= 30) {
      // Medium gap - recommend quick tasks
      return {
        type: 'task',
        title: 'Quick Review Session',
        description: 'Perfect time for reviewing notes or flashcards',
        priority: 'medium',
        timeSlot: gap,
        estimatedProductivity: 0.7
      };
    }
    
    return null;
  }

  // Get general recommendations based on user preferences
  getGeneralRecommendations(preferences) {
    const recommendations = [
      {
        type: 'break',
        title: 'Take Regular Breaks',
        description: 'Schedule 5-10 minute breaks every 90 minutes',
        priority: 'medium',
        estimatedProductivity: 0.8
      },
      {
        type: 'exercise',
        title: 'Include Physical Activity',
        description: 'Add 30 minutes of exercise for better focus',
        priority: 'medium',
        estimatedProductivity: 0.75
      }
    ];
    
    return recommendations;
  }

  // Analyze study patterns and provide insights
  analyzeStudyPatterns(historicalData) {
    if (!historicalData || historicalData.length === 0) {
      return {
        bestDays: [],
        bestTimes: [],
        averageProductivity: 0.7,
        recommendations: ['Start tracking your study sessions to get personalized insights']
      };
    }
    
    // Analyze by day of week
    const dayStats = {};
    for (let i = 0; i < 7; i++) {
      dayStats[i] = { total: 0, count: 0 };
    }
    
    historicalData.forEach(day => {
      const dayOfWeek = new Date(day.date).getDay();
      dayStats[dayOfWeek].total += day.completion_rate;
      dayStats[dayOfWeek].count += 1;
    });
    
    const bestDays = Object.entries(dayStats)
      .filter(([_, stats]) => stats.count > 0)
      .map(([day, stats]) => ({
        day: parseInt(day),
        average: stats.total / stats.count
      }))
      .sort((a, b) => b.average - a.average)
      .slice(0, 3)
      .map(item => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][item.day]);
    
    // Calculate overall average
    const averageProductivity = historicalData.reduce((sum, day) => 
      sum + day.completion_rate, 0) / historicalData.length;
    
    // Generate recommendations
    const recommendations = [];
    if (averageProductivity < 0.6) {
      recommendations.push('Consider reducing study load or adding more breaks');
    }
    if (averageProductivity > 0.8) {
      recommendations.push('Great job! You might be ready to increase your study goals');
    }
    
    return {
      bestDays,
      averageProductivity,
      recommendations
    };
  }

  // Utility functions
  timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  minutesToTime(minutes) {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  // Adaptive learning - update weights based on user feedback
  updateWeights(userFeedback) {
    // Update productivity weights based on user feedback
    if (userFeedback.timeOfDay && userFeedback.productivity) {
      const timeCategory = this.getTimeCategory(userFeedback.timeOfDay);
      if (timeCategory) {
        // Simple exponential moving average
        const alpha = 0.1; // Learning rate
        this.productivityWeights[timeCategory] = 
          (1 - alpha) * this.productivityWeights[timeCategory] + 
          alpha * userFeedback.productivity;
      }
    }
  }

  getTimeCategory(timeStr) {
    const hour = parseInt(timeStr.split(':')[0]);
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 24) return 'evening';
    return 'night';
  }
}

// Export singleton instance
const mlInstance = new SmartSchedML();
export default mlInstance; 