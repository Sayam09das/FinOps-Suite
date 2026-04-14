'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { FaApple, FaFacebookF, FaGoogle } from 'react-icons/fa6';
import { toast } from 'sonner';
import { useAuthStore } from '@/app/store/auth.store';
import { authService } from '@/lib/api/auth-service';
import type { OAuthProvider } from '@/lib/api/types';
import { AuthShell } from './auth-shell';

type ValueCard = {
  title: string;
  description: string;
};

type AuthViewProps = {
  mode: 'login' | 'register';
};

const pageStyles = {
  login:
    'bg-[radial-gradient(circle_at_top_left,_rgba(178,100,255,0.16),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_50%,_#f8fafc_100%)]',
  register:
    'bg-[radial-gradient(circle_at_top_right,_rgba(132,204,22,0.14),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_50%,_#f8fafc_100%)]',
} as const;

const modeCopy = {
  login: {
    badge: 'Custom + OAuth Auth',
    heroTitle: 'One secure auth layer for every way your users sign in.',
    heroDescription:
      'Email/password and OAuth both land in the same Mongo-backed account system, with JWT sessions stored in HTTP-only cookies.',
    heroCards: [
      {
        title: 'JWT Cookies',
        description: 'Strict same-site session cookies with no localStorage dependency.',
      },
      {
        title: 'Unified Users',
        description: 'Google, Apple, Facebook, and email users share one user record.',
      },
      {
        title: 'Startup Ready',
        description: 'Custom backend control with a clean SaaS-grade authentication UX.',
      },
    ] satisfies ValueCard[],
    formEyebrow: 'Welcome back',
    formTitle: 'Sign in to FinOps Suite',
    formDescription:
      'Use email/password or continue with OAuth. Either way, your app session is issued by your own backend.',
    buttonLabel: 'Sign in to dashboard',
    loadingLabel: 'Signing in',
    alternateLabel: 'New to FinOps Suite?',
    alternateHref: '/register',
    alternateLinkLabel: 'Create your account',
    successMessage: 'Signed in successfully.',
  },
  register: {
    badge: 'Production Auth UX',
    heroTitle: 'Launch onboarding that feels simple, secure, and polished.',
    heroDescription:
      'Create accounts with password auth or OAuth while keeping full backend control over JWT issuance, session cookies, and user records.',
    heroCards: [
      {
        title: 'Cookie Sessions',
        description: 'Automatic login persistence through secure HTTP-only cookies.',
      },
      {
        title: 'Auth.js OAuth',
        description: 'OAuth providers are handled by Auth.js, then exchanged into your custom backend session.',
      },
      {
        title: 'Shared State',
        description: 'The frontend uses one auth store no matter how the user authenticated.',
      },
    ] satisfies ValueCard[],
    formEyebrow: 'Create your workspace',
    formTitle: 'Create your account',
    formDescription:
      'Start with email/password now and keep the same dashboard experience when you later add social sign-in.',
    buttonLabel: 'Create your account',
    loadingLabel: 'Creating account',
    alternateLabel: 'Already have an account?',
    alternateHref: '/login',
    alternateLinkLabel: 'Sign in instead',
    successMessage: 'Account created successfully.',
  },
} as const;

const oauthProviders: Array<{
  provider: OAuthProvider;
  label: string;
  icon: typeof FaGoogle;
}> = [
  {
    provider: 'google',
    label: 'Continue with Google',
    icon: FaGoogle,
  },
  {
    provider: 'apple',
    label: 'Continue with Apple',
    icon: FaApple,
  },
  {
    provider: 'facebook',
    label: 'Continue with Facebook',
    icon: FaFacebookF,
  },
];

const authErrorCopy: Record<string, string> = {
  AccessDenied: 'Access was denied. Please try again.',
  Configuration: 'OAuth is not configured correctly yet.',
  OAuthSignin: 'The OAuth sign-in flow could not be started.',
  OAuthCallbackError: 'The OAuth callback failed. Please try again.',
  OAuthAccountNotLinked: 'That email is already linked to a different sign-in method.',
  oauth_bridge: 'OAuth completed, but your backend session could not be created.',
};

export default function AuthView({ mode }: AuthViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const copy = useMemo(() => modeCopy[mode], [mode]);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const currentUser = useAuthStore((state) => state.currentUser);
  const setSession = useAuthStore((state) => state.setSession);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeOAuthProvider, setActiveOAuthProvider] =
    useState<OAuthProvider | null>(null);

  useEffect(() => {
    if (hasHydrated && currentUser) {
      router.replace('/dashboard');
    }
  }, [currentUser, hasHydrated, router]);

  useEffect(() => {
    const errorCode = searchParams.get('error');

    if (!errorCode) {
      return;
    }

    const message =
      authErrorCopy[errorCode] || 'Authentication could not be completed.';
    setErrorMessage(message);
  }, [searchParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (mode === 'register' && formState.password !== formState.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const session =
        mode === 'register'
          ? await authService.register({
              name: formState.name.trim() || undefined,
              email: formState.email,
              password: formState.password,
            })
          : await authService.login({
              email: formState.email,
              password: formState.password,
            });

      setSession(session);
      await hydrateSession(); // Ensure store hydrated before redirect
      toast.success(copy.successMessage);
      router.replace('/dashboard');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to continue.';

      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuthSignIn = async (provider: OAuthProvider) => {
    setErrorMessage(null);
    setActiveOAuthProvider(provider);

    try {
      await signIn(provider, {
        redirectTo: `/oauth/success?provider=${provider}`,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to continue with OAuth right now.';
      setErrorMessage(message);
      toast.error(message);
      setActiveOAuthProvider(null);
    }
  };

  if (!hasHydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Preparing your workspace
        </div>
      </main>
    );
  }

  return (
    <AuthShell>
      <div className={`rounded-[1.75rem] ${pageStyles[mode]}`}>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,460px)]">
          <section className="flex flex-col justify-between rounded-[1.5rem] border border-slate-200/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8">
            <div className="space-y-6">
              <Link
                href="/"
                className="inline-flex w-fit items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-dark text-sm font-bold text-white">
                  F
                </span>
                FinOps Suite
              </Link>

              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                  {copy.badge}
                </p>
                <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl sm:leading-[1.04]">
                  {copy.heroTitle}
                </h1>
                <p className="max-w-2xl text-base text-slate-600 sm:text-lg">
                  {copy.heroDescription}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {copy.heroCards.map((card) => (
                  <div
                    key={card.title}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <p className="text-sm font-semibold text-slate-900">
                      {card.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {card.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid gap-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-white p-4">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <p className="mt-3 text-sm font-semibold text-slate-900">
                    HTTP-only cookie sessions
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Same-site strict cookie handling keeps tokens out of local storage.
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <LockKeyhole className="h-5 w-5 text-primary" />
                  <p className="mt-3 text-sm font-semibold text-slate-900">
                    One backend authority
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Auth.js handles OAuth, but your backend still issues the real app session.
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <p className="mt-3 text-sm font-semibold text-slate-900">
                    Clean SaaS UX
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Fast redirects, polished loading states, and one auth store for the app.
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-8 text-sm text-slate-600">
              {copy.alternateLabel}{' '}
              <Link
                href={copy.alternateHref}
                className="font-semibold text-primary transition hover:text-secondary"
              >
                {copy.alternateLinkLabel}
              </Link>
            </p>
          </section>

          <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/95 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-6 lg:p-8">
            <div className="mb-6 space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                {copy.formEyebrow}
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                {copy.formTitle}
              </h2>
              <p className="text-sm leading-6 text-slate-600 sm:text-base">
                {copy.formDescription}
              </p>
            </div>

            <div className="grid gap-3">
              {oauthProviders.map(({ provider, label, icon: Icon }) => (
                <button
                  key={provider}
                  type="button"
                  onClick={() => void handleOAuthSignIn(provider)}
                  disabled={Boolean(activeOAuthProvider) || isSubmitting}
                  className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {activeOAuthProvider === provider ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                  {label}
                </button>
              ))}
            </div>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Or continue with email
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <form className="grid gap-4" onSubmit={handleSubmit}>
              {mode === 'register' ? (
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Full name
                  <input
                    type="text"
                    autoComplete="name"
                    value={formState.name}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-primary focus:bg-white"
                    placeholder="Alex Morgan"
                    required
                  />
                </label>
              ) : null}

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Email
                <input
                  type="email"
                  autoComplete="email"
                  value={formState.email}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-primary focus:bg-white"
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Password
                <input
                  type="password"
                  autoComplete={
                    mode === 'register' ? 'new-password' : 'current-password'
                  }
                  value={formState.password}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-primary focus:bg-white"
                  placeholder="Minimum 8 characters"
                  minLength={8}
                  required
                />
              </label>

              {mode === 'register' ? (
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Confirm password
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={formState.confirmPassword}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        confirmPassword: event.target.value,
                      }))
                    }
                    className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-primary focus:bg-white"
                    placeholder="Repeat your password"
                    minLength={8}
                    required
                  />
                </label>
              ) : null}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                Sessions are stored in secure HTTP-only cookies. The app restores your login automatically without local storage.
              </div>

              {errorMessage ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {errorMessage}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting || Boolean(activeOAuthProvider)}
                className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-dark px-4 text-sm font-semibold text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {copy.loadingLabel}
                  </>
                ) : (
                  copy.buttonLabel
                )}
              </button>
            </form>
          </section>
        </div>
      </div>
    </AuthShell>
  );
}
