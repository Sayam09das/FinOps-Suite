'use client';

import { BarChart3, Layers3, TrendingUp } from 'lucide-react';
import type { DashboardData } from '@/lib/api/types';
import {
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
} from '../dashboard-helpers';

type AnalyticshomeProps = {
  dashboard: DashboardData | null;
  isLoading?: boolean;
};

export default function Analyticshome({
  dashboard,
  isLoading = false,
}: AnalyticshomeProps) {
  const categoryEntries = Object.entries(dashboard?.categoryAnalytics ?? {}).sort(
    ([, leftAmount], [, rightAmount]) => rightAmount - leftAmount,
  );
  const totalCategorySpend = categoryEntries.reduce(
    (sum, [, amount]) => sum + amount,
    0,
  );
  const largestCategory = categoryEntries[0];
  const savingsRate =
    (dashboard?.income ?? 0) > 0
      ? ((dashboard?.balance ?? 0) / (dashboard?.income ?? 1)) * 100
      : 0;

  return (
    <section className="rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <BarChart3 className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500">Tracked categories</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">
            {categoryEntries.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <TrendingUp className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500">Savings rate</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">
            {formatPercent(savingsRate)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
            <Layers3 className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500">
            Largest category
          </p>
          <p className="mt-2 text-xl font-bold text-slate-950">
            {largestCategory?.[0] ?? 'No data yet'}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {largestCategory ? formatCurrency(largestCategory[1]) : 'Add transactions'}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-5 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          Refreshing analytics
        </div>
      ) : null}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-xl font-bold text-slate-950">Category mix</h2>
        <p className="mt-1 text-sm text-slate-500">
          Live totals based on the transactions returned from your dashboard API.
        </p>

        <div className="mt-5 space-y-4">
          {categoryEntries.length ? (
            categoryEntries.slice(0, 6).map(([category, amount]) => (
              <div key={category}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-slate-700">{category}</span>
                  <span className="font-semibold text-slate-950">
                    {formatCompactCurrency(amount)}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-200">
                  <div
                    className="h-2 rounded-full bg-[linear-gradient(90deg,#0f172a_0%,#2563eb_100%)]"
                    style={{
                      width: `${totalCategorySpend ? (amount / totalCategorySpend) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-500">
              Analytics will appear here once transaction data is available.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
