// src/app/dashboard/grades/page.tsx

import { IconArrowLeft, IconClock } from '@tabler/icons-react';

interface Course {
  id: string;
  code: string;
  name: string;
  term: string;
  finalGrade: string | null;
  toGrade: number;
  totalAssignments: number;
}

const fetchCourses = async (): Promise<Course[]> => {
  // Simulating an API call
  return [
    {
      id: "cs211",
      code: "2023.fall.cs.211.1",
      name: "CS 211 Programming Practicum 2023 Fall - All Lecture Sections",
      term: "2023 Fall",
      finalGrade: "B",
      toGrade: 434,
      totalAssignments: 96,
    },
    {
      id: "cs440",
      code: "2024.fall.cs.440.38984",
      name: "CS 440 Software Engr I (38984) 2024 Fall",
      term: "2024 Fall",
      finalGrade: null,
      toGrade: 0,
      totalAssignments: 32,
    },
  ];
};

export default async function GradesPage() {
  const courses = await fetchCourses(); // Fetch courses

  return (
    <div className="bg-white h-full w-full">
      {/* Header */}
      <div className="p-6 border-b flex items-center space-x-4">
        <IconArrowLeft className="w-6 h-6 cursor-pointer text-gray-700 hover:text-black" />
        <h1 className="text-3xl font-semibold text-gray-800">My Grades</h1>
      </div>

      {/* Section Header */}
      <div className="p-4 text-center border-b">
        <h2 className="text-lg font-medium text-gray-700">Current Courses and Organizations</h2>
      </div>

      {/* Course List */}
      <div className="p-6 space-y-4">
        {courses.map((course) => (
          <div key={course.id} className="border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            {/* Course Header */}
            <div className="bg-gray-100 p-4 border-b">
              <p className="text-sm text-gray-500">{course.code}</p>
              <h3 className="text-lg font-semibold text-gray-800">{course.name}</h3>
            </div>

            {/* Grade Section */}
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <IconClock className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Final Grade</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-semibold text-gray-700">
                  {course.toGrade > 0 ? `${course.toGrade} to grade` : 'Not Graded Yet'}
                </span>
                {course.finalGrade ? (
                  <span className="px-3 py-1 text-sm font-bold bg-lime-300 rounded-lg">
                    {course.finalGrade}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">-</span>
                )}
              </div>
            </div>

            {/* View All Work */}
            <div className="p-4 border-t text-right">
              <a href="#" className="text-blue-600 text-sm font-medium hover:underline">
                View all work ({course.totalAssignments})
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
