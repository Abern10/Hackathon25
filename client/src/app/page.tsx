"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth, useUser, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

// ------------------------
// Navbar Component
// ------------------------
function Navbar() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  return (
    <nav className="w-full bg-gray-900 text-white py-4 px-6 flex justify-between items-center fixed top-0 left-0 z-50">
      <div className="text-3xl font-bold cursor-pointer" onClick={() => router.push("/")}>
        Class Flow
      </div>
      <div>
        {isSignedIn ? (
          <UserButton />
        ) : (
          <button
            className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition duration-300"
            onClick={() => router.push("/sign-in/[[...sign-in]]")}
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}

// ------------------------
// Feature Data for Carousel
// ------------------------
const featureData = [
  {
    category: "Collaboration",
    title: "Work together, anytime.",
    src: "/assets/collaboration.jpg",
    description:
      "Engage seamlessly with classmates and professors, working together on projects and assignments.",
  },
  {
    category: "Course Management",
    title: "Everything in one place.",
    src: "/assets/courses.jpg",
    description:
      "Manage your courses, schedules, and assignments with a unified platform designed for efficiency.",
  },
  {
    category: "Real-Time Updates",
    title: "Stay up to date, always.",
    src: "/assets/live-chat.jpg",
    description:
      "Receive instant notifications for coursework changes, messages, and important deadlines.",
  },
  {
    category: "Assignments",
    title: "Interactive learning experience.",
    src: "/assets/assignments.jpg",
    description:
      "Engage with interactive assignments and assessments to track your progress effectively.",
  },
  {
    category: "Live Sessions",
    title: "Learn with real-time classes.",
    src: "/assets/workers.jpg",
    description:
      "Attend live online sessions with your professor and interact with classmates instantly.",
  },
  {
    category: "Personalized Dashboard",
    title: "Your learning hub.",
    src: "/assets/custom.jpg",
    description:
      "Customize your dashboard with essential coursework, reminders, and announcements.",
  },
];

// ------------------------
// HomePage Component
// ------------------------
export default function HomePage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  // Redirect signed-in users to their dashboard.
  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-center text-center bg-white text-gray-900 h-[55rem] md:gap-16">
        <div className="md:w-1/2 md:pl-16 flex flex-col justify-center">
          <h1 className="text-6xl font-bold mb-4">Empower Your Learning Journey</h1>
          <h2 className="text-3xl mb-8 max-w-lg mx-auto">
            ClassFlow is a powerful platform for students and professors to collaborate and manage coursework seamlessly.
          </h2>
          <button
            onClick={() => router.push("/sign-in/[[...sign-in]]")}
            className="relative inline-block group transform transition duration-300 hover:-translate-y-1 bg-white px-8 py-4"
          >
            <span className="inline-block text-gray-900 text-xl font-semibold relative">
              Click Here to get started
              <span className="absolute left-0 bottom-0 h-0.5 bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
            </span>
          </button>
        </div>

        {/* Centered Image Section */}
        <div className="md:w-1/2 flex justify-center items-cente pt-[4rem]">
          <div className="w-[550px] h-[700px] flex items-center justify-center">
            <Image
              src="/assets/lecture-hall.jpg"
              alt="Collaborative learning"
              width={600}  // Slightly wider
              height={700} // Slightly taller than wide
              className="object-cover rounded-lg shadow-lg w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* Features Section - Apple-Style Carousel */}
      <section className="py-16 bg-gray-100 text-gray-900">
        <h2 className="text-4xl font-bold text-center mb-10">Features</h2>
        <Carousel
          items={featureData.map((card, index) => (
            <Card key={index} card={card} />
          ))}
        />
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-100 text-gray-900">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <Image src="/assets/about.jpg" alt="About ClassFlow" width={600} height={400} className="rounded-lg shadow-lg" />
          </div>
          <div className="md:w-1/2 md:pl-12">
            <h2 className="text-3xl font-bold mb-4">About ClassFlow</h2>
            <p className="mb-4">
              ClassFlow is designed to revolutionize the educational experience by connecting students and professors in a dynamic digital environment.
            </p>
            <p>
              With innovative tools for course management, collaborative projects, and real-time communication, our platform is your gateway to a smarter way of learning.
            </p>
          </div>
        </div>
      </section>

      {/* Call-To-Action Section */}
      <section className="py-16 bg-gray-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="mb-8">
            Join our community of learners and educators. Whether you're here to learn or teach, ClassFlow has something for everyone.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push("/sign-in/[[...sign-in]]")}
              className="relative inline-block group transform transition duration-300 hover:-translate-y-1 bg-gray-900 px-8 py-4"
            >
              <span className="inline-block text-white text-xl font-semibold relative">
                Click Here to get started
                <span className="absolute left-0 bottom-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}