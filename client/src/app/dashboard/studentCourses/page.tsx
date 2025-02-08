"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IconList, IconBlocks, IconSearch, IconSettings } from "@tabler/icons-react";

// Define course type
interface Course {
  id: string;
  code: string;
  title: string;
  status: string;
  instructor: string;
  starred: boolean;
}

// Mock course data
const courses: Course[] = [
  {
    id: "43230",
    code: "2025.spring.cs.418.43230",
    title: "CS 418 Introduction to Data Science",
    status: "Open",
    instructor: "Instructor Name",
    starred: true,
  },
  // Add more courses as needed
];

export default function Home() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid"); // ✅ Track view mode

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
              <IconList />
            </button>
            <button
              className={`p-2 text-black transition ${viewMode === "grid" ? "bg-gray-300" : "hover:bg-gray-200"}`}
              onClick={() => setViewMode("grid")}
            >
              <IconBlocks />
            </button>
          </div>

          {/* Search */}
          <div className="flex-grow relative">
            <input
              type="text"
              placeholder="Search your courses"
              className="w-full px-4 py-2 border rounded text-black placeholder-black"
            />
            <IconSearch className="absolute right-3 top-1/2 transform -translate-y-1/2" />
          </div>

          {/* Dropdown Filters */}
          <select className="border rounded px-4 py-2 text-black">
            <option>Current Courses</option>
          </select>

          <button>
            <IconSettings />
          </button>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <span className="text-black">{courses.length} results</span>
          <button className="ml-4 px-4 py-1 rounded-full bg-gray-800 text-white text-sm">
            Current Courses
          </button>
        </div>

        {/* Course Display - Grid or List */}
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              : "flex flex-col gap-4"
          }`}
        >
          {courses.map((course) => (
            <Link
              href={`courses/class/${course.id}`}
              key={course.id}
              className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 ${
                viewMode === "list" ? "flex items-center p-4 gap-4" : ""
              }`}
            >
              {/* Course Image Placeholder */}
              <div className={`${viewMode === "grid" ? "h-48" : "w-24 h-24"} bg-gray-200`}></div>

              {/* Course Details */}
              <div className="p-4 flex-grow">
                <div className="text-sm text-black mb-2">{course.code}</div>
                <h3 className="font-semibold mb-2 text-black">{course.title}</h3>
                <div className="text-black mb-2">{course.status}</div>
                <div className="flex justify-between items-center text-black">
                  <span>{course.instructor}</span>
                  <span>{course.starred ? "★" : "☆"}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}