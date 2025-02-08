import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <main style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" fallbackRedirectUrl="/dashboard" />
    </main>
  );
}