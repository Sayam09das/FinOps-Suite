import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { DashboardShell } from './_components/dashboard-shell';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return <DashboardShell />;
}
