import { useAuthStore } from '@/app/store/auth.store';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useProtectedRoute() {
  const { currentUser, hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && !currentUser) {
      router.replace('/login');
    }
  }, [currentUser, hasHydrated, router]);
}

