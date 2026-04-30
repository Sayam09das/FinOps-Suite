"use client"

import React, { useState, useMemo } from 'react'

import HeaderControls from './FinanceSummary/HeaderControls'
import NetWorthCard from './FinanceSummary/NetWorthCard'
import IncomeExpenseChart from './FinanceSummary/IncomeExpenseChart'
import ExpenseBreakdown from './FinanceSummary/ExpenseBreakdown'
import CashFlowCards from './FinanceSummary/CashFlowCards'
import SavingsGoals from './FinanceSummary/SavingsGoals'
import AccountDistribution from './FinanceSummary/AccountDistribution'
import RecurringExpenses from './FinanceSummary/RecurringExpenses'
import AlertsPanel from './FinanceSummary/AlertsPanel'
import SummaryTable from './FinanceSummary/SummaryTable'
import { useDashboardOverviewQuery } from '@/app/lib/api/queries'
import { useAuth } from '@/app/features/auth'

// Type definitions for API response
interface WeeklyDataPoint {
  week: string
  income: number
  expense: number
}

interface AlertItem {
  id: string
  message: string
  type: 'warning' | 'error' | 'info'
  createdAt: string
}

interface BudgetSummaryItem {
  category: string
  budget: number
  actual: number
  difference: number
  status: 'over' | 'under' | 'ontrack'
}

interface AccountSummary {
  id: string
  name: string
  balance: number
  type: string
}

interface RecurringExpenseItem {
  id: string
  name: string
  amount: number
  dueDate: string
  category: string
}

// Transform API response to component props
function transformData(data: any) {
  if (!data) {
    return {
      netWorth: 0,
      assets: 0,
      liabilities: 0,
      trend: 0,
      income: 0,
      expense: 0,
      savingsRate: 0,
      categories: [],
      cashFlow: { opening: 0, in: 0, out: 0, closing: 0 },
      goals: [],
      accounts: [],
      recurring: [],
      alerts: [],
      budgetSummary: [],
      weeklyData: []
    }
  }

  // Transform category analytics to expense breakdown format
  const categoryAnalytics: Record<string, number> = data.categoryAnalytics || {}
  const categoryEntries = Object.keys(categoryAnalytics).map((name: string) => ({
    name,
    amount: categoryAnalytics[name] || 0
  }))
  const totalExpenses = categoryEntries.reduce((sum: number, item: {amount: number}) => sum + item.amount, 0)
  const categories = categoryEntries.map((item: {name: string, amount: number}, index: number) => {
    const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899']
    return {
      name: item.name,
      amount: item.amount,
      percent: totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0,
      color: colors[index % colors.length]
    }
  })

  // Calculate cash flow from income/expense
  const cashFlow = {
    opening: data.income - data.expense,
    in: data.income || 0,
    out: data.expense || 0,
    closing: data.balance || 0
  }

  // Transform accounts to component format
  const rawAccounts: AccountSummary[] = data.accounts || []
  const accounts = rawAccounts.map((acc: AccountSummary) => ({
    name: acc.name,
    balance: acc.balance,
    percent: 0
  }))

  // Calculate percentages
  const totalAccountBalance = accounts.reduce((sum: number, acc: {balance: number; percent: number}) => sum + acc.balance, 0)
  accounts.forEach((acc: {balance: number; percent: number}) => {
    acc.percent = totalAccountBalance > 0 ? (acc.balance / totalAccountBalance) * 100 : 0
  })

  // Transform recurring expenses
  const rawRecurring: RecurringExpenseItem[] = data.recurringExpenses || []
  const recurring = rawRecurring.map((r: RecurringExpenseItem) => ({
    name: r.name,
    amount: r.amount,
    due: r.dueDate
  }))

// Transform alerts - handle both string and object formats
  const rawAlerts: (AlertItem | string)[] = data.alerts || []
  // Convert to string[] only for compatibility
  const alerts: string[] = rawAlerts.map((alert: AlertItem | string) => {
    if (typeof alert === 'string') {
      return alert
    }
    return alert.message
  })

  // Transform budget summary
  const rawBudgetSummary: BudgetSummaryItem[] = data.budgetSummary || []
  const budgetSummary = rawBudgetSummary.map((b: BudgetSummaryItem) => ({
    category: b.category,
    budget: b.budget,
    actual: b.actual,
    difference: b.difference,
    status: b.status
  }))

  // Transform weekly data for chart
  const rawWeeklyData: WeeklyDataPoint[] = data.weeklyData || []
  const weeklyData = rawWeeklyData.map((w: WeeklyDataPoint) => ({
    month: w.week,
    income: w.income,
    expense: w.expense
  }))

  // Use savingsRate for goals display (simplified)
  const goals = data.savingsRate ? [
    { name: 'Monthly Savings', progress: Math.min(data.savingsRate, 100), target: 100 }
  ] : []

  return {
    netWorth: data.netWorth || 0,
    assets: data.assets || 0,
    liabilities: data.liabilities || 0,
    trend: data.trend || 0,
    income: data.income || 0,
    expense: data.expense || 0,
    savingsRate: data.savingsRate || 0,
    categories,
    cashFlow,
    goals,
    accounts,
    recurring,
    alerts,
    budgetSummary,
    weeklyData
  }
}

export default function FinanceSummaryPage() {
  const [dateRange, setDateRange] = useState('thisMonth')
  const [compare, setCompare] = useState(false)
  
  const { isAuthenticated } = useAuth()
  
  // Fetch real data from API - refetches every 5 seconds for real-time updates
  // dateRange prop filters data by period (thisMonth, lastMonth, last3Months, ytd, etc.)
  const { data: apiData, isLoading, error } = useDashboardOverviewQuery(isAuthenticated, dateRange)

  // Transform API data to component format
  const data = useMemo(() => transformData(apiData), [apiData])

  // Show loading skeleton while fetching
  if (isLoading && !apiData) {
    return (
      <div className="space-y-8 p-6 lg:p-8">
        <div className="h-12 w-48 bg-muted animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[420px] bg-muted animate-pulse rounded-3xl" />
          <div className="h-[420px] bg-muted animate-pulse rounded-3xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[420px] bg-muted animate-pulse rounded-3xl" />
          <div className="h-[420px] bg-muted animate-pulse rounded-3xl" />
        </div>
      </div>
    )
  }

  // Show error state if failed
  if (error) {
    return (
      <div className="space-y-8 p-6 lg:p-8">
        <div className="text-center py-12">
          <p className="text-destructive text-lg">Failed to load finance summary</p>
          <p className="text-muted-foreground text-sm mt-2">Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <HeaderControls 
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        compare={compare}
        onCompareToggle={() => setCompare(!compare)}
      />

      {/* Hero Net Worth */}
      <NetWorthCard 
        netWorth={data.netWorth}
        assets={data.assets}
        liabilities={data.liabilities}
        trend={data.trend}
      />

{/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncomeExpenseChart 
          income={data.income} 
          expense={data.expense}
          compare={compare}
          chartData={data.weeklyData}
        />
        <ExpenseBreakdown categories={data.categories} />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CashFlowCards cashFlow={data.cashFlow} />
        <SavingsGoals 
          savingsRate={data.savingsRate}
          goals={data.goals}
        />
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AccountDistribution accounts={data.accounts} />
        <RecurringExpenses recurring={data.recurring} />
      </div>

{/* Row 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertsPanel alerts={data.alerts} />
        <SummaryTable budgetSummary={data.budgetSummary} />
      </div>
    </div>
  )
}

