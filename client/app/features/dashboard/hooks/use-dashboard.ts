"use client"

import { useAuth } from '@/app/features/auth'
import { getGraceUser } from '@/app/features/auth/utils/auth-utils'
import { 
  useDashboardOverviewQuery, 
  useBudgetsQuery, 
  useTransactionsQuery 
} from '@/app/lib/api/queries'
import { useMemo } from 'react'
import { Budget, DashboardBudgetStatus, DashboardOverview, DashboardStats, Transaction } from '../types/dashboard'

const normalizeTransaction = (transaction: Transaction): Transaction => ({
  ...transaction,
  date: transaction.date || transaction.createdAt || new Date().toISOString(),
  description: transaction.description || transaction.note || transaction.category,
  type: transaction.type || 'expense',
})

const buildBudgetStatus = (budgets: Budget[], transactions: Transaction[]): Record<string, DashboardBudgetStatus> => {
  const status = budgets.reduce<Record<string, DashboardBudgetStatus>>((acc, budget) => {
    acc[budget.category] = {
      budget: budget.amount,
      spent: 0,
      remaining: budget.amount,
    }
    return acc
  }, {})

  transactions.forEach((transaction) => {
    if (transaction.type !== 'expense') return

    const entry = status[transaction.category]
    if (!entry) return

    entry.spent += transaction.amount
    entry.remaining = entry.budget - entry.spent

    if (entry.spent > entry.budget) {
      entry.alert = 'Budget exceeded'
    }
  })

  return status
}

export function useDashboard() {
  const { isAuthenticated, isInitializing: authLoading } = useAuth()
  const graceUser = getGraceUser()

  const { data: overview, isLoading: overviewLoading } = useDashboardOverviewQuery(isAuthenticated || !!graceUser)
  const { data: budgets = [], isLoading: budgetsLoading } = useBudgetsQuery(1, isAuthenticated || !!graceUser)
  const { data: transactionsResponse, isLoading: transactionsLoading } = useTransactionsQuery(1, isAuthenticated || !!graceUser, 50)
  const transactions = useMemo(() => {
    const source = Array.isArray(transactionsResponse)
      ? transactionsResponse
      : transactionsResponse?.data || overview?.recentTransactions || []

    return source.map(normalizeTransaction)
  }, [overview?.recentTransactions, transactionsResponse])

  const budgetStatus = useMemo(
    () => overview?.budgets || buildBudgetStatus(budgets, transactions),
    [budgets, overview?.budgets, transactions],
  )

  const categoryAnalytics = useMemo(() => {
    if (overview?.categoryAnalytics && Object.keys(overview.categoryAnalytics).length > 0) {
      return overview.categoryAnalytics
    }

    return transactions.reduce<Record<string, number>>((acc, transaction) => {
      if (transaction.type !== 'expense') return acc
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount
      return acc
    }, {})
  }, [overview?.categoryAnalytics, transactions])

  const stats = useMemo<DashboardStats | null>(() => {
    if (!overview && !transactions.length) return null

    const totalBudgetAmount = Object.values(budgetStatus).reduce((sum, entry) => sum + entry.budget, 0)
    const totalBudgetSpent = Object.values(budgetStatus).reduce((sum, entry) => sum + entry.spent, 0)
    const budgetUtilization = totalBudgetAmount > 0 ? (totalBudgetSpent / totalBudgetAmount) * 100 : 0

    return {
      totalBudgets: Object.keys(budgetStatus).length || budgets.length,
      totalSpend: overview?.expense ?? transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
      transactionsThisMonth: transactions.filter((t: Transaction) => 
        new Date(t.date || '').getMonth() === new Date().getMonth()
      ).length,
      budgetUtilization,
    }
  }, [budgetStatus, budgets.length, overview?.expense, transactions])

  const isEnabled = isAuthenticated || !!graceUser
  const isLoading = authLoading || (isEnabled && (overviewLoading || budgetsLoading || transactionsLoading))

  return {
    overview: overview as DashboardOverview | undefined,
    stats,
    budgets,
    budgetStatus,
    categoryAnalytics,
    transactions,
    isLoading,
  }
}
