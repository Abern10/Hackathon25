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

export default function SignInPage() {
    const router = useRouter();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const { isLoaded, signIn, setActive } = useSignIn();
    const { user } = useUser();  // Add this hook

    // useEffect(() => {
    //     if (user) {
    //         router.push('/');
    //     }
    // }, [user, router]);


    if (!isLoaded) {
        return <div>Loading...</div>
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
    
        if (!isLoaded) {
          return
        }
    
        // Start the sign-in process using the email and password provided
        try {
            const result = await signIn.create({
                identifier: email,
                password,
            })

            if (result.status === "complete") {
                console.log("Sign in successful")
                await setActive({ session: result.createdSessionId })
                // Redirect or update UI as needed
                router.push('/')
            } else {
                console.log("Sign in failed", result)
                setError("Sign in failed. Please check your credentials.")
            }
        } catch (err) {
            console.error("Error during sign in:", err)
            setError("An error occurred during sign in. Please try again.")
        }
    }

    return (
        <div className="min-h-screen w-full bg-white flex items-center justify-center">
            <main className="bg-white w-full h-full">
                <div className="relative z-10 w-full max-w-md mx-auto px-4">
                    <div className="bg-transparent border border-zinc-800 rounded-2xl p-8 shadow-input">
                        <h2 className="font-bold text-4xl text-black mb-4 justify-center items-center flex">
                            CLASSFLOW
                        </h2>

                        {error && (
                            <p className="text-red-500 text-sm mb-4">{error}</p>
                        )}
                        <form onSubmit={handleSubmit}>
                            <LabelInputContainer className="mb-4 !text-black bg-transparent">
                                <Label htmlFor="email" className="!text-black">Email Address</Label>
                                <Input 
                                    id="email" 
                                    placeholder="example@email.com" 
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </LabelInputContainer>
                            <LabelInputContainer className="mb-6 !text-black ">
                                <Label htmlFor="password" className="!text-black">Password</Label>
                                <Input 
                                    id="password" 
                                    placeholder="••••••••" 
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </LabelInputContainer>
                            <p className="text-sm text-black">DON'T HAVE AN ACCOUNT? 
                            <span className="text-black underline rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 px-2" onClick={() => router.push('/sign-up')}>SIGN UP</span>
                            </p>

                            <div className="flex items-center justify-center mt-10">
                                <button type="submit" className="bg-white text-black text-2xl rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 px-8 py-2">
                                    LOGIN
                                </button>
                            </div>
                            <div className="flex items-center justify-center">
                                <button type="button" className="bg-white mt-4 text-black text-2xl rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 px-8 py-2">
                                    <IconBrandGoogle className="h-4 w-4 text-black" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
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