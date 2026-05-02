"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/app/lib/api/client"
import type { ReportRow, SavedReport } from "../CustomReportsPage/types"

import { Header, Builder, SavedReports, Output } from "../CustomReportsPage"

interface Transaction {
  id: string
  amount: number
  type: string
  category: string
  note: string | null
  date: string
  createdAt: string
}

function dateRangeToParams(range: string): { startDate: string; endDate: string } {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

  const start = new Date(now)
  switch (range) {
    case "lastMonth":
      start.setMonth(start.getMonth() - 1, 1)
      return { startDate: fmt(start), endDate: fmt(new Date(now.getFullYear(), now.getMonth(), 0)) }
    case "last3Months":
      start.setMonth(start.getMonth() - 3, 1)
      return { startDate: fmt(start), endDate: fmt(now) }
    case "last6Months":
      start.setMonth(start.getMonth() - 6, 1)
      return { startDate: fmt(start), endDate: fmt(now) }
    case "thisYear":
      return { startDate: `${now.getFullYear()}-01-01`, endDate: fmt(now) }
    default: // thisMonth
      return { startDate: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-01`, endDate: fmt(now) }
  }
}

export default function CustomReportsPage() {
  const [dateRange, setDateRange] = useState("thisMonth")
  const [category, setCategory] = useState("all")
  const [account, setAccount] = useState("all")
  const [groupBy, setGroupBy] = useState("day")
  const [runKey, setRunKey] = useState(0)
  const [savedReports, setSavedReports] = useState<SavedReport[]>([])

  const { startDate, endDate } = useMemo(() => dateRangeToParams(dateRange), [dateRange])

  const queryParams = useMemo(() => {
    const p = new URLSearchParams({ startDate, endDate, limit: "200" })
    if (category !== "all") p.set("category", category)
    return p.toString()
  }, [startDate, endDate, category])

  const { data: txData, isLoading, isError } = useQuery<Transaction[]>({
    queryKey: ["transactions", "report", queryParams, runKey],
    queryFn: () => api.get<Transaction[]>(`/api/transactions?${queryParams}`),
    staleTime: 0,
  })

  const rows = useMemo<ReportRow[]>(() => {
    if (!txData) return []
    const list = Array.isArray(txData) ? txData : (txData as any)?.data ?? []
    return list.map((t: Transaction) => ({
      date: (t.date ?? t.createdAt ?? "").slice(0, 10),
      category: t.category,
      account: "—",
      amount: t.amount,
      type: t.type as "income" | "expense",
    }))
  }, [txData])

  function handleRunReport() {
    setRunKey((k) => k + 1)
  }

  function handleDeleteSaved(id: string) {
    setSavedReports((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <Header onCreateReport={handleRunReport} />

      <Builder
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        category={category}
        onCategoryChange={setCategory}
        account={account}
        onAccountChange={setAccount}
        groupBy={groupBy}
        onGroupByChange={setGroupBy}
        onRunReport={handleRunReport}
      />

      <SavedReports
        reports={savedReports}
        onRun={(id) => {
          const r = savedReports.find((s) => s.id === id)
          if (r) { setDateRange(r.dateRange); setCategory(r.category); setGroupBy(r.groupBy); handleRunReport() }
        }}
        onEdit={() => {}}
        onDelete={handleDeleteSaved}
      />

      {isLoading && (
        <div className="flex items-center justify-center py-20 text-sm text-foreground/50">
          Running report…
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 text-sm text-rose-600">
          Failed to load report data. Please try again.
        </div>
      )}

      {!isLoading && !isError && rows.length > 0 && (
        <Output rows={rows} currency="INR" />
      )}

      {!isLoading && !isError && rows.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border/60 bg-background/40 p-10 text-center text-sm text-foreground/50">
          No transactions found for the selected filters.
        </div>
      )}
    </div>
  )
}
