'use client'

import { useState } from 'react';
import { IconBell, IconBook, IconClipboard, IconFolder, IconAlignBoxBottomCenter } from '@tabler/icons-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

// Mock tabs that a professor might create
const defaultTabs: Tab[] = [
  {
    id: 'announcements',
    label: 'Announcements',
    icon: <IconBell className="w-5 h-5" />,
    content: (
      <div className="p-6">
        <h2 className="text-center text-3xl font-semibold mb-4 text-black">Announcement</h2>
        <div className="border-b pb-4 mb-4">
          <div className="text-center text-sm text-black">2025-02-08</div>
          <p className="mt-2 text-black">Welcome to the course! Please review the syllabus.</p>
        </div>
      </div>
    )
  },
  {
    id: 'syllabus',
    label: 'Syllabus',
    icon: <IconBook className="w-5 h-5" />,
    content: (
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4 text-black">Syllabus</h2>
        <div className="text-black">Syllabus content goes here</div>
      </div>
    )
  },
  {
    id: 'assignments',
    label: 'Assignments',
    icon: <IconClipboard className="w-5 h-5" />,
    content: (
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4 text-black">Assignments</h2>
        <div className="text-black">Assignments content goes here</div>
      </div>
    )
  },
  {
    id: 'modules',
    label: 'Modules',
    icon: <IconFolder className="w-5 h-5" />,
    content: (
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4 text-black">Modules</h2>
        <div className="text-black">Course modules content goes here</div>
      </div>
    )
  },
  {
    id: 'Grades',
    label: 'Grades',
    icon: <IconAlignBoxBottomCenter className="w-5 h-5" />,
    content: (
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4 text-black">Grades</h2>
        <div className="text-black">grades modules content goes here</div>
      </div>
    )
  }
];

export default function CoursePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState(defaultTabs[0].id);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Course Header */}
      <header className="bg-white p-6 border-b">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-center text-5xl font-bold text-black">Introduction to Data Science</h1>
          <p className="text-center text-lg mt-2 text-black">CS 418</p>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex flex-1">
        {/* Vertical Tab Navigation */}
        <nav className="w-64 bg-white border-r">
          <div className="p-4">
            {defaultTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left
                  transition-colors duration-150 ease-in-out
                  ${activeTab === tab.id 
                    ? 'bg-gray-100 text-black font-semibold' 
                    : 'text-black hover:bg-gray-50'}
                `}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Content Area */}
        <main className="flex-1 bg-white">
          {defaultTabs.find(tab => tab.id === activeTab)?.content}
        </main>
      </div>
    </div>
  );
}