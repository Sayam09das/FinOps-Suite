'use client';

import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, Clock3 } from 'lucide-react';
import type { DashboardData } from '@/lib/api/types';
import {
  formatCurrency,
  formatDateLabel,
  formatTimeLabel,
} from '../dashboard-helpers';

type DashUpdatesProps = {
  dashboard: DashboardData | null;
  isLoading?: boolean;
  searchValue?: string;
};

export default function DashUpdates({
  dashboard,
  isLoading = false,
  searchValue = '',
}: DashUpdatesProps) {
  const query = searchValue.trim().toLowerCase();
  const updates = (dashboard?.recentTransactions ?? []).filter((transaction) => {
    if (!query) {
      return true;
    }

    return [transaction.category, transaction.note ?? '', transaction.type]
      .join(' ')
      .toLowerCase()
      .includes(query);
  });

  return (
    <section className="rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            <Clock3 className="h-3.5 w-3.5" />
            Activity timeline
          </div>
          <h2 className="mt-3 text-2xl font-bold text-slate-950">
            Latest updates from your dashboard
          </h2>
        </div>

        {isLoading ? (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            Syncing
          </span>
        ) : null}
      </div>

      <div className="mt-6 space-y-4">
        {updates.length ? (
          updates.map((transaction, index) => {
            const isIncome = transaction.type === 'income';

            return (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, delay: index * 0.05 }}
                className="relative rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 pl-12"
              >
                <span
                  className={`absolute left-4 top-5 h-3 w-3 rounded-full ${
                    isIncome ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {transaction.category}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {transaction.note?.trim() || 'Transaction synced from the API.'}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-400">
                      {formatDateLabel(transaction.date)} at{' '}
                      {formatTimeLabel(transaction.createdAt)}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <div
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        isIncome
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {isIncome ? (
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDownRight className="h-3.5 w-3.5" />
                      )}
                      {isIncome ? 'Income' : 'Expense'}
                    </div>
                    <p className="mt-2 text-lg font-bold text-slate-950">
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-12 text-center text-sm text-slate-500">
            No recent updates match the current search.
          </div>
        )}
      </div>
    </section>
  );
}
