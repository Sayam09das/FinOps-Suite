"use client"

import { useMemo } from "react"

import Header from "../BudgetVsActualPage/Header"
import Summary from "../BudgetVsActualPage/Summary"
import Table from "../BudgetVsActualPage/Table"
import Chart from "../BudgetVsActualPage/Chart"
import Alerts from "../BudgetVsActualPage/Alerts"

import { demoBudgets } from "../demo-data"
import type { Budget } from "../types"

export default function BudgetVsActualPage() {
  const totalBudget = useMemo(
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
      <Summary totalBudget={totalBudget} totalSpent={totalSpent} currency="INR" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Table budgets={demoBudgets} />
          <Chart budgets={demoBudgets} />
        </div>
        <div>
          <Alerts budgets={demoBudgets} />
        </div>
      </div>
    </div>
  )
}

