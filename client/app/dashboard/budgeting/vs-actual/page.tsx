"use client"

import { useMemo } from "react"
import { useBudgetStatus } from "@/app/features/budgets/hooks/use-budgets"
import type { Budget } from "../types"

import Header from "../BudgetVsActualPage/Header"
import Summary from "../BudgetVsActualPage/Summary"
import Table from "../BudgetVsActualPage/Table"
import Chart from "../BudgetVsActualPage/Chart"
import Alerts from "../BudgetVsActualPage/Alerts"

const now = new Date()
const MONTH_PARAM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
const PERIOD_LABEL = now.toLocaleString("en-IN", { month: "long", year: "numeric" })

export default function BudgetVsActualPage() {
  const { data: budgetStatus, isLoading, isError } = useBudgetStatus(MONTH_PARAM)

  const budgets: Budget[] = useMemo(() => {
    if (!budgetStatus) return []
    return Object.entries(budgetStatus).map(([category, data]) => ({
      id: category,
      category,
      budgetAmount: data.budget,
      spentAmount: data.spent,
      startMonth: MONTH_PARAM,
      recurrence: "monthly" as const,
      currency: "INR",
      status: "active" as const,
    }))
  }, [budgetStatus])

  const totalBudget = useMemo(() => budgets.reduce((s, b) => s + b.budgetAmount, 0), [budgets])
  const totalSpent = useMemo(() => budgets.reduce((s, b) => s + b.spentAmount, 0), [budgets])

  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      <Header period={PERIOD_LABEL} />

      {isLoading && (
        <div className="flex items-center justify-center py-20 text-sm text-foreground/50">
          Loading budget data…
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 text-sm text-rose-600">
          Failed to load budget data. Please try again.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <Summary totalBudget={totalBudget} totalSpent={totalSpent} currency="INR" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Table budgets={budgets} />
              <Chart budgets={budgets} />
            </div>
            <div>
              <Alerts budgets={budgets} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
