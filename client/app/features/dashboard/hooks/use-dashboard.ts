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
  
  // Grace period check + cached user fallback
  const graceUntil = typeof window !== 'undefined' 
    ? parseInt(localStorage.getItem('authGraceUntil') || '0')
    : 0
  const inGracePeriod = Date.now() < graceUntil
  const cachedUser = typeof window !== 'undefined' 
    ? localStorage.getItem('finops-user')
    : null
  
  const effectiveUser = user || (inGracePeriod && cachedUser ? JSON.parse(cachedUser) : null)
  const isAuthenticated = !!effectiveUser?.id || inGracePeriod

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
    isLoading: authLoading || overviewLoading || budgetsLoading || transactionsLoading || (!isAuthenticated && !inGracePeriod),
    // Grace period extends loading to prevent premature redirect
  }
}
