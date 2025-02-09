'use client';

import { useState, useEffect } from 'react';
import {
  IconEdit,
  IconPlus,
  IconTrash,
  IconCheck,
  IconFolder,
  IconChevronRight,
  IconChevronDown,
  IconClipboard,
  IconCalendar,
  IconUserPlus,
} from '@tabler/icons-react';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

interface Assignment {
  dueDate: string;
  points: number;
  description: string;
  instructions: string;
}

interface Tab {
  id: string;
  label: string;
  type: 'folder' | 'content' | 'assignment';
  content?: string;
  children?: Tab[];
  parentId?: string | null;
  assignment?: Assignment;
}

export default function CoursePage({ params }: { params: { id: string } }) {
  const courseId = params.id;

  const [isEditing, setIsEditing] = useState(false);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [courseName, setCourseName] = useState('Introduction to Data Science');
  const [courseCode, setCourseCode] = useState('CS 418');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [instructorName, setInstructorName] = useState('Daniel Luangnikone');
  const [professorId, setProfessorId] = useState('user.2shellDXABhwzbRC89U7vBP5gap');

  // State for managing the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  // Function to fetch users from Clerk
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/getUsers'); // Call API route instead
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Open the modal and fetch users
  const openModal = () => {
    fetchUsers();
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUsers(new Set()); // Reset selection
  };

  // Toggle user selection
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prevSelected) => {
      const newSelection = new Set(prevSelected);
      if (newSelection.has(userId)) {
        newSelection.delete(userId);
      } else {
        newSelection.add(userId);
      }
      return newSelection;
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Course Header */}
      <header className="bg-white p-6 border-b relative flex justify-between items-center">
        <div className="max-w-7xl mx-auto text-center flex-1">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full text-4xl font-bold text-black bg-transparent border-b"
              />
              <input
                type="text"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                className="w-full text-lg text-black bg-transparent border-b"
              />
            </div>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-black">{courseName}</h1>
              <p className="text-lg mt-2 text-black">{courseCode}</p>
            </>
          )}
        </div>

        {/* Buttons for editing and adding students */}
        <div className="flex gap-4">
          {/* Add Students Button */}
          <button
            onClick={openModal}
            className="p-2 rounded-lg bg-blue-500 text-white flex items-center gap-2 hover:bg-blue-600 transition"
          >
            <IconUserPlus className="w-6 h-6" />
            Add Students
          </button>

          {/* Edit Button */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-lg bg-gray-200 text-black flex items-center gap-2 hover:bg-gray-300 transition"
          >
            {isEditing ? <IconCheck className="w-6 h-6 text-green-600" /> : <IconEdit className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        <main className="flex-1 bg-white p-6">
          <h2 className="text-2xl font-semibold text-black">Course Content</h2>
          <p className="text-gray-500">Add course materials, assignments, and students.</p>
        </main>
      </div>

      {/* Modal for Adding Students */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-black mb-4">Select Students</h2>

            {/* Scrollable User List */}
            <div className="border border-gray-300 rounded-lg max-h-[400px] overflow-y-auto">
              {users.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No users found.</p>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    className={`flex justify-between items-center p-3 border-b ${
                      selectedUsers.has(user.id) ? 'bg-blue-100' : 'hover:bg-gray-100'
                    } cursor-pointer`}
                    onClick={() => toggleUserSelection(user.id)}
                  >
                    <span className="text-black">{user.firstName} {user.lastName}</span>
                    <span className="text-gray-600">{user.email}</span>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={closeModal} className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400">
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Add Users
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}