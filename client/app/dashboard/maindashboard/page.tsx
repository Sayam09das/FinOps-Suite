"use client"

import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/features/auth'
import { useDashboard } from '@/app/features/dashboard'
import { OverviewCard } from '@/app/features/dashboard/components/OverviewCard'
import { RecentTransactions } from '@/app/features/dashboard/components/RecentTransactions'
import { BudgetOverview } from '@/app/features/dashboard/components/BudgetOverview'
import { QuickActions } from '@/app/features/dashboard/components/QuickActions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { DollarSign, CreditCard, Target, TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { cn } from '@/app/lib/utils/cn'

export default function Page() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { stats, budgets, transactions, isLoading: dashboardLoading } = useDashboard()
  const router = useRouter()
  const redirectedRef = useRef(false)

  useEffect(() => {
    // Prevent multiple redirects
    if (!authLoading && !isAuthenticated && !redirectedRef.current) {
      redirectedRef.current = true
      router.replace('/login')
    }
  }, [authLoading, isAuthenticated, router])

  if (authLoading || dashboardLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  // Mock data for demonstration (replace with real data from stats)
  const mockStats = {
    totalSpend: 12450.75,
    monthlyChange: 8.2,
    transactionCount: 47,
    transactionChange: 12.5,
    activeBudgets: 5,
    budgetChange: -2.1,
    savingsRate: 23.4,
    savingsChange: 5.7,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                Here's what's happening with your finances today.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <OverviewCard
            title="Total Spend"
            value={mockStats.totalSpend}
            change={`+${mockStats.monthlyChange}% from last month`}
            icon={<DollarSign className="h-4 w-4" />}
            isPositive={false}
            description="This month"
          />
          <OverviewCard
            title="Transactions"
            value={mockStats.transactionCount}
            change={`+${mockStats.transactionChange}% from last month`}
            icon={<CreditCard className="h-4 w-4" />}
            isPositive={true}
            description="This month"
          />
          <OverviewCard
            title="Active Budgets"
            value={mockStats.activeBudgets}
            change={`${mockStats.budgetChange}% from last month`}
            icon={<Target className="h-4 w-4" />}
            isPositive={mockStats.budgetChange >= 0}
            description="Under management"
          />
          <OverviewCard
            title="Savings Rate"
            value={`${mockStats.savingsRate}%`}
            change={`+${mockStats.savingsChange}% from last month`}
            icon={<TrendingUp className="h-4 w-4" />}
            isPositive={true}
            description="Of total income"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Transactions */}
          <RecentTransactions
            transactions={[
              {
                id: '1',
                amount: -85.50,
                description: 'Grocery Shopping',
                category: 'Food & Dining',
                date: '2024-01-15',
                type: 'expense'
              },
              {
                id: '2',
                amount: 3500.00,
                description: 'Salary Deposit',
                category: 'Income',
                date: '2024-01-14',
                type: 'income'
              },
              {
                id: '3',
                amount: -45.00,
                description: 'Gas Station',
                category: 'Transportation',
                date: '2024-01-13',
                type: 'expense'
              },
              {
                id: '4',
                amount: -120.00,
                description: 'Electric Bill',
                category: 'Utilities',
                date: '2024-01-12',
                type: 'expense'
              },
              {
                id: '5',
                amount: -25.99,
                description: 'Netflix Subscription',
                category: 'Entertainment',
                date: '2024-01-11',
                type: 'expense'
              }
            ]}
          />

          {/* Budget Overview */}
          <BudgetOverview
            budgets={[
              {
                id: '1',
                name: 'Groceries',
                category: 'Food & Dining',
                allocated: 600,
                spent: 485,
                period: 'monthly'
              },
              {
                id: '2',
                name: 'Entertainment',
                category: 'Entertainment',
                allocated: 200,
                spent: 165,
                period: 'monthly'
              },
              {
                id: '3',
                name: 'Transportation',
                category: 'Transportation',
                allocated: 300,
                spent: 245,
                period: 'monthly'
              },
              {
                id: '4',
                name: 'Utilities',
                category: 'Utilities',
                allocated: 250,
                spent: 180,
                period: 'monthly'
              }
            ]}
          />
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Financial Health Summary */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Financial Health Score
              </CardTitle>
              <CardDescription>
                Based on your spending patterns and budget adherence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-emerald-600">78/100</span>
                  <span className="text-sm text-muted-foreground">Good</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Budget Adherence</span>
                    <span>85%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Savings Rate</span>
                    <span>23%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Expense Tracking</span>
                    <span>92%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Monthly Trends
              </CardTitle>
              <CardDescription>
                Compare this month with previous months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-emerald-600">+8.2%</p>
                    <p className="text-xs text-muted-foreground">Income</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-rose-600">+12.5%</p>
                    <p className="text-xs text-muted-foreground">Expenses</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">+5.7%</p>
                    <p className="text-xs text-muted-foreground">Savings</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Your finances are trending in the right direction! 🎉
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
