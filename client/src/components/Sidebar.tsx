"use client"; // Required for interactive behavior

import React from "react";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";

export default function Sidebar() {
  const { user } = useUser();
  const role = user?.publicMetadata?.role;

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col justify-between p-4">
      {/* Dashboard Header */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          {role === "admin" || role === "professor"
            ? "Professor Dashboard"
            : "Student Dashboard"}
        </h2>

        {/* Navigation Links */}
        <nav>
          <ul className="space-y-3">
            {role === "admin" || role === "professor" ? (
              <li>
                <Link href="/dashboard/professorHomePage" className="block px-4 py-2 rounded-md hover:bg-gray-700">
                  Professor Home
                </Link>
              </li>
            ) : (
              <li>
                <Link href="/dashboard/studentHomePage" className="block px-4 py-2 rounded-md hover:bg-gray-700">
                  Student Home
                </Link>
              </li>
            )}

            <li>
              <Link href="/dashboard/courses" className="block px-4 py-2 rounded-md hover:bg-gray-700">
                Courses
              </Link>
            </li>
            <li>
              <Link href="/dashboard/calendar" className="block px-4 py-2 rounded-md hover:bg-gray-700">
                Calendar
              </Link>
            </li>
            <li>
              <Link href="/dashboard/grades" className="block px-4 py-2 rounded-md hover:bg-gray-700">
                Grades
              </Link>
            </li>
            <li>
              <Link href="/dashboard/messages" className="block px-4 py-2 rounded-md hover:bg-gray-700">
                Messages
              </Link>
            </li>
            <li>
              <Link href="/dashboard/user" className="block px-4 py-2 rounded-md hover:bg-gray-700">
                Profile
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Clerk User Button (Profile & Logout) */}
      <div className="border-t border-gray-600 pt-4">
        <UserButton afterSignOutUrl="/" />
      </div>
    </aside>
  );
}