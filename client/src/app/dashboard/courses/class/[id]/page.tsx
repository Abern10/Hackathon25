import { IconBook, IconUsers, IconCalendar, IconBell } from '@tabler/icons-react';

// You would typically fetch this data from an API
interface Course {
  id: string;
  code: string;
  title: string;
  instructor: string;
  description: string;
  schedule: string;
  enrollmentCount: number;
  announcements: Array<{
    id: string;
    date: string;
    content: string;
  }>;
}

// This is a Next.js server component that receives the course ID as a param
export default function CoursePage({ params }: { params: { id: string } }) {
  // Mock data - replace with actual data fetching
  const courseData: Course = {
    id: params.id,
    code: "CS 418",
    title: "Introduction to Data Science",
    instructor: "Dr. Smith",
    description: "An introduction to the basic principles and techniques of data science.",
    schedule: "MWF 10:00 AM - 11:50 AM",
    enrollmentCount: 45,
    announcements: [
      {
        id: "1",
        date: "2025-02-08",
        content: "Welcome to the course! Please review the syllabus."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Course Header */}
      <header className="bg-gray-800 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-center text-3xl font-bold">{courseData.title}</h1>
          <p className="text-center text-lg mt-2">{courseData.code}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Announcements */}
          <div className="p-6 border rounded-lg w-full">
            <div className="flex items-center gap-2 mb-4">
              <IconBell />
              <h2 className="text-xl font-semibold">Announcements</h2>
            </div>
            {courseData.announcements.map((announcement) => (
              <div key={announcement.id} className="border-b py-4">
                <div className="text-sm text-gray-500">{announcement.date}</div>
                <p className="mt-2">{announcement.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}