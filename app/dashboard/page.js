"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import ProductivityChart from "../components/ProductivityChart";
import { Calendar, CheckSquare, Settings, LogOut, User, PieChart } from "lucide-react";

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

        if (response.ok) {
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
          }, 5000);
        }
      } catch (error) {
        console.error("Error in dashboard:", error);
        setError(`Failed to load user data: ${error.message || 'Unknown error'}`);
        // Delayed redirect
        setTimeout(() => {
          window.location.href = "/login";
        }, 5000);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);



  const handleLogout = () => {
    // Clear both cookie and localStorage
    Cookies.remove("user_session");
    localStorage.removeItem("isLoggedIn");

    // Dispatch events to notify other components of logout
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("loginStateChanged"));

    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="w-16 h-16 border-4 border-t-black border-gray-200 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full border border-gray-200">
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
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <div className="fixed top-20 left-0 h-[600px] w-64 bg-white border-r border-gray-200 z-10 overflow-hidden">
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
              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-black text-white">
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
            </nav>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-white">
            <button
              onClick={handleLogout}
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
        {userName && (
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-black mb-6">Overview</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Timetable Status Card */}
                <div className="card w-full">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-gray-300">Timetable Status</p>
                    <Calendar className="text-white" size={24} />
                  </div>
                  <p className="price">{timetable ? "Active" : "Inactive"}</p>
                  <div className="text-sm text-gray-400 mt-2">
                    {timetable ? "Your schedule is running" : "No schedule generated yet"}
                  </div>
                </div>

                {/* Today's Tasks Card */}
                <div className="card w-full">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-gray-300">Today's Tasks</p>
                    <CheckSquare className="text-white" size={24} />
                  </div>
                  <p className="price">{timetable ? "View" : "Start"}</p>
                  <div className="text-sm text-gray-400 mt-2">
                    {timetable ? "Check your daily tasks" : "Generate a timetable first"}
                  </div>
                </div>

                {/* Account Status Card */}
                <div className="card w-full">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-gray-300">Account</p>
                    <User className="text-white" size={24} />
                  </div>
                  <p className="price">Active</p>
                  <div className="text-sm text-gray-400 mt-2">
                    Member since 2024
                  </div>
                </div>
              </div>
            </div>

            {timetable ? (
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-black">Productivity Overview</h2>
                  <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-black">
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
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-10 mb-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black text-white mb-4">
                  <Calendar size={28} />
                </div>
                <h3 className="text-xl font-bold mb-2">Generate Your First Timetable</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Create a personalized timetable to start tracking your productivity and manage your tasks effectively.
                </p>
                <Link href="/timetable">
                  <button className="btn-premium">
                    Get Started
                  </button>
                </Link>
              </div>
            )}

            {timetable && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-black mb-6">Productivity Tips</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                    <h3 className="font-bold text-black mb-2">Track Daily Progress</h3>
                    <p className="text-gray-600 text-sm">Check off tasks as you complete them to maintain a clear record of your productivity.</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                    <h3 className="font-bold text-black mb-2">Consistency Matters</h3>
                    <p className="text-gray-600 text-sm">Aim for consistent task completion each day rather than occasional bursts of activity.</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                    <h3 className="font-bold text-black mb-2">Monitor Trends</h3>
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
