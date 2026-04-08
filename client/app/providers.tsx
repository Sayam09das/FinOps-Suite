'use client';

import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { AppProvider } from './providers/app-provider';
import { QueryProvider } from './providers/query-provider';
import { ThemeProvider } from './providers/theme-provider';

type ProvidersProps = Readonly<{
  children: ReactNode;
}>;

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AppProvider>
          {children}
          <Toaster richColors position="top-right" closeButton />
        </AppProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
