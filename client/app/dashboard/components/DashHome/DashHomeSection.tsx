'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { LoaderCircle, Plus } from 'lucide-react';
import type { CreateTransactionPayload, DashboardData } from '@/lib/api/types';
import AddTransactionModal from './AddTransactionModal';
import DashBudgetTracker from './DashBudgetTracker';
import DashHero from './Dashhero';
import RecentTransactioncards from './RecentTransactioncards';
import Transactioncards from './Transactioncards';

type DashHomeSectionProps = {
  dashboard: DashboardData | null;
  displayName: string;
  isLoading?: boolean;
  isRefreshing?: boolean;
  onCreateTransaction: (payload: CreateTransactionPayload) => Promise<void>;
  searchValue: string;
};

export default function DashHomeSection({
  dashboard,
  displayName,
  isLoading = false,
  isRefreshing = false,
  onCreateTransaction,
  searchValue,
}: DashHomeSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingTransaction, setIsCreatingTransaction] = useState(false);

  const filteredTransactions = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) {
      return dashboard?.recentTransactions ?? [];
    }

    return (dashboard?.recentTransactions ?? []).filter((transaction) => {
      const haystack = [
        transaction.category,
        transaction.note ?? '',
        transaction.type,
        String(transaction.amount),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [dashboard?.recentTransactions, searchValue]);

  const handleCreateTransaction = async (payload: CreateTransactionPayload) => {
    setIsCreatingTransaction(true);

    try {
      await onCreateTransaction(payload);
      setIsModalOpen(false);
    } finally {
      setIsCreatingTransaction(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-3 rounded-[1.5rem] border border-slate-200/80 bg-white px-5 py-4 shadow-[0_20px_50px_rgba(15,23,42,0.05)] sm:flex-row sm:items-center sm:justify-between sm:px-6"
      >
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Dashboard Home is connected
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Login now lands on a working dashboard with navbar, live totals, recent
            activity, and synced budgets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {isRefreshing ? 'Refreshing live data' : 'Real-time refresh active'}
          </span>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {isCreatingTransaction ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Add transaction
          </button>
        </div>
      </motion.div>

      <DashHero
        dashboard={dashboard}
        displayName={displayName}
        isLoading={isLoading}
      />

      <Transactioncards dashboard={dashboard} isLoading={isLoading} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,380px)]">
        <RecentTransactioncards
          isLoading={isLoading}
          searchValue={searchValue}
          transactions={filteredTransactions}
        />
        <DashBudgetTracker dashboard={dashboard} isLoading={isLoading} />
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        isSubmitting={isCreatingTransaction}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTransaction}
      />
    </div>
  );
}
