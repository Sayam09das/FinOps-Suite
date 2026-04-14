'use client';

import { motion } from 'framer-motion';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  PiggyBank,
  Target,
} from 'lucide-react';
import type { DashboardData } from '@/lib/api/types';
import {
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
} from '../dashboard-helpers';

type TransactionCardsProps = {
  dashboard: DashboardData | null;
  isLoading?: boolean;
};

export default function Transactioncards({
  dashboard,
  isLoading = false,
}: TransactionCardsProps) {
  const income = dashboard?.income ?? 0;
  const expense = dashboard?.expense ?? 0;
  const balance = dashboard?.balance ?? 0;
  const totalFlow = income + expense;
  const savingsRate = income > 0 ? (balance / income) * 100 : 0;
  const topCategories = Object.entries(dashboard?.categoryAnalytics ?? {})
    .sort(([, leftAmount], [, rightAmount]) => rightAmount - leftAmount)
    .slice(0, 4);
  const topCategoryMax = topCategories[0]?.[1] ?? 0;

  const metricCards = [
    {
      id: 'income',
      label: 'Income',
      icon: ArrowUpCircle,
      value: formatCurrency(income),
      description: 'Money coming in',
      accent: 'bg-emerald-50 text-emerald-700',
    },
    {
      id: 'expense',
      label: 'Expenses',
      icon: ArrowDownCircle,
      value: formatCurrency(expense),
      description: 'Money going out',
      accent: 'bg-rose-50 text-rose-700',
    },
    {
      id: 'balance',
      label: 'Net balance',
      icon: PiggyBank,
      value: formatCurrency(balance),
      description: `Savings rate ${formatPercent(savingsRate)}`,
      accent: 'bg-blue-50 text-blue-700',
    },
  ];

  return (
    <section className="rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Real-Time Summary
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">
            Cash flow and category breakdown
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
            Total movement
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-950">
            {formatCurrency(totalFlow)}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          Syncing dashboard metrics
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,340px)]">
        <div className="grid gap-4 md:grid-cols-3">
          {metricCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.28 }}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${card.accent}`}
                >
                  <card.icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {card.label}
                </span>
              </div>

              <p className="mt-5 text-2xl font-bold text-slate-950">{card.value}</p>
              <p className="mt-1 text-sm text-slate-500">{card.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
          className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
              <Target className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">Top categories</p>
              <p className="text-sm text-slate-500">
                Ranked by actual dashboard totals
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {topCategories.length ? (
              topCategories.map(([category, amount]) => (
                <div key={category}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-slate-700">
                      {category}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {formatCompactCurrency(amount)}
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-[linear-gradient(90deg,#0f172a_0%,#2563eb_100%)]"
                      style={{
                        width: `${topCategoryMax ? (amount / topCategoryMax) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
                Add transactions to see live category analytics here.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
