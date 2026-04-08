'use client';

import { signOut } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/app/store/auth.store';
import { authService } from '@/lib/api/auth-service';
import type { OAuthProvider } from '@/lib/api/types';

const readableProviderName: Record<OAuthProvider, string> = {
  google: 'Google',
  apple: 'Apple',
  facebook: 'Facebook',
};

export default function OAuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    const provider = searchParams.get('provider') as OAuthProvider | null;

    const finishOAuthFlow = async () => {
      try {
        const user = await authService.completeOAuth({
          provider: provider ?? undefined,
        });

        setSession(user);
        await signOut({ redirect: false });
        toast.success(
          `${readableProviderName[provider ?? 'google']} sign-in completed.`,
        );
        router.replace('/dashboard');
      } catch (error) {
        clearSession();
        await signOut({ redirect: false }).catch(() => undefined);
        toast.error(
          error instanceof Error
            ? error.message
            : 'OAuth sign-in could not be completed.',
        );
        router.replace('/login');
      }
    };

    void finishOAuthFlow();
  }, [clearSession, router, searchParams, setSession]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="rounded-[1.75rem] border border-slate-200 bg-white px-8 py-7 text-center shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-950">
          Finishing your secure sign-in
        </h1>
        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
          We&apos;re exchanging your OAuth result for your custom backend session
          and redirecting you to the dashboard.
        </p>
      </div>
    </main>
  );
}
