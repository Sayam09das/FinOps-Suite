'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { useAuthStore } from '@/app/store/auth.store';

type AppProviderProps = Readonly<{
  children: ReactNode;
}>;

export function AppProvider({ children }: AppProviderProps) {
  const hydrateSession = useAuthStore((state) => state.hydrateSession);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;
    void hydrateSession();
  }, [hydrateSession]);

  return <>{children}</>;
}
