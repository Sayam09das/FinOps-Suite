"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Table,
  BarChart3,
  FileSpreadsheet,
  FileText,
  Download,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { formatCurrency } from "@/app/lib/utils/number"
import { cn } from "@/app/lib/utils/cn"
import type { ReportRow } from "./demo-data"

type ViewMode = "table" | "chart"

interface OutputProps {
  rows: ReportRow[]
  currency?: string
}

export default function Output({ rows, currency = "INR" }: OutputProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("table")

  const incomeRows = rows.filter((r) => r.type === "income")
  const expenseRows = rows.filter((r) => r.type === "expense")
  const totalIncome = incomeRows.reduce((sum, r) => sum + r.amount, 0)
  const totalExpense = expenseRows.reduce((sum, r) => sum + r.amount, 0)

  const chartData = rows.reduce<
    { name: string; income: number; expense: number }[]
  >((acc, row) => {
    const existing = acc.find((item) => item.name === row.category)
    if (existing) {
      if (row.type === "income") existing.income += row.amount
      else existing.expense += row.amount
    } else {
      acc.push({
        name: row.category,
        income: row.type === "income" ? row.amount : 0,
        expense: row.type === "expense" ? row.amount : 0,
      })
    }
    return acc
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
    >
      <Card
        variant="surface"
        className="rounded-[1.95rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-0 backdrop-blur-xl"
      >
        <CardHeader className="flex flex-col gap-4 border-b border-border/70 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl">Report Output</CardTitle>
            <CardDescription>View results in table or chart format.</CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View toggle */}
            <div className="flex rounded-xl border border-border/80 bg-background/60 p-1">
              {(["table", "chart"] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all",
                    viewMode === mode
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground/60 hover:text-foreground"
                  )}
                >
                  {mode === "table" ? <Table className="h-3.5 w-3.5" /> : <BarChart3 className="h-3.5 w-3.5" />}
                  {mode}
                </button>
              ))}
            </div>

            {/* Export buttons */}
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background/75 px-3 py-1.5 text-xs font-semibold text-foreground/80 transition-all hover:bg-white/90">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              CSV
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background/75 px-3 py-1.5 text-xs font-semibold text-foreground/80 transition-all hover:bg-white/90">
              <FileText className="h-3.5 w-3.5" />
              PDF
            </button>
          </div>
        </CardHeader>

        {/* Summary mini bar */}
        <div className="flex flex-wrap items-center gap-6 border-b border-border/60 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/15">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-foreground/50">Total Income</p>
              <p className="text-sm font-bold text-foreground">{formatCurrency(totalIncome, currency)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/15">
              <TrendingDown className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-foreground/50">Total Expense</p>
              <p className="text-sm font-bold text-foreground">{formatCurrency(totalExpense, currency)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
              <Download className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-foreground/50">Net</p>
              <p className="text-sm font-bold text-foreground">
                {formatCurrency(totalIncome - totalExpense, currency)}
              </p>
            </div>
          </div>
        </div>

        <CardContent className="px-0 py-0">
          <AnimatePresence mode="wait">
            {viewMode === "table" ? (
              <motion.div
                key="table"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="overflow-x-auto"
              >
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border/60 bg-background/40">
                      <th className="px-5 py-3 font-semibold text-foreground/70">Date</th>
                      <th className="px-5 py-3 font-semibold text-foreground/70">Category</th>
                      <th className="px-5 py-3 font-semibold text-foreground/70">Account</th>
                      <th className="px-5 py-3 font-semibold text-foreground/70">Type</th>
                      <th className="px-5 py-3 text-right font-semibold text-foreground/70">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-b border-border/40 transition-colors hover:bg-background/60"
                      >
                        <td className="px-5 py-3 text-foreground/80">{row.date}</td>
                        <td className="px-5 py-3 font-medium text-foreground">{row.category}</td>
                        <td className="px-5 py-3 text-foreground/80">{row.account}</td>
                        <td className="px-5 py-3">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                              row.type === "income"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            )}
                          >
                            {row.type}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right font-bold text-foreground">
                          {formatCurrency(row.amount, currency)}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            ) : (
              <motion.div
                key="chart"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="h-[400px] px-3 pb-5 pt-5 sm:px-5"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 12, right: 8, left: -10, bottom: 0 }}
                    barGap={6}
                  >
                    <CartesianGrid
                      stroke="rgba(91,107,100,0.12)"
                      strokeDasharray="4 4"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fill: "rgba(33,49,43,0.55)",
                        fontSize: 12,
                      }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fill: "rgba(33,49,43,0.55)",
                        fontSize: 12,
                      }}
                      tickFormatter={(value) => `₹${Math.round(value / 1000)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "1rem",
                        border: "1px solid rgba(211,221,210,0.9)",
                        background: "rgba(255,255,255,0.92)",
                        boxShadow: "0 20px 60px rgba(33,49,43,0.12)",
                      }}
                      formatter={(value) => [
                        formatCurrency(Number(value ?? 0), currency),
                        "",
                      ]}
                      labelStyle={{
                        color: "rgba(33,49,43,0.62)",
                        fontWeight: 600,
                      }}
                    />
                    <Bar dataKey="income" name="Income" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={48}>
                      {chartData.map((_, i) => (
                        <Cell key={`inc-${i}`} fill="#10B981" />
                      ))}
                    </Bar>
                    <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[6, 6, 0, 0]} maxBarSize={48}>
                      {chartData.map((_, i) => (
                        <Cell key={`exp-${i}`} fill="#EF4444" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}

