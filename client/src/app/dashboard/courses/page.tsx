// src/app/dashboard/page.tsx
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-white h-full w-full">
      <div className="p-8">
        {/* Header */}
        <h1 className="text-3xl mb-8">My Courses</h1>

        {/* Controls Bar */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          {/* View Toggle */}
          <div className="flex border rounded">
            <button className="p-2">
              ≡ {/* List icon */}
            </button>
            <button className="p-2">
              ▤ {/* Grid icon */}
            </button>
          </div>

          {/* Search */}
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Search your courses"
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          {/* Dropdown Filters */}
          <select className="border rounded px-4 py-2">
            <option>Current Courses</option>
          </select>

          <select className="border rounded px-4 py-2">
            <option>All courses</option>
          </select>

          {/* Items per page */}
          <div className="flex items-center gap-2">
            <select className="border rounded px-3 py-2">
              <option>25</option>
            </select>
            <span>items per page</span>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <span>7 results</span>
          <button className="ml-4 px-4 py-1 rounded-full bg-gray-800 text-white text-sm">
            Current Courses
          </button>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Sample Course Card */}
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <div className="text-sm text-gray-600 mb-2">2025.spring.cs.418.43230</div>
              <h3 className="font-semibold mb-2">CS 418 Introduction to Data Science</h3>
              <div className="text-gray-600 mb-2">Open</div>
              <div className="flex justify-between items-center">
                <span>Instructor Name</span>
                <span>★</span>
              </div>
            </div>
          </div>

          {/* Add more course cards as needed */}
        </div>
      </div>
    </div>
  );
}