"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth, useUser, SignIn } from "@clerk/nextjs";

export default function AuthPage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      const role = user.publicMetadata?.role;

      if (!role) {
        return;
      }

      if (role === "admin" || role === "professor") {
        router.replace("/dashboard/professorHomePage");
      } else if (role === "student") {
        router.replace("/dashboard/studentHomePage");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [isSignedIn, user, router]);

  const handleRoleSelection = async (role: "professor" | "student") => {
    try {
      if (!user) return;

      const response = await fetch('/api/updateRole', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role,
          userId: user.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update role');
      }

      await user.reload();

      if (role === "professor") {
        router.replace("/dashboard/professorHomePage");
      } else {
        router.replace("/dashboard/studentHomePage");
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome to Hackathon25</h1>
      <p className="text-lg text-gray-700 mb-6">
        Sign in or Sign up to continue
      </p>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        {!isSignedIn ? (
          <SignIn 
            routing="hash" 
            fallbackRedirectUrl="/auth"
          />
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-3">Select Your Role:</h2>
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition duration-300 w-full mb-3"
              onClick={() => handleRoleSelection("professor")}
            >
              I am a Professor
            </button>
            <button
              className="bg-green-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-green-700 transition duration-300 w-full"
              onClick={() => handleRoleSelection("student")}
            >
              I am a Student
            </button>
          </div>
        )}
      </div>
    </main>
  );
}