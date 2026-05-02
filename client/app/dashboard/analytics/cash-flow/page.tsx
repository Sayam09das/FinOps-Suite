"use client"

import { useMemo, useState } from "react"
import { useAnalytics } from "@/app/features/dashboard/hooks/use-analytics"
import type { CashFlowSummaryData, BalanceSeries, BreakdownItem } from "../CashFlowPage/types"

import { Header, Filters, Summary, FlowChart, Breakdown, Timeline } from "../CashFlowPage"

// Palette for expense categories
const COLORS = ["#EF4444", "#F59E0B", "#3B82F6", "#8B5CF6", "#EC4899", "#06B6D4", "#10B981", "#F97316"]

function monthLabel(ym: string) {
  const [y, m] = ym.split("-")
  return new Date(Number(y), Number(m) - 1).toLocaleString("en-IN", { month: "short" })
}

export default function CashFlowPage() {
  const [dateRange, setDateRange] = useState("thisMonth")
  const { data, isLoading, isError } = useAnalytics()

  const summaryData = useMemo<CashFlowSummaryData>(() => {
    const trends = data?.trends ?? []
    const cur = data?.overview ?? { income: 0, expense: 0, balance: 0 }
    const prev = trends.length >= 2 ? trends[trends.length - 2] : { income: 0, expense: 0, balance: 0 }
    // Opening = previous closing balance (prev balance cumulative)
    const prevClosing = prev.income - prev.expense
    const curClosing = prevClosing + cur.balance
    return {
      openingBalance: prevClosing,
      moneyIn: cur.income,
      moneyOut: cur.expense,
      closingBalance: curClosing,
      previousOpeningBalance: trends.length >= 3 ? (trends[trends.length - 3].income - trends[trends.length - 3].expense) : 0,
      previousMoneyIn: prev.income,
      previousMoneyOut: prev.expense,
      previousClosingBalance: prevClosing,
      currency: "INR",
    }
  }, [data])

  const balanceSeries = useMemo<BalanceSeries>(() => {
    const trends = data?.trends ?? []
    const monthly = trends.map((t) => ({
      label: monthLabel(t.month),
      balance: t.income - t.expense,
    }))
    // weekly/daily: not available from backend — derive from monthly as fallback
    return { daily: monthly, weekly: monthly, monthly }
  }, [data])

  const expenseCategories = useMemo<BreakdownItem[]>(() => {
    const cats = data?.overview?.categories ?? {}
    const total = Object.values(cats).reduce((s, v) => s + v.spent, 0)
    return Object.entries(cats)
      .sort(([, a], [, b]) => b.spent - a.spent)
      .map(([name, v], i) => ({
        name,
        amount: v.spent,
        percentage: total > 0 ? (v.spent / total) * 100 : 0,
        color: COLORS[i % COLORS.length],
      }))
  }, [data])

  // Income sources: only overview total available — show as single "Income" item
  const incomeSources = useMemo<BreakdownItem[]>(() => {
    if (!data?.overview?.income) return []
    return [{ name: "Total Income", amount: data.overview.income, percentage: 100, color: "#10B981" }]
  }, [data])

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <Header />
      <Filters dateRange={dateRange} onDateRangeChange={setDateRange} />

      {isLoading && (
        <div className="flex items-center justify-center py-20 text-sm text-foreground/50">
          Loading cash flow data…
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 text-sm text-rose-600">
          Failed to load cash flow data. Please try again.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <Summary data={summaryData} />
          <FlowChart
            income={summaryData.moneyIn}
            expenses={summaryData.moneyOut}
            remaining={summaryData.closingBalance - summaryData.openingBalance}
            currency={summaryData.currency}
          />
          <Breakdown
            incomeSources={incomeSources}
            expenseCategories={expenseCategories}
            currency={summaryData.currency}
          />
          <Timeline series={balanceSeries} currency={summaryData.currency} />
        </>
      )}
    </div>
  )
}
