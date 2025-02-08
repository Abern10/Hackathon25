"use client";

import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        const checkUserRole = async () => {
            if (!user) {
                router.push('/sign-in');
                return;
            }

            // Check professor collection first
            const professorDoc = await getDoc(doc(db, 'professors', user.id));
            if (professorDoc.exists()) {
                return; // User is a professor, allow access
            }

            // If not a professor, check student collection
            const studentDoc = await getDoc(doc(db, 'students', user.id));
            if (studentDoc.exists()) {
                return; // User is a student, allow access
            }

            // If user is neither professor nor student, redirect to sign-in
            router.push('/sign-in');
        };

        checkUserRole();
    }, [user, router]);

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 bg-white overflow-y-auto p-6">
                {children}
            </main>
        </div>
    );
}