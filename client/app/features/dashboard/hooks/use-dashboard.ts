"use client"

import { useDashboardOverviewQuery, useBudgetsQuery, useTransactionsQuery } from '@/app/lib/api/queries'
import { useMemo } from 'react'
import { DashboardStats, Transaction, Budget } from '../types/dashboard'

export function useDashboard() {
  const { data: overview } = useDashboardOverviewQuery()
  const { data: budgets } = useBudgetsQuery()
  const { data: transactions } = useTransactionsQuery()

  const stats = useMemo<DashboardStats | null>(() => {
    if (!overview || !budgets || !transactions) return null

    return {
      totalBudgets: budgets.length,
      totalSpend: overview.totalSpend || 0,
      transactionsThisMonth: transactions.filter((t: Transaction) => 
        new Date(t.date || '').getMonth() === new Date().getMonth()
      ).length,
      budgetUtilization: overview.budgetUtilization || 0,
    }
  }, [overview, budgets, transactions])

  return {
    stats,
    budgets: budgets as Budget[] || [],
    transactions: transactions as Transaction[] || [],
    isLoading: !overview || !budgets || !transactions,
  }
}

