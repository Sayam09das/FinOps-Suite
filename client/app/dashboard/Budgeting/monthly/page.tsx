"use client"

import { useState, useMemo } from "react"

import Header from "../../Budgeting/MonthlyBudgetsPage/Header"
import MonthSelector from "../../Budgeting/MonthlyBudgetsPage/MonthSelector"
import Summary from "../../Budgeting/MonthlyBudgetsPage/Summary"
import CategoryCards from "../../Budgeting/MonthlyBudgetsPage/CategoryCards"
import Insights from "../../Budgeting/MonthlyBudgetsPage/Insights"

import { demoBudgets } from "../demo-data"
import type { Budget } from "../types"

export default function MonthlyBudgetsPage() {
  const [selectedMonth, setSelectedMonth] = useState(0)

  const totalBudgeted = useMemo(
    () => demoBudgets.reduce((sum: number, b: Budget) => sum + b.budgetAmount, 0),
    []
  )
  const totalSpent = useMemo(
    () => demoBudgets.reduce((sum: number, b: Budget) => sum + b.spentAmount, 0),
    []
  )

  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      <Header />
      <MonthSelector selectedMonth={selectedMonth} onChange={setSelectedMonth} />
      <Summary totalBudgeted={totalBudgeted} totalSpent={totalSpent} currency="INR" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CategoryCards budgets={demoBudgets} />
        </div>
        <div>
          <Insights budgets={demoBudgets} />
        </div>
      </div>
    </div>
  )
}

