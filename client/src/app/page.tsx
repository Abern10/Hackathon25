// src/app/page.tsx
"use client"; // Required for interactive buttons

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <h1 className="text-5xl font-bold mb-6">Welcome to Hackathon25</h1>
      <p className="text-lg mb-8 text-center px-6">
        A powerful platform for students and professors to collaborate and manage coursework.
      </p>

      <div className="flex gap-4">
        <button
          className="bg-white text-blue-600 px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-200 transition duration-300"
          onClick={() => router.push('/signIn')}
        >
          Sign In
        </button>
        <button
          className="bg-gray-100 text-blue-600 px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-300 transition duration-300"
          onClick={() => router.push('/signUp')}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}