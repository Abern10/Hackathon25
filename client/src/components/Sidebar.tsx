"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Sidebar() {
  const { user } = useUser();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) return;

      // Check if user is a professor
      const professorDoc = await getDoc(doc(db, 'professors', user.id));
      if (professorDoc.exists()) {
        const data = professorDoc.data();
        setRole(data.access?.role || 'professor');
        return;
      }

      // If not professor, check if user is a student
      const studentDoc = await getDoc(doc(db, 'students', user.id));
      if (studentDoc.exists()) {
        const data = studentDoc.data();
        setRole(data.access?.role || 'student');
      }
    };

    checkUserRole();
  }, [user]);

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col justify-between p-4">
      {/* Dashboard Header */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          CLASSFLOW
        </h2>

        {/* Navigation Links */}
        <nav>
          <ul className="space-y-3">
            {role === "professor" ? (
              <>
                <li>
                  <Link href="/dashboard/professorHomePage" className="block px-4 py-2 rounded-md hover:bg-gray-700">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/professorCourses" className="block px-4 py-2 rounded-md hover:bg-gray-700">
                    Courses
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/professorCalendar" className="block px-4 py-2 rounded-md hover:bg-gray-700">
                    Calendar
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/professorGrades" className="block px-4 py-2 rounded-md hover:bg-gray-700">
                    Grades
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/professorMessages" className="block px-4 py-2 rounded-md hover:bg-gray-700">
                    Messages
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/professorUser" className="block px-4 py-2 rounded-md hover:bg-gray-700">
                    Profile
                  </Link>
                </li>
              </>   
            ) : (
              <>
                <li>
                  <Link href="/dashboard/studentHomePage" className="block px-4 py-2 rounded-md hover:bg-gray-700">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/studentHomePage" className="block px-4 py-2 rounded-md hover:bg-gray-700">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/studentCourses" className="block px-4 py-2 rounded-md hover:bg-gray-700">
                    Courses
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/studentCalendar" className="block px-4 py-2 rounded-md hover:bg-gray-700">
                    Calendar
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/studentGrades" className="block px-4 py-2 rounded-md hover:bg-gray-700">
                    Grades
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/studentMessages" className="block px-4 py-2 rounded-md hover:bg-gray-700">
                    Messages
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/studentUser" className="block px-4 py-2 rounded-md hover:bg-gray-700">
                    Profile
                  </Link>
                </li>
              </>   
            )}
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