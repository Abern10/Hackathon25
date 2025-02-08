"use client";

import { useState } from "react";
import { 
  List, 
  LayoutGrid, 
  Search, 
  Settings, 
  MessageSquare, 
  ChevronDown 
} from "lucide-react";

// Enhanced interfaces
interface User {
  id: string;
  name: string;
  role: "student" | "instructor" | "ta";
  email: string;
}

interface Course {
  id: string;
  code: string;
  title: string;
  status: string;
  instructor: string;
  starred: boolean;
  members: User[];
}

// Mock data with course members
const courses: Course[] = [
  {
    id: "43230",
    code: "2025.spring.cs.418.43230",
    title: "CS 418 Introduction to Data Science",
    status: "Open",
    instructor: "Dr. Smith",
    starred: true,
    members: [
      { id: "1", name: "Dr. Smith", role: "instructor", email: "smith@university.edu" },
      { id: "2", name: "John Doe", role: "ta", email: "john@university.edu" },
      { id: "3", name: "Jane Smith", role: "student", email: "jane@university.edu" },
    ]
  },
  // Add more courses as needed
];

export default function Home() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  
  // Function to handle starting a new message
  const handleStartMessage = (userId: string, courseId: string) => {
    window.location.href = "/dashboard/messages/chat";
  };

  // Function to handle course click
  const handleCourseClick = (courseId: string) => {
    window.location.href = "/dashboard/messages/chat";
  };

  // Function to toggle member list visibility
  const toggleMembers = (courseId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent course navigation when clicking expand button
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  return (
    <div className="bg-white h-full w-full">
      <div className="p-8">
        {/* Header */}
        <h1 className="text-3xl mb-8 text-black text-center">MY COURSES</h1>

        {/* Controls Bar */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          {/* View Toggle */}
          <div className="flex border rounded overflow-hidden">
            <button
              className={`p-2 text-black transition ${viewMode === "list" ? "bg-gray-300" : "hover:bg-gray-200"}`}
              onClick={() => setViewMode("list")}
            >
              <List size={20} />
            </button>
            <button
              className={`p-2 text-black transition ${viewMode === "grid" ? "bg-gray-300" : "hover:bg-gray-200"}`}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid size={20} />
            </button>
          </div>

          {/* Search */}
          <div className="flex-grow relative">
            <input
              type="text"
              placeholder="Search your courses"
              className="w-full px-4 py-2 border rounded text-black placeholder-black"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2" size={20} />
          </div>

          {/* Filters */}
          <select className="border rounded px-4 py-2 text-black">
            <option>Current Courses</option>
          </select>

          <button>
            <Settings size={20} />
          </button>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <span className="text-black">{courses.length} results</span>
          <button className="ml-4 px-4 py-1 rounded-full bg-gray-800 text-white text-sm">
            Current Courses
          </button>
        </div>

        {/* Course List with Messaging */}
        <div className="flex flex-col gap-4">
          {courses.map((course) => (
            <div 
              key={course.id} 
              className="border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => handleCourseClick(course.id)}
            >
              {/* Course Main Info */}
              <div className="flex items-center p-4 gap-4">
                <div className="w-24 h-24 bg-gray-200"></div>
                
                <div className="flex-grow">
                  <div className="text-sm text-black mb-2">{course.code}</div>
                  <h3 className="font-semibold mb-2 text-black">{course.title}</h3>
                  <div className="text-black mb-2">{course.status}</div>
                  <div className="flex justify-between items-center text-black">
                    <span>{course.instructor}</span>
                    <span>{course.starred ? "★" : "☆"}</span>
                  </div>
                </div>

                {/* Message and Expand Controls */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={(e) => toggleMembers(course.id, e)}
                    className="p-2 rounded hover:bg-gray-100"
                  >
                    <ChevronDown 
                      className={`transform transition-transform ${
                        expandedCourse === course.id ? "rotate-180" : ""
                      }`}
                      size={20}
                    />
                  </button>
                </div>
              </div>

              {/* Expandable Members List */}
              {expandedCourse === course.id && (
                <div className="border-t p-4" onClick={(e) => e.stopPropagation()}>
                  <h4 className="font-semibold mb-4 text-black">Course Members</h4>
                  <div className="space-y-3">
                    {course.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                        <div>
                          <div className="text-black font-medium">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.role}</div>
                        </div>
                        <button
                          onClick={() => handleStartMessage(member.id, course.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <MessageSquare size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}