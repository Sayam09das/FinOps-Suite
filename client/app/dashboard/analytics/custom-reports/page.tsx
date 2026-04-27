"use client"

import { useState } from "react"

import {
  Header,
  Builder,
  SavedReports,
  Output,
} from "../../analytics/CustomReportsPage"
import {
  demoSavedReports,
  demoReportOutput,
} from "../../analytics/CustomReportsPage/demo-data"

export default function CustomReportsPage() {
  const [dateRange, setDateRange] = useState("thisMonth")
  const [category, setCategory] = useState("all")
  const [account, setAccount] = useState("all")
  const [groupBy, setGroupBy] = useState("day")
  const [showOutput, setShowOutput] = useState(true)

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* 1. Header */}
      <Header onCreateReport={() => setShowOutput(true)} />

      {/* 2. Report Builder */}
      <Builder
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        category={category}
        onCategoryChange={setCategory}
        account={account}
        onAccountChange={setAccount}
        groupBy={groupBy}
        onGroupByChange={setGroupBy}
        onRunReport={() => setShowOutput(true)}
      />

      {/* 3. Saved Reports */}
      <SavedReports
        reports={demoSavedReports}
        onRun={() => setShowOutput(true)}
        onEdit={() => {}}
        onDelete={() => {}}
      />

      {/* 4. Report Output */}
      {showOutput && (
        <Output rows={demoReportOutput} currency="INR" />
      )}
    </div>
  )
}

