"use client";

import { useEffect } from 'react';
import { useAuth } from '@/app/features/auth';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  // Middleware handles redirects - minimal page for SSR
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-lg">Loading...</div>
    </div>
  );
}
