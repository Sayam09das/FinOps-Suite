'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashHomeDashboard from './components/DashHome/DashHomeDashboard';

const BACKEND_URL = 'https://finops-suite.onrender.com';

export default function DashboardPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'ok'>('loading');
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    const checkSession = async () => {
      try {
        await new Promise(res => setTimeout(res, 300));

        const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
          credentials: 'include',
          cache: 'no-store',
        });

        if (res.status === 200) {
          setStatus('ok');
        } else {
          router.replace('/login?next=/dashboard');
        }
      } catch (error) {
        console.error(error);
        router.replace('/login?next=/dashboard');
      }
    };

    checkSession();
  }, [router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Checking auth session...</p>
      </div>
    );
  }

  return <DashHomeDashboard />;
}