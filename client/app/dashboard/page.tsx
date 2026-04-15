'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashHomeDashboard from './components/DashHome/DashHomeDashboard';

const DashboardPage = () => {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'ok'>('loading');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          router.replace('/login');
          return;
        }

        setStatus('ok');
      } catch (error) {
        console.error('Dashboard auth check failed:', error);
        router.replace('/login');
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
};

export default DashboardPage;

