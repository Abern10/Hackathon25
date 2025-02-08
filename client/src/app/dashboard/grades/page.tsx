import Image from "next/image";
import { IconArrowLeft, IconClock } from '@tabler/icons-react';
import Link from 'next/link';

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
  return [
    {
      id: "cs418",
      code: "2025.spring.cs.418.43230",
      name: "CS 418 Introduction to Data Science",
      term: "2025 Spring",
      finalGrade: "B",
      toGrade: 434,
      totalAssignments: 96,
    },
  ];
};

export default async function GradesPage() {
  const courses = await fetchCourses(); // Fetch courses

  return (
    <div className="bg-white h-full w-full">
      {/* Header */}
      <div className="p-6 border-b flex items-center space-x-4">
        <IconArrowLeft className="w-6 h-6 cursor-pointer text-black" />
        <h1 className="text-3xl font-semibold text-black">My Grades</h1>
      </div>

      {/* Section Header */}
      <div className="p-4 text-center border-b">
        <h2 className="text-lg font-medium text-black">Current Courses and Organizations</h2>
      </div>

      {/* Course List */}
      <div className="p-6 space-y-4">
        {courses.map((course) => (
          <div key={course.id} className="border rounded-lg shadow-sm">
            {/* Course Header */}
            <div className="bg-gray-100 p-4 border-b">
              <p className="text-sm text-gray-500">{course.code}</p>
              <h3 className="text-lg font-semibold text-black">{course.name}</h3>
            </div>

            {/* Grade Section */}
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <IconClock className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-black">Final Grade</span>
              </div>
              <span className="text-sm font-semibold text-black">No Category</span>
              <span className="text-sm font-semibold text-gray-700">
                {course.toGrade} to grade
              </span>
              {course.finalGrade ? (
                <span className="px-3 py-1 text-sm font-bold bg-lime-300 rounded-lg">
                  {course.finalGrade}
                </span>
              ) : (
                <span className="text-sm text-gray-400">-</span>
              )}
            </div>

            {/* View All Work */}
            <div className="p-4 border-t text-right">
              <Link href={`/courses/class/${course.id}`} className="text-blue-600 text-sm font-medium">
                View all work ({course.totalAssignments})
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
