"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getUserDataFromFirebase, createUserInFirebase } from "@/lib/firebaseHelpers";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, isSignedIn } = useUser();
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        if (!isSignedIn || !user) return;

        const fetchUserData = async () => {
            const clerkUserId = user.id;
            const role = user.publicMetadata?.role;

            if (!role) {
                console.log("No role assigned to user.");
                return;
            }

            // Check if user exists in Firebase
            let firebaseUser = await getUserDataFromFirebase(clerkUserId, role);
            if (!firebaseUser) {
                await createUserInFirebase(clerkUserId, role, {
                    name: user.fullName,
                    email: user.primaryEmailAddress,
                });

                firebaseUser = await getUserDataFromFirebase(clerkUserId, role);
            }

            setUserData(firebaseUser);
        };

        fetchUserData();
    }, [isSignedIn, user]);

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar stays full height */}
            <Sidebar />
            {/* Allow vertical scrolling on the main content */}
            <main className="flex-1 bg-white overflow-y-auto p-6">
                {!userData ? (
                    <p className="text-center text-gray-600">Loading user data...</p>
                ) : (
                    <div className="mb-4">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Welcome, {userData.name}!
                        </h1>
                        <p className="text-gray-700">Role: {user.publicMetadata?.role}</p>
                        <p className="text-gray-700">
                            Courses: {userData.access.courses.join(", ") || "No courses assigned yet"}
                        </p>
                    </div>
                )}
                {children}
            </main>
        </div>
    );
}