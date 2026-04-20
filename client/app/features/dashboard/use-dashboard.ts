import { useDashboardOverviewQuery, useBudgetsQuery, useTransactionsQuery } from '@/app/lib/api/queries'
import { useMemo } from 'react'

interface DashboardStats {
  totalBudgets: number
  totalSpend: number
  transactionsThisMonth: number
  budgetUtilization: number
}

export function useDashboard() {
  const { data: overview } = useDashboardOverviewQuery()
  const { data: budgets } = useBudgetsQuery()
  const { data: transactions } = useTransactionsQuery()

  const stats = useMemo<DashboardStats | null>(() => {
    if (!overview || !budgets || !transactions) return null

    return {
      totalBudgets: budgets.length,
      totalSpend: overview.totalSpend || 0,
      transactionsThisMonth: transactions.filter((t: any) => 
        new Date(t.date).getMonth() === new Date().getMonth()
      ).length,
      budgetUtilization: overview.budgetUtilization || 0,
    }
  }, [overview, budgets, transactions])

  return {
    stats,
    budgets: budgets || [],
    transactions: transactions || [],
    isLoading: !overview || !budgets || !transactions,
  }
}

