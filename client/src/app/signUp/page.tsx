import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <main style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" fallbackRedirectUrl="/dashboard" />
    </main>
  );
}