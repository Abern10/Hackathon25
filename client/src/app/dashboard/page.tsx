import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const role = user.publicMetadata?.role;

  if (role === 'admin' || role === 'professor') {
    redirect('/dashboard/professorHomePage');
  } else if (role === 'student') {
    redirect('/dashboard/studentHomePage');
  } else {
    redirect('/sign-in');
  }
}