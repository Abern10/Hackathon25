'use client';

import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { db } from '@/lib/firebase'; // Firestore initialization
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useUser } from '@clerk/nextjs'; // Clerk hook for user authentication

interface InfoFieldProps {
  label: string;
  value: string;
  isLink?: boolean;
}

const ProfilePage: React.FC = () => {
  const { user, isLoaded } = useUser(); // Get the current Clerk user
  const [professorData, setProfessorData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfessorData = async () => {
      if (!isLoaded || !user) {
        console.error("❌ User is not loaded or logged in.");
        setLoading(false);
        return;
      }

      // Get the primary email from Clerk's user object
      const primaryEmail = user.emailAddresses?.[0]?.emailAddress;
      if (!primaryEmail) {
        console.error("❌ No primary email found for the user.");
        setLoading(false);
        return;
      }

      try {
        console.log("✅ Clerk User Primary Email:", primaryEmail);

        // Query Firestore for a document where 'email' matches the Clerk user's primary email
        const professorQuery = query(
          collection(db, 'professors'),
          where('email', '==', primaryEmail)
        );
        const querySnapshot = await getDocs(professorQuery);

        if (!querySnapshot.empty) {
          const professorDoc = querySnapshot.docs[0].data();
          console.log("✅ Professor Data Fetched:", professorDoc);
          setProfessorData(professorDoc);
        } else {
          console.error("⚠️ No professor data found for this email:", primaryEmail);
        }
      } catch (error) {
        console.error("❌ Error fetching professor data:", error);
      }

      setLoading(false);
    };

    fetchProfessorData();
  }, [isLoaded, user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!professorData) {
    return <div>No data available for this professor.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      {/* Profile Header */}
      <div className="text-center mb-8">
        <div className="w-32 h-32 mx-auto bg-gray-300 rounded-full mb-4">
          <User className="w-full h-full p-8 text-gray-600" />
        </div>
        <h1 className="text-2xl font-bold text-black">{professorData.name}</h1>
        <p className="text-black">UIN: {professorData.uin}</p>
      </div>

      {/* Content Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-black">Basic Information</h2>
          <div className="space-y-4">
            <InfoField label="Full Name" value={professorData.name} />
            <InfoField label="Email Address" value={professorData.email} />
            <InfoField label="Role" value={professorData.role} />
            <InfoField label="Access Level" value={professorData.access?.role || "None"} />
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-black">System Settings</h2>
          <div className="space-y-4">
            <InfoField 
              label="Notifications" 
              value="Configure notification settings" 
              isLink 
            />
            <InfoField 
              label="Privacy Settings" 
              value="Only administrators can view your profile" 
              isLink 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoField: React.FC<InfoFieldProps> = ({ label, value, isLink = false }) => (
  <div className="border-b border-gray-200 pb-2">
    <div className="text-black text-sm">{label}</div>
    <div className={`${isLink ? 'text-blue-600 cursor-pointer' : 'text-black'}`}>
      {value}
    </div>
  </div>
);

export default ProfilePage;