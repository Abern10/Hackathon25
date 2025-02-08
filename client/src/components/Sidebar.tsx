import React from 'react';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside style={{ width: '250px', background: '#f0f0f0', padding: '1rem' }}>
      <h2>Dashboard</h2>
      <nav>
        <ul>
          <li>
            <Link href="/dashboard/professorHomePage">Professor Home</Link>
          </li>
          <li>
            <Link href="/dashboard/studentHomePage">Student Home</Link>
          </li>
          <li>
            <Link href="/dashboard/courses">Courses</Link>
          </li>
          <li>
            <Link href="/dashboard/grades">Grades</Link>
          </li>
          <li>
            <Link href="/dashboard/messages">Messages</Link>
          </li>
          <li>
            <Link href="/dashboard/user">Profile</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}