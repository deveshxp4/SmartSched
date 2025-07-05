"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import ProductivityChart from "../components/ProductivityChart";
import MLDashboard from "../components/MLDashboard";
import { Calendar, CheckSquare, Settings, LogOut, User, PieChart, Brain } from "lucide-react";

const Dashboard = () => {
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Fetching user data...");
        const response = await fetch("/api/auth/User");
        const data = await response.json();
        console.log("User API response:", data);
        
        if (response.ok && data.id) {
          setUserName(data.name);
          setUserId(data.id);
          console.log("User authenticated:", data.name);
          
          try {
            console.log("Fetching timetable for user ID:", data.id);
            const timetableResponse = await fetch(`/api/timetable?userId=${data.id}`);
            const timetableData = await timetableResponse.json();
            console.log("Timetable response:", timetableData);
            
            if (timetableResponse.ok && timetableData.success) {
              setTimetable(timetableData.timetable);
              console.log("Timetable loaded successfully");
            }
          } catch (timetableError) {
            console.error("Error fetching timetable:", timetableError);
            // Don't redirect on timetable fetch error
          }
        } else {
          console.error("Authentication failed:", data.error);
          setError(`Authentication failed: ${data.error || 'Unknown error'}`);
          // Delayed redirect
          setTimeout(() => {
            window.location.href = "/login";
          }, 3000);
        }
      } catch (error) {
        console.error("Error in dashboard:", error);
        setError(`Failed to load user data: ${error.message || 'Unknown error'}`);
        // Delayed redirect
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      // Call the logout API to clear server-side session
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear client-side storage
    localStorage.removeItem("isLoggedIn");
    Cookies.remove("user_session");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-red-500 mb-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-bold mt-2">Error</h2>
          </div>
          <p className="text-gray-700 text-center">{error}</p>
          <p className="text-gray-500 text-center mt-4">Redirecting to login in 5 seconds...</p>
        </div>
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
                <User size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Welcome,</p>
                <p className="font-medium text-gray-800">{userName || "User"}</p>
              </div>
            </div>
            
            <nav className="space-y-1">
              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-600">
                <PieChart size={20} />
                <span className="font-medium">Dashboard</span>
              </a>
              
              <Link href="/my-timetable" className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition ${!timetable && 'opacity-50 pointer-events-none'}`}>
                <Calendar size={20} />
                <span className="font-medium">My Timetable</span>
              </Link>
              
              <Link href="/daily-timetable" className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition ${!timetable && 'opacity-50 pointer-events-none'}`}>
                <CheckSquare size={20} />
                <span className="font-medium">Daily Tasks</span>
              </Link>
              
              <Link href="/timetable" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition">
                <Settings size={20} />
                <span className="font-medium">Generate Timetable</span>
              </Link>
              
              <Link href="/timetableChatbot" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition">
                <Brain size={20} />
                <span className="font-medium">AI Assistant</span>
              </Link>
            </nav>
          </div>
          
          <div className="mt-auto p-6 border-t border-gray-200">
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="ml-64 p-8">
        {userName && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Timetable Status</p>
                      <p className="text-lg font-semibold">{timetable ? "Active" : "Not Generated"}</p>
                    </div>
                    <Calendar className="text-blue-600" size={24} />
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Today's Tasks</p>
                      <p className="text-lg font-semibold">{timetable ? "View Daily" : "Generate First"}</p>
                    </div>
                    <CheckSquare className="text-green-600" size={24} />
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Account</p>
                      <p className="text-lg font-semibold">Active</p>
                    </div>
                    <User className="text-purple-600" size={24} />
                  </div>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">AI Insights</p>
                      <p className="text-lg font-semibold">Available</p>
                    </div>
                    <Brain className="text-orange-600" size={24} />
                  </div>
                </div>
              </div>
            </div>
            
            {timetable ? (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Productivity Overview</h2>
                  <select className="bg-gray-100 border-0 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Last 14 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  {userId && <ProductivityChart userId={userId} days={14} />}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <Calendar className="text-blue-600" size={28} />
                </div>
                <h3 className="text-lg font-semibold mb-2">Generate Your First Timetable</h3>
                <p className="text-gray-600 mb-4 max-w-md mx-auto">
                  Create a personalized timetable to start tracking your productivity and manage your tasks effectively.
                </p>
                <Link href="/timetable">
                  <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    Get Started
                  </button>
                </Link>
              </div>
            )}
            
            {/* ML-Powered Analytics Dashboard */}
            {userId && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <MLDashboard userId={userId} />
              </div>
            )}
            
            {timetable && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Productivity Tips</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-800 mb-2">Track Daily Progress</h3>
                    <p className="text-gray-600 text-sm">Check off tasks as you complete them to maintain a clear record of your productivity.</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-800 mb-2">Consistency Matters</h3>
                    <p className="text-gray-600 text-sm">Aim for consistent task completion each day rather than occasional bursts of activity.</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-800 mb-2">Monitor Trends</h3>
                    <p className="text-gray-600 text-sm">Track your progress over time to identify patterns and stay motivated.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;