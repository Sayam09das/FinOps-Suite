"use client"

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarDays, Sparkles } from 'lucide-react'

import { Badge } from '@/app/components/ui/badge'
import { useAuth } from '@/app/features/auth'
import { useDashboard } from '@/app/features/dashboard'

import AccountsList from './Overview/Dashboard/AccountsList'
import AlertsPanel from './Overview/Dashboard/AlertsPanel'
import BudgetStatus from './Overview/Dashboard/BudgetStatus'
import CashFlowChart from './Overview/Dashboard/CashFlowChart'
import CategoryPieChart from './Overview/Dashboard/CategoryPieChart'
import GoalsProgress from './Overview/Dashboard/GoalsProgress'
import InsightsPanel from './Overview/Dashboard/InsightsPanel'
import OverviewSkeleton from './Overview/Dashboard/OverviewSkeleton'
import FinanceSummaryPage from './Overview/FinanceSummaryPage'
import RecentTransactions from './Overview/Dashboard/RecentTransactions'
import SummaryCards from './Overview/Dashboard/SummaryCards'
import { buildOverviewViewModel } from './Overview/view-model'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs'

export default function DashboardHome() {
  const { user, isAuthenticated, isInitializing: authLoading } = useAuth()
  const { overview, transactions, budgetStatus, isLoading: dashboardLoading } = useDashboard()
  const router = useRouter()
  const redirectedRef = useRef(false)

  useEffect(() => {
    console.log('[DASHBOARD] Auth state:', {
      authLoading,
      isAuthenticated,
      user: user ? 'present' : 'null',
      redirectedRef: redirectedRef.current
    })

    if (!authLoading && !isAuthenticated && !redirectedRef.current) {
      console.log('[DASHBOARD] No auth session → login')
      redirectedRef.current = true
      router.replace('/login')
    } else if (!authLoading && isAuthenticated) {
      console.log('[DASHBOARD] Auth OK - dashboard ready')
    }
  }, [authLoading, isAuthenticated, router, user])

  const viewModel = useMemo(
    () => buildOverviewViewModel({ overview, transactions, budgetStatus }),
    [budgetStatus, overview, transactions],
  )

  if (authLoading || dashboardLoading) {
    return <OverviewSkeleton />
  }

  if (!isAuthenticated) {
    return null
  }

  const [activeTab, setActiveTab] = useState('overview')
  const firstName = user?.name?.split(' ')[0] || 'Operator'

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.6),rgba(255,255,255,0.24))] backdrop-blur-xl">
        <div className="px-4 py-6 md:px-6 xl:px-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <Badge variant="accent" className="bg-accent/18 text-accent-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                Dashboard
              </Badge>
              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground md:text-4xl">
                Welcome back, {firstName}. Your finance system is live.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/64 md:text-base">
                This overview is built as a decision surface: quick KPIs up top, cash-flow trends in the hero area,
                then recent activity, category pressure, goal pacing, account health, budget control, and live alerts.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="subtle">React charts active</Badge>
                <Badge variant="outline">Smart insight feedback loop</Badge>
                <Badge variant="subtle">Responsive overview grid</Badge>
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-border/75 bg-background/72 p-4 shadow-[0_18px_42px_rgba(33,49,43,0.06)]">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <CalendarDays className="h-4 w-4 text-foreground/64" />
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <p className="mt-2 text-sm text-foreground/58">
                Focus areas today: cash flow confidence, budget runway, and unusual transaction review.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-4 md:p-6 xl:p-8">
        <SummaryCards items={viewModel.summaryMetrics} />

        <div className="grid gap-6 xl:grid-cols-[1.65fr_0.95fr]">
          <CashFlowChart seriesByRange={viewModel.cashFlowSeries} />
          <InsightsPanel items={viewModel.insights} />
        </div>

        <RecentTransactions items={viewModel.transactions} />

        <div className="grid gap-6 xl:grid-cols-2">
          <CategoryPieChart items={viewModel.categoryBreakdown} />
          <GoalsProgress items={viewModel.goals} />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <AccountsList items={viewModel.accounts} />
          <BudgetStatus items={viewModel.budgetHealth} />
        </div>

        <AlertsPanel items={viewModel.alerts} />
      </div>
    </div>
  )
}
