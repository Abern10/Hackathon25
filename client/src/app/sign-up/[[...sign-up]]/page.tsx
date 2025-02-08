"use client"
import { useSignUp } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react"
import { Label } from "@/components/label";
import { Input } from "@/components/input"
import { cn } from "@/lib/utils"
import React from "react"
import { useRouter } from "next/navigation";
import { Student } from "@/lib/classes/Student"
import { Professor } from "@/lib/classes/Professor"
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function SignUpPage() {
    const router = useRouter();
    const { signOut } = useAuth();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");   
    const [emailAddress, setEmailAddress] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [selectedRole, setSelectedRole] = useState<'professor' | 'student' | null>(null);
    const { isLoaded, signUp, setActive } = useSignUp()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("") 

        if (!selectedRole) {
            setError("Please select a role (Professor or Student)")
            return
        }

        if (!isLoaded) {
            return
        }

        try {
            const result = await signUp.create({
                emailAddress,
                password,
            })
            
            await signUp.update({
                firstName,
                lastName,
            })

            console.log("Sign-up created:", result)

            // Send verification email
            await signUp.prepareEmailAddressVerification({
                strategy: 'email_code',
            })
            
            setActive({ session: result.createdSessionId });
            router.push('/sign-in')
        } catch (err: any) {
            console.error("Error during sign-up:", err)
            setError(err.errors?.[0]?.message || "An error occurred during sign-up")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-400 to-blue-600 p-6">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-lg px-8 py-10">
                {/* Title */}
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Create Your Account</h2>

                {/* Error Message */}
                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                {/* Sign-Up Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex flex-col md:flex-row gap-4">
                        <LabelInputContainer>
                            <Label className="text-gray-700">First Name</Label>
                            <Input 
                                placeholder="John" 
                                type="text"
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </LabelInputContainer>
                        <LabelInputContainer>
                            <Label className="text-gray-700">Last Name</Label>
                            <Input 
                                placeholder="Doe" 
                                type="text"
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </LabelInputContainer>
                    </div>

                    <LabelInputContainer>
                        <Label className="text-gray-700">Email Address</Label>
                        <div className="relative">
                            <Input 
                                placeholder="example@email.com" 
                                type="email"
                                value={emailAddress}
                                onChange={(e) => setEmailAddress(e.target.value)}
                            />
                            <i className="fas fa-envelope absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        </div>
                    </LabelInputContainer>

                    <LabelInputContainer>
                        <Label className="text-gray-700">Password</Label>
                        <div className="relative">
                            <Input 
                                placeholder="••••••••" 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <i className="fas fa-lock absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        </div>
                    </LabelInputContainer>

                    {/* Role Selection */}
                    <div className="text-center">
                        <p className="text-gray-700 font-semibold">Select Your Role</p>
                        <div className="flex justify-center gap-6 mt-2">
                            <button
                                type="button"
                                className={`px-6 py-2 rounded-lg text-lg transition-all duration-300 ${
                                    selectedRole === 'professor' 
                                        ? 'bg-gray-900 text-white shadow-md' 
                                        : 'border border-gray-400 text-gray-600 hover:bg-gray-300'
                                }`}
                                onClick={() => setSelectedRole('professor')}
                            >
                                Professor
                            </button>
                            <button
                                type="button"
                                className={`px-6 py-2 rounded-lg text-lg transition-all duration-300 ${
                                    selectedRole === 'student' 
                                        ? 'bg-gray-900 text-white shadow-md' 
                                        : 'border border-gray-400 text-gray-600 hover:bg-gray-300'
                                }`}
                                onClick={() => setSelectedRole('student')}
                            >
                                Student
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="w-full bg-green-500 text-white font-bold rounded-md py-3 mt-4 hover:bg-green-600">
                        Sign Up
                    </button>
                </form>

                {/* Already have an account */}
                <p className="text-center text-gray-600 mt-6">
                    Already have an account? 
                    <span className="text-blue-500 font-bold cursor-pointer" onClick={() => router.push('/sign-in')}> Sign In</span>
                </p>
            </div>
        </div>
    );
}

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};