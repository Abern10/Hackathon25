import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/auth');
  }

  const role = user.publicMetadata?.role;

  if (!role) {
    return (
      <main className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">Welcome to the Dashboard</h1>
          <p className="text-gray-600 mb-6 text-center">
            Please select your role to continue
          </p>
          <div className="space-y-4">
            <a
              href="/auth"
              className="block w-full py-3 px-4 text-center bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
              Set Up Your Role
            </a>
          </div>
        </div>
      </main>
    );
  }

  switch (role) {
    case 'admin':
    case 'professor':
      redirect('/dashboard/professorHomePage');
    case 'student':
      redirect('/dashboard/studentHomePage');
    default:
      return (
        <main className="flex flex-col items-center justify-center h-screen bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <h1 className="text-2xl font-bold mb-6 text-center text-red-600">Invalid Role</h1>
            <p className="text-gray-600 mb-6 text-center">
              Your role ({role}) is not recognized. Please contact support or try setting your role again.
            </p>
            <div className="space-y-4">
              <a
                href="/auth"
                className="block w-full py-3 px-4 text-center bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
              >
                Return to Role Selection
              </a>
            </div>
          </div>
        </main>
      );
  }
}