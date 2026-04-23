"use client"

import { useAuth } from '@/app/features/auth'
import { getGraceUser } from '@/app/features/auth/utils/auth-utils'
import { 
  useDashboardOverviewQuery, 
  useBudgetsQuery, 
  useTransactionsQuery 
} from '@/app/lib/api/queries'
import { useMemo } from 'react'
import { DashboardStats, Transaction } from '../types/dashboard'

export function useDashboard() {
  const { isAuthenticated, isInitializing: authLoading } = useAuth()
  const graceUser = getGraceUser()

  const { data: overview, isLoading: overviewLoading } = useDashboardOverviewQuery(isAuthenticated || !!graceUser)
  const { data: budgets = [], isLoading: budgetsLoading } = useBudgetsQuery(1, isAuthenticated || !!graceUser)
  const { data: transactionsResponse, isLoading: transactionsLoading } = useTransactionsQuery(1, isAuthenticated || !!graceUser)
  const transactions = useMemo(
    () => (Array.isArray(transactionsResponse) ? transactionsResponse : transactionsResponse?.data || []),
    [transactionsResponse],
  )

  const stats = useMemo<DashboardStats | null>(() => {
    if (!overview || !budgets || !transactions) return null

    return {
      totalBudgets: budgets.length,
      totalSpend: overview.totalSpend ?? overview.expense ?? 0,
      transactionsThisMonth: transactions.filter((t: Transaction) => 
        new Date(t.date || '').getMonth() === new Date().getMonth()
      ).length,
      budgetUtilization: overview.budgetUtilization || 0,
    }
  }, [overview, budgets, transactions])

  return {
    stats,
    budgets,
    transactions,
    isLoading: authLoading || (isAuthenticated && (overviewLoading || budgetsLoading || transactionsLoading)),
  }
}
