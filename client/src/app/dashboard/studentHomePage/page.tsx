"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import "@/styles/studentHome.css";

export default function StudentHomePage() {
  const { user } = useUser();

  // Function to determine the greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Function to determine the current semester
  const getCurrentSemester = () => {
    const month = new Date().getMonth() + 1; // JS months are 0-based
    const year = new Date().getFullYear();
    return month >= 1 && month <= 5 ? `Spring ${year}` : `Fall ${year}`;
  };

  // Simulated API data (replace with real API later)
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New lecture materials available for CS101." },
    { id: 2, message: "Midterm exam scheduled for March 15th." },
  ]);

  const [assignments, setAssignments] = useState([
    { id: 1, course: "CS101", title: "Homework 3", dueDate: "2025-02-20" },
    { id: 2, course: "MATH202", title: "Project Proposal", dueDate: "2025-02-18" },
    { id: 3, course: "ENG150", title: "Essay Draft", dueDate: "2025-02-25" },
  ]);

  // Fetch student's enrolled courses dynamically (simulated API data)
  const [weeklySchedule, setWeeklySchedule] = useState([]);

  useEffect(() => {
    // Simulate fetching from API
    setTimeout(() => {
      setWeeklySchedule([
        { id: 1, day: "Monday", time: "10:00 AM - 11:30 AM", course: "CS101" },
        { id: 2, day: "Wednesday", time: "2:00 PM - 3:30 PM", course: "MATH202" },
        { id: 3, day: "Friday", time: "1:00 PM - 2:30 PM", course: "ENG150" },
      ]);
    }, 500);
  }, []);

  // Sort assignments by due date (nearest to farthest)
  const sortedAssignments = assignments.sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  return (
    <div className="student-home-container">
      {/* Personalized Greeting */}
      <h2 className="personalized-greeting">
        {getGreeting()}, {user?.firstName || "Student"}!
      </h2>

      {/* Semester Title */}
      <h1 className="semester-title">Welcome to {getCurrentSemester()}</h1>

      {/* Notifications Section */}
      <div className="section-container">
        <h2 className="section-title">Professor Announcements</h2>
        {notifications.length > 0 ? (
          notifications.map((note) => (
            <div key={note.id} className="notification-item">
              {note.message}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No new notifications.</p>
        )}
      </div>

      {/* Assignments Section */}
      <div className="section-container">
        <h2 className="section-title">Upcoming Assignments</h2>
        {sortedAssignments.length > 0 ? (
          sortedAssignments.map((assignment) => (
            <div key={assignment.id} className="assignment-item">
              <span className="assignment-course">
                {assignment.course}: {assignment.title}
              </span>
              <span className="assignment-date">{assignment.dueDate}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No upcoming assignments.</p>
        )}
      </div>

      {/* Weekly Schedule Section */}
      <div className="weekly-schedule-container">
        <h2 className="section-title">Weekly Class Schedule</h2>
        {weeklySchedule.length > 0 ? (
          weeklySchedule.map((classTime) => (
            <div key={classTime.id} className="schedule-item">
              <span className="schedule-course">{classTime.course}</span>
              <span className="schedule-time">
                {classTime.day}, {classTime.time}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No scheduled classes.</p>
        )}
      </div>
    </div>
  );
}