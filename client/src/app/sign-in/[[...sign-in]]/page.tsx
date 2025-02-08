"use client"
import { useSignIn } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import { Label } from "@/components/label"
import { Input } from "@/components/input"
import { cn } from "@/lib/utils"
import React from "react"
import { IconBrandGoogle } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

export default function SignInPage() {
    const router = useRouter();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const { isLoaded, signIn, setActive } = useSignIn();
    const { user } = useUser();

    const checkRoleAndRedirect = async (userId: string) => {
        try {
            const userDoc = await getDoc(doc(db, 'professors', userId));
            if (!userDoc.exists()) {
                const studentDoc = await getDoc(doc(db, 'students', userId));
                if (!studentDoc.exists()) {
                    throw new Error('User not found');
                }
                const data = studentDoc.data();
                if (data.access?.role === 'student') {
                    router.push('/dashboard/studentHomePage');
                    return;
                }
            } else {
                const data = userDoc.data();
                if (data.access?.role === 'professor') {
                    router.push('/dashboard/professorHomePage');
                    return;
                }
            }
            throw new Error('Invalid role');
        } catch (err) {
            console.error("Error checking role:", err);
            setError("Error determining user role. Please try again.");
        }
    };

    useEffect(() => {
        if (user) {
            checkRoleAndRedirect(user.id);
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!isLoaded) {
            return
        }

        try {
            const result = await signIn.create({
                identifier: email,
                password,
            })

            if (result.status === "complete") {
                console.log("Sign in successful")
                await setActive({ session: result.createdSessionId })
            } else {
                console.log("Sign in failed", result)
                setError("Sign in failed. Please check your credentials.")
            }
        } catch (err) {
            console.error("Error during sign in:", err)
            setError("An error occurred during sign in. Please try again.")
        }
    }

    const handleGoogleSignIn = async () => {
        if (!signIn) return;

        try {
            await signIn.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrl: "/sign-in", // Redirect back to sign-in page
                redirectUrlComplete: "/dashboard", // Redirect after successful sign-in
            });
        } catch (err) {
            console.error("Google sign-in error:", err);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left: Sign-In Form */}
            <div className="w-1/2 bg-white flex flex-col justify-center items-center px-12">
                <h2 className="text-4xl font-bold text-black mb-2">Login to Your Account</h2>
                <p className="text-gray-500 mb-6">Login using social networks</p>

                {/* Google Sign-In Button (Fixed) */}
                <div className="flex items-center justify-center pb-[2rem]">
                    <button 
                        className="flex items-center gap-2 bg-white border border-gray-300 text-gray-900 text-lg px-6 py-3 rounded-lg font-semibold shadow-sm hover:bg-gray-100 transition"
                        onClick={handleGoogleSignIn}
                    >
                        <IconBrandGoogle className="h-5 w-5 text-red-500" />
                        Sign In with Google
                    </button>
                </div>

                <div className="w-full border-t border-gray-300 mb-6 relative">
                    <span className="absolute top-[-12px] left-1/2 transform -translate-x-1/2 bg-white px-2 text-gray-500">OR</span>
                </div>

                {/* Login Form */}
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="w-full max-w-sm">
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Email Address</label>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="example@email.com"
                                className="w-full border border-gray-300 rounded-md py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full border border-gray-300 rounded-md py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-green-500 text-white font-bold rounded-md py-3 mt-4 hover:bg-green-600">
                        Sign In
                    </button>
                </form>
            </div>

            {/* Right: Sign-Up Call to Action */}
            <div className="w-1/2 bg-gradient-to-br from-teal-400 to-blue-600 flex flex-col justify-center items-center text-white p-12">
                <h2 className="text-3xl font-bold mb-2">New Here?</h2>
                <p className="text-lg text-center mb-6">Sign up and discover a great amount of new opportunities!</p>
                <button
                    onClick={() => router.push('/sign-up')}
                    className="bg-white text-blue-600 font-bold px-6 py-3 rounded-full shadow-lg hover:bg-gray-200 transition-all"
                >
                    Sign Up
                </button>
            </div>
        </div>
    );
}