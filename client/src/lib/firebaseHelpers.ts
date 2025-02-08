// lib/firebaseHelpers.ts

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// Function to fetch user data from Firestore
export const getUserDataFromFirebase = async (clerkUserId: string, role: string) => {
    try {
        const userRef = doc(db, role === "student" ? "students" : "professors", clerkUserId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            return userDoc.data();
        } else {
            console.log("User not found in Firestore.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
};

// Function to create a user in Firestore if they don’t exist
export const createUserInFirebase = async (clerkUserId: string, role: string, userData: any) => {
    try {
        const userRef = doc(db, role === "student" ? "students" : "professors", clerkUserId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            await setDoc(userRef, {
                name: userData.name || "Unknown",
                email: userData.email || "No email",
                access: { courses: [] }, // Empty courses initially
            });
            console.log(`New ${role} record created in Firestore.`);
        } else {
            console.log(`User already exists in Firestore.`);
        }
    } catch (error) {
        console.error("Error creating user in Firestore:", error);
    }
};