'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowDownRight,
  ArrowUpRight,
  Landmark,
  Loader2,
  LogOut,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  Wallet,
} from 'lucide-react';
import {
  useEffect,
  useEffectEvent,
  useState,
  useTransition,
  type FormEvent,
} from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/app/store/auth.store';
import { ApiError } from '@/lib/api/client';
import { dashboardService } from '@/lib/api/dashboard-service';
import { transactionService } from '@/lib/api/transaction-service';
import { userService } from '@/lib/api/user-service';
import type {
  CurrentUser,
  DashboardData,
  Transaction,
  TransactionType,
} from '@/lib/api/types';

const categories = [
  'Operations',
  'Payroll',
  'Revenue',
  'Infrastructure',
  'Marketing',
  'Travel',
  'Software',
] as const;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
  }).format(new Date(value));

const emptyForm = {
  amount: '',
  type: 'expense' as TransactionType,
  category: 'Operations',
  note: '',
};

export function DashboardShell() {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const currentUser = useAuthStore((state) => state.currentUser);
  const updateCurrentUser = useAuthStore((state) => state.updateCurrentUser);
  const clearSession = useAuthStore((state) => state.clearSession);
  const hydrateSession = useAuthStore((state) => state.hydrateSession);
  const logout = useAuthStore((state) => state.logout);
  const [profile, setProfile] = useState<CurrentUser | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [formState, setFormState] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const requestWithAuth = async <T,>(request: () => Promise<T>): Promise<T> => {
    try {
      return await request();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        const user = await hydrateSession();

        if (!user) {
          clearSession();
          router.replace('/login');
          throw new Error('Your session has expired. Please sign in again.');
        }

        return request();
      }

      throw error;
    }
  };

  const loadDashboard = useEffectEvent(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const [nextProfile, nextDashboard, nextTransactions] = await requestWithAuth(
        async () =>
          Promise.all([
            userService.getCurrent(),
            dashboardService.get(),
            transactionService.list(),
          ]),
      );

      startTransition(() => {
        setProfile(nextProfile);
        setDashboard(nextDashboard);
        setTransactions(nextTransactions.data);
        updateCurrentUser(nextProfile);
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to load your dashboard.';

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!currentUser) {
      router.replace('/login');
      return;
    }

    void loadDashboard();
  }, [currentUser, hasHydrated, loadDashboard, router]);

  const handleCreateTransaction = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const amount = Number(formState.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Enter a valid positive amount.');
      return;
    }

    setIsSubmitting(true);

    try {
      await requestWithAuth(() =>
        transactionService.create({
          amount,
          type: formState.type,
          category: formState.category,
          note: formState.note.trim() || undefined,
          createdAt: new Date().toISOString(),
        }),
      );

      toast.success('Transaction created successfully.');
      setFormState(emptyForm);
      await loadDashboard();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Unable to create the transaction.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const budgetEntries = Object.entries(dashboard?.budgets ?? {});
  const displayEmail = profile?.email ?? currentUser?.email ?? 'Signed in user';
  const displayName =
    profile?.name ?? currentUser?.name ?? displayEmail.split('@')[0];

  if (!hasHydrated || (isLoading && !dashboard && !profile && !errorMessage)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading your dashboard
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#faf7ff_0%,#ffffff_40%,#eef7ff_100%)]">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,#101828_0%,#1f1754_55%,#2c4d9d_100%)] p-6 text-white shadow-[0_35px_90px_rgba(15,23,42,0.18)] sm:p-8"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-sm text-white/78">
                <Sparkles className="h-4 w-4 text-accent" />
                Auth.js OAuth + custom JWT cookie session
              </div>

              <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Secure finance workflows on your own auth stack.
              </h1>

              <p className="mt-4 max-w-xl text-base leading-7 text-white/72 sm:text-lg">
                Your dashboard uses unified auth across email/password and social
                login, with secure cookie-backed sessions routed through your own
                backend.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/85">
                  {displayName}
                </span>
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/85">
                  {displayEmail}
                </span>
                <span className="rounded-full bg-accent/15 px-4 py-2 text-sm font-medium text-accent">
                  Role: {profile?.role ?? currentUser?.role ?? 'USER'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 self-start">
              <div className="rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-sm text-white/70">
                Active user ID
                <p className="mt-1 max-w-[15rem] truncate font-semibold text-white">
                  {profile?.id ?? currentUser?.id ?? 'Loading...'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => void handleLogout()}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </button>
            </div>
          </div>
        </motion.div>

        {errorMessage ? (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,420px)]">
          <div className="grid gap-6">
            <section className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: 'Balance',
                  value: formatCurrency(dashboard?.balance ?? 0),
                  icon: Wallet,
                  tone: 'text-primary',
                },
                {
                  title: 'Income',
                  value: formatCurrency(dashboard?.income ?? 0),
                  icon: ArrowUpRight,
                  tone: 'text-emerald-500',
                },
                {
                  title: 'Expense',
                  value: formatCurrency(dashboard?.expense ?? 0),
                  icon: ArrowDownRight,
                  tone: 'text-rose-500',
                },
              ].map((card, index) => (
                <motion.article
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_20px_40px_rgba(15,23,42,0.06)]"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-500">{card.title}</p>
                    <card.icon className={`h-5 w-5 ${card.tone}`} />
                  </div>
                  <p className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
                    {card.value}
                  </p>
                </motion.article>
              ))}
            </section>

            <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_20px_40px_rgba(15,23,42,0.06)]">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">
                      Session Security
                    </h2>
                    <p className="text-sm text-slate-600">
                      JWTs are issued by your backend and stored in HTTP-only cookies.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      Unified account source
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Email/password and OAuth both land in the same user model.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      Provider-aware onboarding
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Provider: {currentUser?.provider ?? 'custom credentials'}
                    </p>
                  </div>
                </div>
              </article>

              <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_20px_40px_rgba(15,23,42,0.06)]">
                <div className="flex items-center gap-3">
                  <PiggyBank className="h-5 w-5 text-primary" />
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">
                      Budget Snapshot
                    </h2>
                    <p className="text-sm text-slate-600">
                      Current month budget health pulled from the protected backend.
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {budgetEntries.length ? (
                    budgetEntries.slice(0, 4).map(([category, budget]) => (
                      <div
                        key={category}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-slate-900">
                            {category}
                          </p>
                          <p className="text-sm text-slate-500">
                            {formatCurrency(budget.remaining)}
                          </p>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">
                          Spent {formatCurrency(budget.spent)} of{' '}
                          {formatCurrency(budget.budget)}
                        </p>
                        {budget.alert ? (
                          <p className="mt-2 text-sm font-medium text-rose-600">
                            {budget.alert}
                          </p>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                      No budgets found yet. Add transactions to start seeing budget insights.
                    </div>
                  )}
                </div>
              </article>
            </section>

            <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_20px_40px_rgba(15,23,42,0.06)]">
              <div className="flex items-center gap-3">
                <Landmark className="h-5 w-5 text-primary" />
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">
                    Recent Transactions
                  </h2>
                  <p className="text-sm text-slate-600">
                    Authenticated data loaded through your cookie-backed proxy routes.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {transactions.length ? (
                  transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {transaction.category}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {transaction.note || 'No note provided'}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                          {formatDate(transaction.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-base font-semibold ${
                            transaction.type === 'income'
                              ? 'text-emerald-600'
                              : 'text-rose-600'
                          }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-sm text-slate-500">{transaction.type}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                    No transactions yet. Use the form to create your first secured transaction.
                  </div>
                )}
              </div>
            </article>
          </div>

          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_20px_40px_rgba(15,23,42,0.06)]"
          >
            <h2 className="text-lg font-semibold text-slate-950">
              Create authenticated transaction
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              This writes to protected backend routes using the same auth state as
              your login flow.
            </p>

            <form className="mt-6 grid gap-4" onSubmit={handleCreateTransaction}>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Amount
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={formState.amount}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      amount: event.target.value,
                    }))
                  }
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-primary focus:bg-white"
                  placeholder="2450"
                  required
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Type
                <select
                  value={formState.type}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      type: event.target.value as TransactionType,
                    }))
                  }
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-primary focus:bg-white"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Category
                <select
                  value={formState.category}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      category: event.target.value,
                    }))
                  }
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-primary focus:bg-white"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Note
                <textarea
                  rows={4}
                  value={formState.note}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      note: event.target.value,
                    }))
                  }
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white"
                  placeholder="Monthly infrastructure cost"
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting || isPending}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-dark px-4 text-sm font-semibold text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving transaction
                  </>
                ) : (
                  'Save transaction'
                )}
              </button>
            </form>
          </motion.aside>
        </div>
      </section>
    </main>
  );
}
