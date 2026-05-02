"use client"

import { useMemo, useState } from "react"
import { useAnalytics } from "@/app/features/dashboard/hooks/use-analytics"
import type { CategorySpend, TrendSeries } from "../SpendingAnalysisPage/types"

import { Header, Filters, Summary, CategoryChart, TopList, Trend } from "../SpendingAnalysisPage"

const COLORS = ["#EF4444", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#F97316"]
const ICONS: Record<string, string> = {
  Food: "UtensilsCrossed", Travel: "Plane", Shopping: "ShoppingBag",
  Entertainment: "Film", Utilities: "Zap", Healthcare: "HeartPulse",
  Education: "GraduationCap",
}

function monthLabel(ym: string) {
  const [y, m] = ym.split("-")
  return new Date(Number(y), Number(m) - 1).toLocaleString("en-IN", { month: "short" })
}

export default function SpendingAnalysisPage() {
  const [dateRange, setDateRange] = useState("thisMonth")
  const [category, setCategory] = useState("all")
  const [account, setAccount] = useState("all")
  const { data, isLoading, isError } = useAnalytics()

  const allCategories = useMemo<CategorySpend[]>(() => {
    const cats = data?.overview?.categories ?? {}
    const total = Object.values(cats).reduce((s, v) => s + v.spent, 0)
    return Object.entries(cats)
      .sort(([, a], [, b]) => b.spent - a.spent)
      .map(([name, v], i) => ({
        name,
        amount: v.spent,
        percentage: total > 0 ? (v.spent / total) * 100 : 0,
        color: COLORS[i % COLORS.length],
        icon: ICONS[name] ?? "ShoppingBag",
      }))
  }, [data])

  const filteredCategories = useMemo(
    () => category === "all" ? allCategories : allCategories.filter((c) => c.name === category),
    [allCategories, category]
  )

  const trendSeries = useMemo<TrendSeries>(() => {
    const monthly = (data?.trends ?? []).map((t) => ({
      label: monthLabel(t.month),
      amount: t.expense,
    }))
    return { daily: monthly, weekly: monthly, monthly }
  }, [data])

  const trends = data?.trends ?? []
  const curExpense = data?.overview?.expense ?? 0
  const prevExpense = trends.length >= 2 ? trends[trends.length - 2].expense : 0
  const changePercent = prevExpense > 0 ? ((curExpense - prevExpense) / prevExpense) * 100 : 0

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <Header />
      <Filters
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        category={category}
        onCategoryChange={setCategory}
        account={account}
        onAccountChange={setAccount}
      />

      {isLoading && (
        <div className="flex items-center justify-center py-20 text-sm text-foreground/50">
          Loading spending data…
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 text-sm text-rose-600">
          Failed to load spending data. Please try again.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <Summary
            total={curExpense}
            previousTotal={prevExpense}
            changePercent={changePercent}
            currency="INR"
          />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <CategoryChart categories={filteredCategories} />
            <TopList categories={filteredCategories} />
          </div>
          <Trend series={trendSeries} />
        </>
      )}
    </div>
  )
}
