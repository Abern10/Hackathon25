"use client"
import { useSignUp } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react"
import { Label } from "@/components/label";
import { Input } from "@/components/input"
import { cn } from "@/lib/utils"
import React from "react"
import { IconBrandGoogle } from "@tabler/icons-react"
import { useRouter } from "next/navigation";

export default function SignUpPage() {
    const router = useRouter();
    const { signOut } = useAuth();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");   
    const [emailAddress, setEmailAddress] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [verifying, setVerifying] = useState(false)
    const [code, setCode] = useState('')
    const { isLoaded, signUp, setActive } = useSignUp()
    const [selectedRole, setSelectedRole] = useState<'professor' | 'student' | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log("handleSubmit called")
        console.log('Current selected role:', selectedRole)
        setError("") 

        if (!selectedRole) {
            setError("Please select a role (Professor or Student)")
            return
        }

        if (!isLoaded) {
            console.log("Clerk is not loaded yet")
            return
        }

        try {
            // Create the sign-up according to Clerk's API specification
            const result = await signUp.create({
                emailAddress,
                password,
            })
            
            // After successful creation, update user metadata
            await signUp.update({
                firstName,
                lastName,
            })

            console.log("Sign-up created:", result)

            // Send verification email
            await signUp.prepareEmailAddressVerification({
                strategy: 'email_code',
            })
            
            setVerifying(true)
        } catch (err: any) {
            console.error("Error during sign-up:", err)
            setError(err.errors?.[0]?.message || "An error occurred during sign-up")
        }
    }

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log("handleVerify called with role:", selectedRole)
    
        if (!isLoaded) {
            console.log("Clerk is not loaded yet")
            return
        }
    
        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            })
            
            if (completeSignUp.status === 'complete') {
                await setActive({ session: completeSignUp.createdSessionId })
                
                // Get user ID from completeSignUp
                const userId = completeSignUp.createdUserId
                console.log("Created user ID:", userId)
                
                if (!userId) {
                    console.error("No user ID found")
                    setError("Error: User ID not found. Please try again.")
                    return
                }
    
                try {
                    const payload = {
                        role: selectedRole,
                        userId: userId
                    }
                    console.log("Sending payload with validated user ID:", payload)
    
                    const response = await fetch('/api/public', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload)
                    });
    
                    const responseData = await response.json()
                    console.log("Response data:", responseData)
    
                    if (!response.ok) {
                        throw new Error(responseData.error || 'Failed to update role')
                    }
    
                    if (selectedRole === 'professor') {
                        router.push('/dashboard/professorHomePage')
                    } else {
                        router.push('/dashboard/studentHomePage')
                    }
                } catch (error) {
                    console.error("Error updating role:", error)
                    setError("Error setting user role. Please try again.")
                }
            }
        } catch (err: any) {
            console.error("Error during verification:", err)
            setError(err.message || "An error occurred during verification")
        }
    }

    if (verifying) {
        return (
            <div className="min-h-screen w-full bg-white flex items-center justify-center">
                <div className="bg-transparent border border-zinc-800 rounded-2xl p-8 shadow-input">
                    <h1 className="text-2xl font-bold mb-4 text-black">Verify your email</h1>
                    {error && (
                        <p className="text-red-500 text-sm mb-4">{error}</p>
                    )}
                    <form onSubmit={handleVerify}>
                        <LabelInputContainer className="mb-4">
                            <Label className="text-black">Enter your verification code</Label>
                            <Input
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="text-black"
                            />
                        </LabelInputContainer>
                        <button 
                            type="submit"
                            className="w-full bg-white text-black text-xl rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 px-8 py-2"
                        >
                            Verify
                        </button>
                    </form>
                </div>
            </div>
        )
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
                            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                                <LabelInputContainer className="mb-4 !text-black">
                                    <Label className="!text-black">First Name</Label>
                                    <Input 
                                        id="First Name" 
                                        placeholder="John" 
                                        type="text"
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </LabelInputContainer>
                                <LabelInputContainer className="mb-4 !text-black">
                                    <Label className="!text-black">Last Name</Label>
                                    <Input 
                                        id="Last Name" 
                                        placeholder="Doe" 
                                        type="text"
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </LabelInputContainer>
                            </div>
                            <LabelInputContainer className="mb-4 !text-black">
                                <Label htmlFor="email" className="!text-black">Email Address</Label>
                                <Input 
                                    id="email" 
                                    placeholder="example@email.com" 
                                    type="email"
                                    value={emailAddress}
                                    onChange={(e) => setEmailAddress(e.target.value)}
                                />
                            </LabelInputContainer>
                            <LabelInputContainer className="mb-6 !text-black">
                                <Label htmlFor="password" className="!text-black">Password</Label>
                                <Input 
                                    id="password" 
                                    placeholder="••••••••" 
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </LabelInputContainer>
                            <div className="flex items-center justify-center gap-10 text-black">
                                <button
                                    type="button"
                                    className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                                        selectedRole === 'professor' 
                                            ? 'bg-gray-900 text-white' 
                                            : 'hover:bg-gray-400'
                                    }`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedRole('professor');
                                        console.log('Professor button clicked');
                                        console.log('Role selected:', 'professor');
                                    }}
                                >
                                    PROFESSOR
                                </button>
                                <button
                                    type="button"
                                    className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                                        selectedRole === 'student' 
                                            ? 'bg-gray-900 text-white' 
                                            : 'hover:bg-gray-400'
                                    }`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedRole('student');
                                        console.log('Student button clicked');
                                        console.log('Role selected:', 'student');
                                    }}
                                >
                                    STUDENT
                                </button>
                            </div>
                            <p className="text-sm text-black mt-10">ALREADY HAVE AN ACCOUNT? 
                                <span className="text-black underline rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 px-2" onClick={() => router.push('/sign-in')}>SIGN IN</span>
                            </p>

                            {/* Add CAPTCHA div */}
                            <div id="clerk-captcha" className="mt-4"></div>

                            <div className="flex items-center justify-center mt-4">
                                <button className="bg-white text-black text-2xl rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 px-8 py-2" type="submit">
                                    SIGN UP
                                </button>
                            </div>
                            <div className="flex items-center justify-center">
                                <button className="bg-white mt-4 text-black text-2xl rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 px-8 py-2" type="button">
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