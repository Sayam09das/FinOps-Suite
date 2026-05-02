"use client"

import { useMemo, useState } from "react"
import { useAnalytics } from "@/app/features/dashboard/hooks/use-analytics"
import type { IncomeExpenseSeries, InsightItem } from "./IncomeVsExpensePage/types"

import {
  Header,
  Filters,
  Summary,
  ComparisonChart,
  SavingsRate,
  Insights,
} from "./IncomeVsExpensePage"

// Month abbreviation from "YYYY-MM"
function monthLabel(ym: string) {
  const [year, month] = ym.split("-")
  return new Date(Number(year), Number(month) - 1).toLocaleString("en-IN", { month: "short" })
}

export default function IncomeVsExpensePage() {
  const [dateRange, setDateRange] = useState("thisMonth")
  const { data, isLoading, isError } = useAnalytics()

  // Build IncomeExpenseSeries from trends (monthly) + overview (current)
  const series = useMemo<IncomeExpenseSeries>(() => {
    const monthly = (data?.trends ?? []).map((t) => ({
      label: monthLabel(t.month),
      income: t.income,
      expense: t.expense,
    }))

    // Weekly: not available from backend — use current month overview as single point
    const weekly = data?.overview
      ? [{ label: "This Month", income: data.overview.income, expense: data.overview.expense }]
      : []

    // Yearly: group trends by year
    const byYear: Record<string, { income: number; expense: number }> = {}
    ;(data?.trends ?? []).forEach((t) => {
      const yr = t.month.slice(0, 4)
      if (!byYear[yr]) byYear[yr] = { income: 0, expense: 0 }
      byYear[yr].income += t.income
      byYear[yr].expense += t.expense
    })
    const yearly = Object.entries(byYear).map(([yr, v]) => ({
      label: yr,
      income: v.income,
      expense: v.expense,
    }))

    return { weekly, monthly, yearly }
  }, [data])

  // Summary: current vs previous month from trends
  const summaryStats = useMemo(() => {
    const trends = data?.trends ?? []
    const current = data?.overview ?? { income: 0, expense: 0, balance: 0 }
    const prev = trends.length >= 2 ? trends[trends.length - 2] : { income: 0, expense: 0 }
    return {
      totalIncome: current.income,
      totalExpense: current.expense,
      netSavings: current.balance,
      previousIncome: prev.income,
      previousExpense: prev.expense,
      previousSavings: prev.income - prev.expense,
    }
  }, [data])

  // Savings rate: current and previous month
  const savingsRate = useMemo(() => {
    const { totalIncome, totalExpense, previousIncome, previousExpense } = summaryStats
    const current = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0
    const previous =
      previousIncome > 0 ? ((previousIncome - previousExpense) / previousIncome) * 100 : 0
    return { current, previous, target: 30 }
  }, [summaryStats])

  // Derive insights from real data
  const insights = useMemo<InsightItem[]>(() => {
    if (!data) return []
    const items: InsightItem[] = []
    const { totalIncome, totalExpense, previousIncome, previousExpense } = summaryStats

    const expenseChange =
      previousExpense > 0 ? ((totalExpense - previousExpense) / previousExpense) * 100 : 0
    const incomeChange =
      previousIncome > 0 ? ((totalIncome - previousIncome) / previousIncome) * 100 : 0

    if (expenseChange > 5)
      items.push({
        id: "exp-up",
        message: `Expenses increased by ${expenseChange.toFixed(1)}% vs last month`,
        type: "warning",
        icon: "TrendingUp",
      })
    else if (expenseChange < -5)
      items.push({
        id: "exp-down",
        message: `Expenses dropped by ${Math.abs(expenseChange).toFixed(1)}% — great control!`,
        type: "success",
        icon: "TrendingDown",
      })

    if (incomeChange > 0)
      items.push({
        id: "inc-up",
        message: `Income is up ${incomeChange.toFixed(1)}% — great job!`,
        type: "success",
        icon: "TrendingUp",
      })
    else if (incomeChange < 0)
      items.push({
        id: "inc-down",
        message: `Income dropped by ${Math.abs(incomeChange).toFixed(1)}% this month`,
        type: "danger",
        icon: "TrendingDown",
      })

    const gap = savingsRate.target - savingsRate.current
    if (gap > 0)
      items.push({
        id: "savings-gap",
        message: `You're ${gap.toFixed(1)}% away from your ${savingsRate.target}% savings target`,
        type: "info",
        icon: "Target",
      })
    else
      items.push({
        id: "savings-hit",
        message: `Savings target of ${savingsRate.target}% reached — excellent!`,
        type: "success",
        icon: "Target",
      })

    if (data.forecast.trend === "DOWN")
      items.push({
        id: "forecast",
        message: "Forecast shows expenses may exceed income next month",
        type: "danger",
        icon: "AlertTriangle",
      })

    return items
  }, [data, summaryStats, savingsRate])

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <Header />
      <Filters dateRange={dateRange} onDateRangeChange={setDateRange} />

      {isLoading && (
        <div className="flex items-center justify-center py-20 text-sm text-foreground/50">
          Loading analytics…
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 text-sm text-rose-600">
          Failed to load analytics data. Please try again.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <Summary
            totalIncome={summaryStats.totalIncome}
            totalExpense={summaryStats.totalExpense}
            netSavings={summaryStats.netSavings}
            previousIncome={summaryStats.previousIncome}
            previousExpense={summaryStats.previousExpense}
            previousSavings={summaryStats.previousSavings}
            currency="INR"
          />

          <ComparisonChart series={series} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SavingsRate
              current={savingsRate.current}
              previous={savingsRate.previous}
              target={savingsRate.target}
            />
            <Insights insights={insights} />
          </div>
        </>
      )}
    </div>
  )
}
