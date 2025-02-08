// app/layout.tsx

import './globals.css';
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

export const metadata = {
  title: 'My Hackathon App',
  description: 'Some description here',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <SignedOut>
            {/* Renders a sign-in button if the user is signed out */}
            <SignInButton />
          </SignedOut>
          <SignedIn>
            {/* Renders a user dropdown if the user is signed in */}
            <UserButton />
          </SignedIn>

          {/* The rest of your application */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}