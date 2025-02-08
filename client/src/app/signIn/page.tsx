// src/app/signIn/page.tsx
"use client"; // 👈 Mark this as a Client Component

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      const role = user.publicMetadata?.role;
      if (role === 'admin' || role === 'professor') {
        router.push('/dashboard/professorHomePage');
      } else if (role === 'student') {
        router.push('/dashboard/studentHomePage');
      } else {
        router.push('/dashboard'); // Fallback
      }
    }
  }, [isSignedIn, user, router]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <SignIn />
    </main>
  );
}