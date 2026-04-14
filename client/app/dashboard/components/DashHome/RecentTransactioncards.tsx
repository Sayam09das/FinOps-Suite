'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, History, Search } from 'lucide-react';
import type { Transaction } from '@/lib/api/types';
import {
  formatCurrency,
  formatDateLabel,
  formatTimeLabel,
} from './dashboard-helpers';

type RecentTransactioncardsProps = {
  isLoading?: boolean;
  searchValue?: string;
  transactions: Transaction[];
};

export default function RecentTransactioncards({
  isLoading = false,
  searchValue = '',
  transactions,
}: RecentTransactioncardsProps) {
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      if (typeFilter !== 'all' && transaction.type !== typeFilter) {
        return false;
      }

      return true;
    });
  }, [transactions, typeFilter]);

  return (
    <section className="rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            <History className="h-3.5 w-3.5" />
            Recent activity
          </div>
          <h2 className="mt-3 text-2xl font-bold text-slate-950">
            Latest dashboard transactions
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Search from the navbar filters this list in real time.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['all', 'income', 'expense'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTypeFilter(type)}
              className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                typeFilter === type
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type === 'all'
                ? 'All'
                : `${type.charAt(0).toUpperCase()}${type.slice(1)}`}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
        <Search className="h-4 w-4" />
        {searchValue.trim()
          ? `Showing results for "${searchValue.trim()}"`
          : 'Showing the latest synced transactions'}
      </div>

      {isLoading ? (
        <div className="mt-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          Refreshing transaction feed
        </div>
      ) : null}

      <div className="mt-5 space-y-3">
        {filteredTransactions.length ? (
          filteredTransactions.map((transaction, index) => {
            const isIncome = transaction.type === 'income';

            return (
              <motion.article
                key={transaction.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                        isIncome
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {isIncome ? (
                        <ArrowUpRight className="h-5 w-5" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-900">
                          {transaction.category}
                        </h3>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            isIncome
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {isIncome ? 'Income' : 'Expense'}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        {transaction.note?.trim() || 'No note added for this transaction.'}
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-lg font-bold text-slate-950">
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
                      {formatDateLabel(transaction.date)} at{' '}
                      {formatTimeLabel(transaction.createdAt)}
                    </p>
                  </div>
                </div>
              </motion.article>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-12 text-center text-sm text-slate-500">
            No transactions match the current search or filter yet.
          </div>
        )}
      </div>
    </section>
  );
}
