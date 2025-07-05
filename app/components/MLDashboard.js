"use client";
import React, { useState, useEffect } from 'react';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  LightBulbIcon,
  ChartBarIcon,
  AcademicCapIcon,
  CalendarIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const MLDashboard = ({ userId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (userId) {
      fetchAnalytics();
    }
  }, [userId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ml-analytics?userId=${userId}&days=30`);
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.analytics);
      } else {
        setError(data.error || 'Failed to fetch analytics');
      }
    } catch (error) {
      setError('Failed to load analytics');
      console.error('Analytics fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <div className="mb-4">
          <LightBulbIcon className="h-12 w-12 text-gray-400 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analytics Data Yet</h3>
        <p className="text-gray-600 mb-4">
          Start using your timetable to unlock personalized AI insights and recommendations.
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>• Create and use your timetable</p>
          <p>• Mark tasks as completed</p>
          <p>• Track your progress daily</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI-Powered Insights</h2>
          <p className="text-gray-600">Personalized analytics and recommendations</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('productivity')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'productivity'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Productivity
          </button>
          <button
            onClick={() => setActiveTab('predictions')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'predictions'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Predictions
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Productivity Score */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Productivity Score</h3>
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {analytics.productivity.averageProductivity > 0 
                ? `${Math.round(analytics.productivity.averageProductivity * 100)}%`
                : 'No Data'
              }
            </div>
            <div className="flex items-center text-sm text-gray-600">
              {analytics.productivity.productivityTrend === 'improving' ? (
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
              ) : analytics.productivity.productivityTrend === 'declining' ? (
                <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
              ) : (
                <div className="h-4 w-4 mr-1">—</div>
              )}
              {analytics.productivity.productivityTrend === 'improving' ? 'Improving' : 
               analytics.productivity.productivityTrend === 'declining' ? 'Declining' : 'Stable'}
            </div>
          </div>

          {/* Best Days */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Best Days</h3>
              <CalendarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="space-y-2">
              {analytics.productivity.bestDays.slice(0, 3).map((day, index) => (
                <div key={day} className="flex items-center">
                  <StarIcon className="h-4 w-4 text-yellow-500 mr-2" />
                  <span className="text-sm text-gray-700">{day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Consistency Score */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Consistency</h3>
              <ClockIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {analytics.productivity.consistency > 0 
                ? `${Math.round(analytics.productivity.consistency * 100)}%`
                : 'No Data'
              }
            </div>
            <div className="text-sm text-gray-600">
              Schedule consistency
            </div>
          </div>

          {/* Peak Hours */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Peak Hours</h3>
              <AcademicCapIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="space-y-2">
              {analytics.patterns.peakHours.map((hour, index) => (
                <div key={hour} className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-700">{hour}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Week Prediction */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Next Week</h3>
              <ArrowTrendingUpIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {analytics.predictions.nextWeekProductivity > 0 
                ? `${Math.round(analytics.predictions.nextWeekProductivity * 100)}%`
                : 'No Data'
              }
            </div>
            <div className="text-sm text-gray-600">
              Predicted productivity
            </div>
          </div>

          {/* Focus Duration */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Focus Duration</h3>
              <ClockIcon className="h-6 w-6 text-teal-600" />
            </div>
            <div className="text-3xl font-bold text-teal-600 mb-2">
              {analytics.patterns.focusDuration > 0 
                ? `${analytics.patterns.focusDuration}m`
                : 'No Data'
              }
            </div>
            <div className="text-sm text-gray-600">
              Average daily focus
            </div>
          </div>
        </div>
      )}

      {/* Productivity Tab */}
      {activeTab === 'productivity' && (
        <div className="space-y-6">
          {/* Productivity Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Productivity by Day</h3>
            <div className="grid grid-cols-7 gap-2">
              {analytics.productivity.dayBreakdown.map((day) => (
                <div key={day.day} className="text-center">
                  <div className="text-xs text-gray-600 mb-1">{day.dayName.slice(0, 3)}</div>
                  <div className="h-20 bg-gray-100 rounded relative overflow-hidden">
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-blue-500 transition-all duration-300"
                      style={{ height: `${day.average * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-700 mt-1">
                    {Math.round(day.average * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Study Habits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Habits</h3>
              <div className="space-y-3">
                {analytics.patterns.studyHabits.map((habit, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700">{habit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Break Patterns</h3>
              <div className="space-y-3">
                {analytics.patterns.breakPatterns.map((pattern, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700">{pattern}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Predictions Tab */}
      {activeTab === 'predictions' && (
        <div className="space-y-6">
          {/* Predictions Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Week Prediction</h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {Math.round(analytics.predictions.nextWeekProductivity * 100)}%
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Predicted productivity
              </div>
              <div className="text-xs text-gray-500">
                Confidence: {Math.round(analytics.predictions.confidence * 100)}%
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimal Study Times</h3>
              <div className="space-y-2">
                {analytics.predictions.optimalStudyTimes.map((time, index) => (
                  <div key={time} className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700">{time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Expected Completion</h3>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {Math.round(analytics.predictions.expectedCompletionRate * 100)}%
              </div>
              <div className="text-sm text-gray-600">
                Task completion rate
              </div>
            </div>
          </div>

          {/* Trends */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trends</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-2">Weekly Trend</h4>
                <div className="flex items-center">
                  {analytics.trends.weeklyTrend === 'improving' ? (
                    <ArrowTrendingUpIcon className="h-5 w-5 text-green-500 mr-2" />
                  ) : analytics.trends.weeklyTrend === 'declining' ? (
                    <ArrowTrendingDownIcon className="h-5 w-5 text-red-500 mr-2" />
                  ) : (
                    <div className="h-5 w-5 mr-2">—</div>
                  )}
                  <span className="text-sm text-gray-700 capitalize">{analytics.trends.weeklyTrend}</span>
                </div>
              </div>
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-2">Monthly Trend</h4>
                <div className="flex items-center">
                  {analytics.trends.monthlyTrend === 'improving' ? (
                    <ArrowTrendingUpIcon className="h-5 w-5 text-green-500 mr-2" />
                  ) : analytics.trends.monthlyTrend === 'declining' ? (
                    <ArrowTrendingDownIcon className="h-5 w-5 text-red-500 mr-2" />
                  ) : (
                    <div className="h-5 w-5 mr-2">—</div>
                  )}
                  <span className="text-sm text-gray-700 capitalize">{analytics.trends.monthlyTrend}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
          <LightBulbIcon className="h-6 w-6 text-yellow-600" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analytics.recommendations.map((rec, index) => (
            <div key={index} className={`p-4 rounded-lg border-l-4 ${
              rec.type === 'warning' ? 'border-red-500 bg-red-50' :
              rec.type === 'success' ? 'border-green-500 bg-green-50' :
              rec.type === 'tip' ? 'border-blue-500 bg-blue-50' :
              'border-gray-500 bg-gray-50'
            }`}>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {rec.type === 'warning' ? (
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  ) : rec.type === 'success' ? (
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  ) : (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  )}
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">{rec.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        <div className="space-y-3">
          {analytics.insights.map((insight, index) => (
            <div key={index} className={`p-3 rounded-lg ${
              insight.type === 'positive' ? 'bg-green-50 border border-green-200' :
              insight.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
              'bg-blue-50 border border-blue-200'
            }`}>
              <p className="text-sm text-gray-700">{insight.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MLDashboard; 