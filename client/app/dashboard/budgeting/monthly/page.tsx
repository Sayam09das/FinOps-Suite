"use client"

import { useMemo, useState } from "react"
import { useBudgetStatus } from "@/app/features/budgets/hooks/use-budgets"
import type { Budget } from "../types"

import Header from "../MonthlyBudgetsPage/Header"
import MonthSelector from "../MonthlyBudgetsPage/MonthSelector"
import Summary from "../MonthlyBudgetsPage/Summary"
import CategoryCards from "../MonthlyBudgetsPage/CategoryCards"
import Insights from "../MonthlyBudgetsPage/Insights"

const CURRENT_YEAR = new Date().getFullYear()
const CURRENT_MONTH = new Date().getMonth() // 0-indexed

function toMonthParam(monthIndex: number): string {
  return `${CURRENT_YEAR}-${String(monthIndex + 1).padStart(2, "0")}`
}

export default function MonthlyBudgetsPage() {
  const [selectedMonth, setSelectedMonth] = useState(CURRENT_MONTH)
  const monthParam = toMonthParam(selectedMonth)

  const { data: budgetStatus, isLoading, isError } = useBudgetStatus(monthParam)

  const budgets: Budget[] = useMemo(() => {
    if (!budgetStatus) return []
    return Object.entries(budgetStatus).map(([category, data]) => ({
      id: category,
      category,
      budgetAmount: data.budget,
      spentAmount: data.spent,
      startMonth: monthParam,
      recurrence: "monthly" as const,
      currency: "INR",
      status: "active" as const,
    }))
  }, [budgetStatus, monthParam])

  const totalBudgeted = useMemo(() => budgets.reduce((s, b) => s + b.budgetAmount, 0), [budgets])
  const totalSpent = useMemo(() => budgets.reduce((s, b) => s + b.spentAmount, 0), [budgets])

  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      <Header />
      <MonthSelector selectedMonth={selectedMonth} onChange={setSelectedMonth} />

      {isLoading && (
        <div className="flex items-center justify-center py-20 text-sm text-foreground/50">
          Loading budgets…
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 text-sm text-rose-600">
          Failed to load budget data. Please try again.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <Summary totalBudgeted={totalBudgeted} totalSpent={totalSpent} currency="INR" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <CategoryCards budgets={budgets} />
            </div>
            <div>
              <Insights budgets={budgets} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
