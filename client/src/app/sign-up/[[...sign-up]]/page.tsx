"use client";

import { useSignUp } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { Label } from "@/components/label";
import { Input } from "@/components/input";
import { cn } from "@/lib/utils";
import React from "react";
import { useRouter } from "next/navigation";
import { Student } from "@/lib/classes/Student";
import { Professor } from "@/lib/classes/Professor";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function SignUpPage() {
    const router = useRouter();
    const { signOut } = useAuth();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [code, setCode] = useState("");
    const [selectedRole, setSelectedRole] = useState<'professor' | 'student' | null>(null);
    const { isLoaded, signUp, setActive } = useSignUp();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!selectedRole) {
            setError("Please select a role (Professor or Student)");
            return;
        }

        if (!isLoaded) {
            return;
        }

        try {
            // Create sign-up with Clerk
            const result = await signUp.create({
                emailAddress,
                password,
            });

            await signUp.update({
                firstName,
                lastName,
            });

            console.log("Sign-up created:", result);

            // Send verification email
            await signUp.prepareEmailAddressVerification({
                strategy: "email_code",
            });

            setVerifying(true);
        } catch (err: any) {
            console.error("Error during sign-up:", err);
            setError(err.errors?.[0]?.message || "An error occurred during sign-up");
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) {
            setError("System is not ready. Please try again.");
            return;
        }

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({ code });

            if (completeSignUp.status !== "complete") {
                throw new Error("Verification incomplete");
            }

            const userId = completeSignUp.createdUserId;
            if (!userId) {
                throw new Error("No user ID received from verification");
            }

            await setActive({ session: completeSignUp.createdSessionId });

            // Store user in Firebase
            let userObj;
            const access = { role: selectedRole };

            if (selectedRole === "student") {
                userObj = new Student(
                    Math.floor(Math.random() * 1000000),
                    `${firstName} ${lastName}`,
                    emailAddress,
                    access
                );
            } else {
                userObj = new Professor(
                    Math.floor(Math.random() * 1000000),
                    `${firstName} ${lastName}`,
                    emailAddress,
                    access
                );
            }

            await setDoc(doc(db, selectedRole === "student" ? "students" : "professors", userId), {
                uin: userObj.getUin(),
                name: userObj.getName(),
                email: userObj.getEmail(),
                access: userObj.getAccess(),
                userId,
                role: selectedRole,
                createdAt: new Date().toISOString(),
            });

            router.push(selectedRole === "professor" ? "/dashboard/professorHomePage" : "/dashboard/studentHomePage");
        } catch (err: any) {
            console.error("Error during verification:", err);
            setError(err.message || "An error occurred during verification");
        }
    };

    if (verifying) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-400 to-blue-600 p-6">
                <div className="bg-white rounded-xl shadow-lg w-full max-w-md px-8 py-10 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Verify Your Email</h1>
                    <p className="text-gray-600 mb-6">Enter the code sent to your email.</p>
    
                    {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
    
                    <form onSubmit={handleVerify} className="space-y-5">
                        <LabelInputContainer>
                            <Label className="text-gray-700">Verification Code</Label>
                            <Input
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Enter code"
                                className="text-center"
                            />
                        </LabelInputContainer>
    
                        <button type="submit" className="w-full bg-blue-500 text-white font-bold rounded-md py-3 hover:bg-blue-600 transition">
                            Verify Account
                        </button>
                    </form>
    
                    <p className="text-gray-600 mt-6">
                        Didn't receive the code?
                        <span className="text-blue-500 font-bold cursor-pointer" onClick={handleSubmit}>
                            {" "}Resend
                        </span>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-400 to-blue-600 p-6">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-lg px-8 py-10">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Create Your Account</h2>

                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex flex-col md:flex-row gap-4">
                        <LabelInputContainer>
                            <Label className="text-gray-700">First Name</Label>
                            <Input placeholder="John" type="text" onChange={(e) => setFirstName(e.target.value)} />
                        </LabelInputContainer>
                        <LabelInputContainer>
                            <Label className="text-gray-700">Last Name</Label>
                            <Input placeholder="Doe" type="text" onChange={(e) => setLastName(e.target.value)} />
                        </LabelInputContainer>
                    </div>

                    <LabelInputContainer>
                        <Label className="text-gray-700">Email Address</Label>
                        <Input placeholder="example@email.com" type="email" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} />
                    </LabelInputContainer>

                    <LabelInputContainer>
                        <Label className="text-gray-700">Password</Label>
                        <Input placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </LabelInputContainer>

                    <div className="text-center">
                        <p className="text-gray-700 font-semibold">Select Your Role</p>
                        <div className="flex justify-center gap-6 mt-2">
                            <button
                                type="button"
                                className={`px-6 py-2 rounded-lg text-lg ${selectedRole === "professor" ? "bg-gray-900 text-white" : "border border-gray-400 text-gray-600"}`}
                                onClick={() => setSelectedRole("professor")}
                            >
                                Professor
                            </button>
                            <button
                                type="button"
                                className={`px-6 py-2 rounded-lg text-lg ${selectedRole === "student" ? "bg-gray-900 text-white" : "border border-gray-400 text-gray-600"}`}
                                onClick={() => setSelectedRole("student")}
                            >
                                Student
                            </button>
                        </div>
                    </div>

                    {/* CAPTCHA */}
                    <div id="clerk-captcha" className="my-4"></div>

                    <button type="submit" className="w-full bg-green-500 text-white font-bold rounded-md py-3 mt-4 hover:bg-green-600">
                        Sign Up
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-6">
                    Already have an account?
                    <span className="text-blue-500 font-bold cursor-pointer" onClick={() => router.push("/sign-in")}>
                        {" "}
                        Sign In
                    </span>
                </p>
            </div>
        </div>
    );
}

const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>
);
