import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function getValidSession() {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:5000';
    
    const cookieStore = await cookies();
    const cookieHeaders: Record<string, string> = {};
    cookieStore.getAll().forEach((cookie: any) => {
      cookieHeaders[cookie.name] = cookie.value;
    });

    const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Cookie': Object.entries(cookieHeaders)
          .map(([key, value]) => `${key}=${value}`)
          .join('; '),
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const session = await getValidSession();
  
  if (!session) {
    redirect('/login');
  }

  // Client component (keep existing protection as fallback)
  const { default: DashHomeDashboard } = await import('./components/DashHome/DashHomeDashboard');
  
  return <DashHomeDashboard />;
}

