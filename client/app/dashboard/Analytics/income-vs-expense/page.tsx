"use client"

import { useState } from "react"

import {
  Header,
  Filters,
  Summary,
  ComparisonChart,
  SavingsRate,
  Insights,
} from "../../Analytics/IncomeVsExpensePage"
import {
  demoIncomeExpenseSeries,
  demoSummary,
  demoSavingsRate,
  demoInsights,
} from "../../Analytics/IncomeVsExpensePage/demo-data"

export default function IncomeVsExpensePage() {
  const [dateRange, setDateRange] = useState("thisMonth")

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* 1. Header */}
      <Header />

      {/* 2. Filters */}
      <Filters dateRange={dateRange} onDateRangeChange={setDateRange} />

      {/* 3. Summary Cards */}
      <Summary
        totalIncome={demoSummary.totalIncome}
        totalExpense={demoSummary.totalExpense}
        netSavings={demoSummary.netSavings}
        previousIncome={demoSummary.previousIncome}
        previousExpense={demoSummary.previousExpense}
        previousSavings={demoSummary.previousSavings}
        currency={demoSummary.currency}
      />

      {/* 4. Comparison Chart */}
      <ComparisonChart series={demoIncomeExpenseSeries} />

      {/* 5. Savings Rate + 6. Insights */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SavingsRate
          current={demoSavingsRate.current}
          previous={demoSavingsRate.previous}
          target={demoSavingsRate.target}
        />
        <Insights insights={demoInsights} />
      </div>
    </div>
  )
}

