import React from 'react';
import { User } from 'lucide-react';

// Define interfaces for our props
interface InfoFieldProps {
  label: string;
  value: string;
  isLink?: boolean;
}

interface UserData {
  fullName: string;
  username: string;
  email: string;
  studentId: string;
}

const ProfilePage: React.FC = () => {
  const userData: UserData = {
    fullName: "Juan Cruz",
    username: "jcruz85",
    email: "jcruz85@university.edu",
    studentId: "655400483"
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      {/* Profile Header */}
      <div className="text-center mb-8">
        <div className="w-32 h-32 mx-auto bg-gray-300 rounded-full mb-4">
          <User className="w-full h-full p-8 text-gray-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{userData.fullName}</h1>
        <p className="text-gray-600">{userData.username}</p>
      </div>

      {/* Content Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Basic Information</h2>
          <div className="space-y-4">
            <InfoField label="Full Name" value={userData.fullName} />
            <InfoField label="Pronunciation" value="Add pronunciation" isLink />
            <InfoField label="Email Address" value={userData.email} />
            <InfoField label="Pronouns" value="Add Pronouns" isLink />
            <InfoField label="Student ID" value={userData.studentId} />
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">System Settings</h2>
          <div className="space-y-4">
            <InfoField 
              label="Language" 
              value="System Default (English)" 
              isLink 
            />
            <InfoField 
              label="Privacy Settings" 
              value="Only instructors can view profile" 
              isLink 
            />
            <InfoField 
              label="Global Notification Settings" 
              value="Stream notifications" 
              isLink 
            />
            <InfoField 
              label="Email Notifications" 
              value="Configure email notifications" 
              isLink 
            />
            <InfoField 
              label="Push Notifications" 
              value="Configure push notifications" 
              isLink 
            />
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Additional Information</h2>
          <div className="space-y-4">
            <InfoField label="Gender" value="Add gender" isLink />
            <InfoField label="Preferred Name" value="Add preferred name" isLink />
            <InfoField label="Education Level" value="Add education level" isLink />
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoField: React.FC<InfoFieldProps> = ({ label, value, isLink = false }) => (
  <div className="border-b border-gray-200 pb-2">
    <div className="text-gray-600 text-sm">{label}</div>
    <div className={`${isLink ? 'text-blue-600 cursor-pointer' : ''}`}>
      {value}
    </div>
  </div>
);

export default ProfilePage;