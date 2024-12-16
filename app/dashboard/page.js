"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie"; // To handle cookies

import "./style.css";

const Dashboard = () => {
  const [userName, setUserName] = useState(null);
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user session data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/User");

        if (response.ok) {
          const user = await response.json();
          setUserName(user.name); // Set the user's name from the backend

          // Fetch the timetable for the user
          const timetableResponse = await fetch(`/api/timetable?userId=${user.id}`);
          if (timetableResponse.ok) {
            const timetableData = await timetableResponse.json();
            setTimetable(timetableData);
          } else {
            console.log("No timetable found for the user.");
          }
        } else {
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Logout function
  const handleLogout = () => {
    // Remove the user session cookie
    Cookies.remove("user_session");
    // Redirect to the login page
    window.location.href = "/login";
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      {userName ? (
        <div>
          <p>Welcome, {userName}!</p>
          <button onClick={handleLogout}>Logout</button>

          {/* Display timetable */}
          {timetable ? (
            <div>
              <h3>Your Timetable</h3>
              <ul>
                {timetable.subjects.map((subject, index) => (
                  <li key={index}>{subject.name}</li>
                ))}
              </ul>
              <h4>Restricted Times:</h4>
              <ul>
                {timetable.restrictedTimes.map((time, index) => (
                  <li key={index}>{time.time}</li>
                ))}
              </ul>
              <h4>Available Times:</h4>
              <ul>
                {timetable.availableTimes.map((time, index) => (
                  <li key={index}>{time.time}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No timetable data available.</p>
          )}
        </div>
      ) : (
        <p>No user found</p>
      )}
    </div>
  );
};

export default Dashboard;
