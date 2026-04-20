"use client";

import { useEffect } from 'react';
import { useAuth } from '@/app/features/auth';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // Authenticated → Dashboard
        router.push('/dashboard/maindashboard');
      } else {
        // Unauthenticated → Login
        router.replace('/login');
      }
    }
  }, [user, isLoading, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
      </div>
    );
  }

  return null;
}
