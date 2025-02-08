// src/app/dashboard/layout.tsx
import React from 'react';
import Sidebar from '@/components/Sidebar'; // Adjust import based on your structure

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Persistent Sidebar */}
      <Sidebar />
      
      {/* Main Content that changes based on route */}
      <main style={{ flex: 1, padding: '1rem' }}>
        {children}
      </main>
    </div>
  );
}