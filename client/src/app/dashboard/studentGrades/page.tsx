"use client";

import { useState, useEffect } from "react";
import { IconArrowLeft, IconClock, IconBook, IconMessageCircle } from "@tabler/icons-react";
import Link from "next/link";

interface Assignment {
  name: string;
  grade: number | null;
  totalPoints: number;
  dueDate: string;
}

interface Course {
  id: string;
  code: string;
  name: string;
  term: string;
  earnedPoints: number;
  totalPoints: number;
  assignments: Assignment[];
}

const fetchCourses = async (): Promise<Course[]> => {
  return [
    {
      id: "cs418",
      code: "2025.spring.cs.418.43230",
      name: "CS 418 Introduction to Data Science",
      term: "2025 Spring",
      earnedPoints: 11.5,
      totalPoints: 12,
      assignments: [
        { name: "Quiz 3", grade: 3.5, totalPoints: 4, dueDate: "2025-02-02" },
        { name: "Quiz 4", grade: null, totalPoints: 4, dueDate: "2025-02-11" },
      ],
    },
    {
      id: "cs101",
      code: "2024.fall.cs.101.12345",
      name: "CS 101 Introduction to Computer Science",
      term: "2024 Fall",
      earnedPoints: 20,
      totalPoints: 20,
      assignments: [
        { name: "Quiz 4", grade: 20, totalPoints: 20, dueDate: "2024-10-06" },
        { name: "Quiz 5", grade: null, totalPoints: 20, dueDate: "2024-10-14" },
        { name: "Discussion 5: To listen or not to listen.", grade: null, totalPoints: 0, dueDate: "2024-10-14" },
      ],
    },
  ];
};

export default function GradesPage() {
  const [semesterFilter, setSemesterFilter] = useState<string>("All");
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const loadCourses = async () => {
      const fetchedCourses = await fetchCourses();
      setCourses(fetchedCourses);
    };
    loadCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    if (semesterFilter === "All") return true;
    const semesterCode = course.code.split(".")[0] + "." + course.code.split(".")[1];
    return semesterCode === semesterFilter;
  });

  return (
    <div className="bg-white h-full w-full">
      {/* Header */}
      <div className="p-6 border-b flex items-center space-x-4">
        <IconArrowLeft className="w-6 h-6 cursor-pointer text-black" />
        <h1 className="text-3xl font-semibold text-black">My Grades</h1>
      </div>

      {/* Semester Filter */}
      <div className="p-4 text-center border-b">
        <h2 className="text-lg font-medium text-black">Current Courses and Organizations</h2>
        <select
          className="border p-2 rounded-md mt-2"
          value={semesterFilter}
          onChange={(e) => setSemesterFilter(e.target.value)}
        >
          <option value="All">All Semesters</option>
          <option value="2025.spring">Spring 2025</option>
          <option value="2024.fall">Fall 2024</option>
        </select>
      </div>

      {/* Course List */}
      <div className="p-6 space-y-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="border rounded-lg shadow-sm">
            {/* Course Header */}
            <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">{course.code}</p>
                <h3 className="text-lg font-semibold text-gray-800">{course.name}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <IconClock className="w-5 h-5 text-gray-500" />
                <span
                  className={`px-3 py-1 text-sm font-bold rounded-lg ${
                    course.earnedPoints === course.totalPoints
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {course.earnedPoints} / {course.totalPoints}
                </span>
              </div>
            </div>

            {/* Recent Grades */}
            <div className="p-4">
              <h4 className="text-md font-semibold text-gray-800">Recent Grades</h4>
              <div className="space-y-2 mt-2">
                {course.assignments
                  .filter((a) => a.grade !== null)
                  .map((assignment, index) => (
                    <div key={index} className="flex justify-between items-center text-gray-700">
                      <div className="flex items-center space-x-2">
                        <IconBook className="w-5 h-5 text-gray-500" />
                        <span>{assignment.name}</span>
                      </div>
                      <span className="text-sm">{assignment.grade} / {assignment.totalPoints}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* What's Next */}
            <div className="p-4 border-t">
              <h4 className="text-md font-semibold text-gray-800">What's Next</h4>
              <div className="space-y-2 mt-2">
                {course.assignments
                  .filter((a) => a.grade === null)
                  .map((assignment, index) => (
                    <div key={index} className="flex justify-between items-center text-gray-700">
                      <div className="flex items-center space-x-2">
                        {assignment.name.startsWith("Discussion") ? (
                          <IconMessageCircle className="w-5 h-5 text-gray-500" />
                        ) : (
                          <IconBook className="w-5 h-5 text-gray-500" />
                        )}
                        <span>{assignment.name}</span>
                      </div>
                      <span className="text-sm">Due: {assignment.dueDate}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* View All Work */}
            <div className="p-4 border-t text-right">
              <Link href={`/courses/class/${course.id}`} className="text-blue-600 text-sm font-medium">
                View all work ({course.assignments.length})
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
