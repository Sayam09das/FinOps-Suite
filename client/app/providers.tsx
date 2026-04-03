'use client';

import { ClerkProvider } from '@clerk/nextjs';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';

type ProvidersProps = Readonly<{
  children: ReactNode;
}>;

const clerkAppearance = {
  variables: {
    colorPrimary: '#500cb0',
    colorText: '#111827',
    colorBackground: '#ffffff',
    colorInputBackground: '#f8fafc',
    colorInputText: '#111827',
    borderRadius: '1rem',
  },
  elements: {
    card: 'shadow-none',
    rootBox: 'w-full',
    formButtonPrimary:
      'bg-dark text-white shadow-lg shadow-primary/20 hover:bg-primary transition-colors',
    footerActionLink: 'text-primary hover:text-secondary',
    socialButtonsBlockButton:
      'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
  },
} as const;

export function Providers({ children }: ProvidersProps) {
  return (
    <ClerkProvider
      appearance={clerkAppearance}
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      {children}
      <Toaster richColors position="top-right" />
    </ClerkProvider>
  );
}
