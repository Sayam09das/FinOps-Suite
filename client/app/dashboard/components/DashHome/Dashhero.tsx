'use client';

import { useMemo, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  BadgeDollarSign,
  Briefcase,
  ChevronDown,
  MoreHorizontal,
  PiggyBank,
  Upload,
  WalletCards,
} from 'lucide-react';
import type { DashboardData } from '@/lib/api/types';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
} satisfies Variants;

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

const getGreeting = () => {
  const hours = new Date().getHours();

  if (hours < 12) {
    return 'Good Morning';
  }

  if (hours < 18) {
    return 'Good Afternoon';
  }

  return 'Good Evening';
};

type DashHeroProps = Readonly<{
  dashboard: DashboardData | null;
  displayName: string;
  isLoading?: boolean;
}>;

export default function DashHero({
  dashboard,
  displayName,
  isLoading = false,
}: DashHeroProps) {
  const [period, setPeriod] = useState('This Month');

  const cards = useMemo(() => {
    const income = dashboard?.income ?? 0;
    const expense = dashboard?.expense ?? 0;
    const balance = dashboard?.balance ?? 0;
    const savings = income - expense;

    return [
      {
        id: 'balance',
        label: 'Total Balance',
        value: formatCurrency(balance),
        sub: 'Live balance from your secured dashboard.',
        icon: Briefcase,
        gradient: 'from-violet-500 to-purple-600',
        shadow: 'shadow-purple-200',
      },
      {
        id: 'income',
        label: 'Monthly Income',
        value: formatCurrency(income),
        sub: 'Income synced from backend totals.',
        icon: BadgeDollarSign,
        gradient: 'from-orange-400 to-rose-500',
        shadow: 'shadow-orange-200',
      },
      {
        id: 'expenses',
        label: 'Monthly Expenses',
        value: formatCurrency(expense),
        sub: 'Expense totals for the current period.',
        icon: WalletCards,
        gradient: 'from-pink-500 to-rose-500',
        shadow: 'shadow-pink-200',
      },
      {
        id: 'savings',
        label: 'Savings',
        value: formatCurrency(savings),
        sub: 'Income minus expenses this month.',
        icon: PiggyBank,
        gradient: 'from-blue-400 to-indigo-500',
        shadow: 'shadow-blue-200',
      },
    ];
  }, [dashboard]);

  return (
    <section className="w-full space-y-6 rounded-2xl border border-gray-100 bg-white p-5 sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {getGreeting()}, {displayName}
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Here&apos;s an overview of your financial health and recent activity.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex shrink-0 items-center gap-2"
        >
          <button
            type="button"
            onClick={() =>
              setPeriod((current) =>
                current === 'This Month' ? 'Last Month' : 'This Month',
              )
            }
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            {period}
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Upload size={14} className="text-gray-500" />
            Export
          </button>
        </motion.div>
      </div>

      {isLoading ? (
        <div className="inline-flex items-center rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
          Syncing dashboard totals from the backend
        </div>
      ) : null}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {cards.map((card) => (
          <motion.div
            key={card.id}
            variants={cardVariants}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="flex cursor-pointer flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br ${card.gradient} shadow-lg ${card.shadow}`}
              >
                <card.icon size={22} className="text-white" strokeWidth={1.8} />
              </div>

              <div>
                <p className="text-2xl font-bold leading-tight text-gray-900">
                  {card.value}
                </p>
                <p className="mt-0.5 text-xs leading-snug text-gray-400">
                  {card.sub}
                </p>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800">
                {card.label}
              </span>
              <button
                type="button"
                className="rounded-lg p-1 transition-colors hover:bg-gray-100"
              >
                <MoreHorizontal size={16} className="text-gray-400" />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
