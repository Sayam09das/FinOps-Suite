"use client"

import { useAuth } from '@/app/features/auth'
import { 
  useDashboardOverviewQuery, 
  useBudgetsQuery, 
  useTransactionsQuery 
} from '@/app/lib/api/queries'
import { useMemo } from 'react'
import { DashboardStats, Transaction, Budget } from '../types/dashboard'

export function useDashboard() {
  const { user, isLoading: authLoading } = useAuth()
  const isAuthenticated = !!user?.id

const { data: overview, isLoading: overviewLoading } = useDashboardOverviewQuery()
  const { data: budgets, isLoading: budgetsLoading } = useBudgetsQuery()
  const { data: transactions, isLoading: transactionsLoading } = useTransactionsQuery()

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
    isLoading: authLoading || overviewLoading || budgetsLoading || transactionsLoading || !isAuthenticated,
  }
}
