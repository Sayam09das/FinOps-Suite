'use client';

import { UserButton, useAuth, useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import {
  ArrowDownRight,
  ArrowUpRight,
  Landmark,
  Loader2,
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

const cardMotion = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

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
  const { getToken } = useAuth();
  const { user } = useUser();
  const [profile, setProfile] = useState<CurrentUser | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [formState, setFormState] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadDashboard = useEffectEvent(async () => {
    try {
      setErrorMessage(null);

      const token = await getToken();

      if (!token) {
        throw new Error('Unable to fetch a Clerk session token.');
      }

      const [nextProfile, nextDashboard, nextTransactions] = await Promise.all([
        userService.getCurrent(token),
        dashboardService.get(token),
        transactionService.list(token),
      ]);

      startTransition(() => {
        setProfile(nextProfile);
        setDashboard(nextDashboard);
        setTransactions(nextTransactions.data);
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
    void loadDashboard();
  }, [loadDashboard]);

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
      const token = await getToken();

      if (!token) {
        throw new Error('Unable to fetch a Clerk session token.');
      }

      await transactionService.create(token, {
        amount,
        type: formState.type,
        category: formState.category,
        note: formState.note.trim() || undefined,
        createdAt: new Date().toISOString(),
      });

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

  const budgetEntries = Object.entries(dashboard?.budgets ?? {});
  const displayEmail =
    profile?.email ?? user?.primaryEmailAddress?.emailAddress ?? 'Signed in user';

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
                Clerk session connected to Express + Prisma
              </div>

              <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Secure finance workflows without bolting auth on later.
              </h1>

              <p className="mt-4 max-w-xl text-base leading-7 text-white/72 sm:text-lg">
                Your dashboard is protected by Clerk, your Mongo user is synced on
                first sign-in, and every backend request is sent with a verified
                Bearer token.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/85">
                  {displayEmail}
                </span>
                <span className="rounded-full bg-accent/15 px-4 py-2 text-sm font-medium text-accent">
                  Role: {profile?.role ?? 'USER'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 self-start">
              <div className="rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-sm text-white/70">
                Synced with Clerk ID
                <p className="mt-1 max-w-[15rem] truncate font-semibold text-white">
                  {profile?.clerkId ?? user?.id ?? 'Loading...'}
                </p>
              </div>
              <UserButton />
            </div>
          </div>
        </motion.div>

        {errorMessage ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: 'Net balance',
              value: formatCurrency(dashboard?.balance ?? 0),
              icon: Wallet,
              tone: 'from-primary/15 to-primary/5 text-primary',
            },
            {
              label: 'Income',
              value: formatCurrency(dashboard?.income ?? 0),
              icon: ArrowUpRight,
              tone: 'from-emerald-500/15 to-emerald-500/5 text-emerald-600',
            },
            {
              label: 'Expenses',
              value: formatCurrency(dashboard?.expense ?? 0),
              icon: ArrowDownRight,
              tone: 'from-rose-500/15 to-rose-500/5 text-rose-600',
            },
            {
              label: 'Access level',
              value: profile?.role ?? 'USER',
              icon: ShieldCheck,
              tone: 'from-sky-500/15 to-sky-500/5 text-sky-600',
            },
          ].map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.article
                key={card.label}
                {...cardMotion}
                transition={{ delay: 0.08 * index, duration: 0.45 }}
                className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{card.label}</p>
                    <p className="mt-3 text-2xl font-bold text-slate-900">
                      {card.value}
                    </p>
                  </div>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.tone}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <motion.section
            {...cardMotion}
            transition={{ delay: 0.12, duration: 0.5 }}
            className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)]"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                  Protected API Action
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Create a transaction
                </h2>
              </div>
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                <Landmark className="h-5 w-5" />
              </div>
            </div>

            <form className="mt-6 grid gap-4" onSubmit={handleCreateTransaction}>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Amount
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={formState.amount}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      amount: event.target.value,
                    }))
                  }
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-primary focus:bg-white"
                  placeholder="1250"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
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
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
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
              </div>

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
                  placeholder="Example: Monthly AWS bill for production."
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-dark px-5 text-sm font-semibold text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving transaction
                  </>
                ) : (
                  'Create protected transaction'
                )}
              </button>
            </form>
          </motion.section>

          <motion.section
            {...cardMotion}
            transition={{ delay: 0.18, duration: 0.5 }}
            className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)]"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                  Budget Snapshot
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Synced backend data
                </h2>
              </div>
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                <PiggyBank className="h-5 w-5" />
              </div>
            </div>

            {budgetEntries.length ? (
              <div className="mt-6 space-y-4">
                {budgetEntries.map(([category, summary]) => {
                  const progress = Math.min(
                    100,
                    Math.round((summary.spent / Math.max(summary.budget, 1)) * 100),
                  );

                  return (
                    <article
                      key={category}
                      className="rounded-3xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="text-base font-semibold text-slate-900">
                            {category}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {formatCurrency(summary.spent)} spent of{' '}
                            {formatCurrency(summary.budget)}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-slate-700">
                          {progress}%
                        </span>
                      </div>
                      <div className="mt-4 h-2 rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      {summary.alert ? (
                        <p className="mt-3 text-sm font-medium text-rose-600">
                          {summary.alert}
                        </p>
                      ) : (
                        <p className="mt-3 text-sm text-slate-500">
                          Remaining: {formatCurrency(summary.remaining)}
                        </p>
                      )}
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-sm text-slate-500">
                No budget data yet. Once you create budgets in the backend, this
                panel will reflect the protected dashboard summary automatically.
              </div>
            )}
          </motion.section>
        </div>

        <motion.section
          {...cardMotion}
          transition={{ delay: 0.24, duration: 0.5 }}
          className="mt-8 rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)]"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Recent Transactions
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Latest protected activity
              </h2>
            </div>
            {(isLoading || isPending) && (
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-4">
            {transactions.length ? (
              transactions.map((transaction) => (
                <article
                  key={transaction.id}
                  className="grid gap-4 rounded-3xl border border-slate-100 bg-slate-50 px-5 py-4 sm:grid-cols-[1fr_auto_auto]"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${
                          transaction.type === 'income'
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-rose-100 text-rose-600'
                        }`}
                      >
                        {transaction.type === 'income' ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                      </span>
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">
                          {transaction.category}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {transaction.note || 'Authenticated transaction recorded through Clerk JWT.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm font-medium text-slate-500">
                    {formatDate(transaction.createdAt ?? transaction.date)}
                  </div>

                  <div
                    className={`text-right text-base font-bold ${
                      transaction.type === 'income'
                        ? 'text-emerald-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-sm text-slate-500">
                No transactions yet. Use the form above to create one and watch the
                dashboard refresh with authenticated backend data.
              </div>
            )}
          </div>
        </motion.section>
      </section>
    </main>
  );
}
