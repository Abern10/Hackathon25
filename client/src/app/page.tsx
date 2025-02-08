import Image from "next/image";

export default function Home() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col">
        <h1 className="text-xl font-bold mb-4">Class Flow</h1>
        <nav className="flex flex-col gap-2">
          <a href="/dashboard" className="p-2 bg-gray-800 rounded hover:bg-gray-700">Dashboard</a>
          <a href="/user" className="p-2 bg-gray-800 rounded hover:bg-gray-700">Juan Cruz</a>
          <a href="#" className="p-2 bg-gray-800 rounded hover:bg-gray-700">My Courses</a>
          <a href="#" className="p-2 bg-gray-800 rounded hover:bg-gray-700">Calendar</a>
          <a href="#" className="p-2 bg-gray-800 rounded hover:bg-gray-700">Messages</a>
          <a href="#" className="p-2 bg-gray-800 rounded hover:bg-gray-700">My Grades</a>
          <a href="#" className="p-2 bg-gray-800 rounded hover:bg-gray-700">Assists</a>
          <a href="#" className="p-2 bg-gray-800 rounded hover:bg-gray-700">Tools</a>
          <a href="#" className="p-2 bg-gray-800 rounded hover:bg-gray-700">Sign Out</a>
        </nav>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <header className="bg-white p-4 shadow flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700">Home</h2>
          <div className="flex items-center gap-4">
            <input type="text" placeholder="Search..." className="border p-2 rounded" />
            <Image src="/user-avatar.png" alt="User Avatar" width={40} height={40} className="rounded-full" />
          </div>
        </header>
        
        {/* Content Area */}
        <main className="p-6 bg-gray-100 flex-1">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">Welcome to Blackboard Clone</h3>
          <p className="text-gray-700">This is your dashboard where you can access courses, view grades, and check messages.</p>
        </main>
      </div>
    </div>
  );
}
