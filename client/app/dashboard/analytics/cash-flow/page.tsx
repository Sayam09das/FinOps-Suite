"use client"

import { useState } from "react"

import {
  Header,
  Filters,
  Summary,
  FlowChart,
  Breakdown,
  Timeline,
} from "../../analytics/CashFlowPage"
import {
  demoCashFlowSummary,
  demoBalanceSeries,
  demoIncomeSources,
  demoExpenseCategories,
} from "../../analytics/CashFlowPage/demo-data"

export default function CashFlowPage() {
  const [dateRange, setDateRange] = useState("thisMonth")

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* 1. Header */}
      <Header />

      {/* 2. Filters */}
      <Filters dateRange={dateRange} onDateRangeChange={setDateRange} />

      {/* 3. Cash Flow Summary */}
      <Summary data={demoCashFlowSummary} />

      {/* 4. Flow Chart */}
      <FlowChart
        income={demoCashFlowSummary.moneyIn}
        expenses={demoCashFlowSummary.moneyOut}
        remaining={demoCashFlowSummary.closingBalance - demoCashFlowSummary.openingBalance}
        currency={demoCashFlowSummary.currency}
      />

      {/* 5. Breakdown */}
      <Breakdown
        incomeSources={demoIncomeSources}
        expenseCategories={demoExpenseCategories}
        currency={demoCashFlowSummary.currency}
      />

      {/* 6. Balance Timeline */}
      <Timeline series={demoBalanceSeries} currency={demoCashFlowSummary.currency} />
    </div>
  )
}

