"use client"; // Required for interactive buttons

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';

export default function HomePage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  // useEffect(() => {
  //   if (isSignedIn && user) {
  //     const role = user.publicMetadata?.role;

  //     if (role === 'admin' || role === 'professor') {
  //       router.replace('/dashboard/professorHomePage');
  //     } else if (role === 'student') {
  //       router.replace('/dashboard/studentHomePage');
  //     } else {
  //       router.replace('/dashboard'); // Fallback
  //     }
  //   }
  // }, [isSignedIn, user, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <h1 className="text-5xl font-bold mb-6">Welcome to Hackathon25</h1>
      <p className="text-lg mb-8 text-center px-6">
        A powerful platform for students and professors to collaborate and manage coursework.
      </p>

      <div className="flex gap-4">
        <button
          className="bg-white text-blue-600 px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-200 transition duration-300"
          onClick={() => router.push('/sign-in/[[...sign-in]]')}
        >
          Sign In / Sign Up
        </button>
      </div>
    </div>
  );
}