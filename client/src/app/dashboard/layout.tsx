// src/app/dashboard/layout.tsx
import React from "react";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar stays full height */}
      <Sidebar />
      {/* Allow vertical scrolling on the main content */}
      <main className="flex-1 bg-white overflow-y-auto">
        {children}
      </main>
    </div>
  );
}