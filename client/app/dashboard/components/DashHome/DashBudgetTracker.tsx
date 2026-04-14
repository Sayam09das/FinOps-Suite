'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Target } from 'lucide-react';
import type { DashboardData } from '@/lib/api/types';
import { formatCurrency } from '../dashboard-helpers';

type DashBudgetTrackerProps = {
  dashboard: DashboardData | null;
  isLoading?: boolean;
};

export default function DashBudgetTracker({
  dashboard,
  isLoading = false,
}: DashBudgetTrackerProps) {
  const budgets = Object.entries(dashboard?.budgets ?? {})
    .map(([category, budget]) => ({
      category,
      ...budget,
      usage: budget.budget > 0 ? (budget.spent / budget.budget) * 100 : 0,
    }))
    .sort((left, right) => right.usage - left.usage);

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.budget, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalRemaining = budgets.reduce(
    (sum, budget) => sum + budget.remaining,
    0,
  );

  return (
    <section className="rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <Target className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-slate-950">Budget tracker</h2>
          <p className="mt-1 text-sm text-slate-500">
            Monthly spending targets synced from your dashboard data.
          </p>
        </div>

        {isLoading ? (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            Updating
          </span>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Budgeted
          </p>
          <p className="mt-2 text-xl font-bold text-slate-950">
            {formatCurrency(totalBudget)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Spent
          </p>
          <p className="mt-2 text-xl font-bold text-slate-950">
            {formatCurrency(totalSpent)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Remaining
          </p>
          <p className="mt-2 text-xl font-bold text-slate-950">
            {formatCurrency(totalRemaining)}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {budgets.length ? (
          budgets.map((budget, index) => (
            <motion.div
              key={budget.category}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {budget.category}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatCurrency(budget.spent)} spent of{' '}
                    {formatCurrency(budget.budget)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    budget.usage > 100
                      ? 'bg-rose-100 text-rose-700'
                      : budget.usage >= 80
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {budget.usage.toFixed(0)}%
                </span>
              </div>

              <div className="mt-4 h-2 rounded-full bg-slate-200">
                <div
                  className={`h-2 rounded-full ${
                    budget.usage > 100
                      ? 'bg-rose-500'
                      : budget.usage >= 80
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(budget.usage, 100)}%` }}
                />
              </div>

              <div className="mt-3 flex items-start justify-between gap-3 text-sm">
                <span className="text-slate-500">
                  Remaining {formatCurrency(budget.remaining)}
                </span>
                {budget.alert ? (
                  <span className="inline-flex items-center gap-1 text-amber-700">
                    <AlertTriangle className="h-4 w-4" />
                    {budget.alert}
                  </span>
                ) : null}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-12 text-center text-sm text-slate-500">
            No monthly budgets were found yet. Once budgets exist in the backend,
            they will show up here automatically.
          </div>
        )}
      </div>
    </section>
  );
}
