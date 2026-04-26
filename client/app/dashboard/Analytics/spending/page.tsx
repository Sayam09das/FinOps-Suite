"use client"

import { useState } from "react"

import {
  Header,
  Filters,
  Summary,
  CategoryChart,
  TopList,
  Trend,
} from "../../analytics/SpendingAnalysisPage"
import {
  demoCategories,
  demoTrendSeries,
  demoTotalSpend,
} from "../../analytics/SpendingAnalysisPage/demo-data"

export default function SpendingAnalysisPage() {
  const [dateRange, setDateRange] = useState("thisMonth")
  const [category, setCategory] = useState("all")
  const [account, setAccount] = useState("all")

  // Filter categories based on selection
  const filteredCategories =
    category === "all"
      ? demoCategories
      : demoCategories.filter((c) => c.name === category)

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* 1. Header */}
      <Header />

      {/* 2. Filters Bar */}
      <Filters
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        category={category}
        onCategoryChange={setCategory}
        account={account}
        onAccountChange={setAccount}
      />

      {/* 3. Total Spend Summary */}
      <Summary
        total={demoTotalSpend.current}
        previousTotal={demoTotalSpend.previous}
        changePercent={demoTotalSpend.changePercent}
        currency={demoTotalSpend.currency}
      />

      {/* 4 & 5. Category Breakdown + Top Categories */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoryChart categories={filteredCategories} />
        <TopList categories={filteredCategories} />
      </div>

      {/* 6. Trend Over Time */}
      <Trend series={demoTrendSeries} />
    </div>
  )
}



