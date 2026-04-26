"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Line,
  ComposedChart,
} from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { formatCurrency } from "@/app/lib/utils/number"
import { cn } from "@/app/lib/utils/cn"
import type { IncomeExpenseSeries } from "./demo-data"

type RangeKey = "weekly" | "monthly" | "yearly"
type ChartType = "bar" | "line"

const ranges: { key: RangeKey; label: string }[] = [
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "yearly", label: "Yearly" },
]

interface ComparisonChartProps {
  series: IncomeExpenseSeries
}

export default function ComparisonChart({ series }: ComparisonChartProps) {
  const [activeRange, setActiveRange] = useState<RangeKey>("monthly")
  const [chartType, setChartType] = useState<ChartType>("bar")
  const data = series[activeRange]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
    >
      <Card
        variant="surface"
        className="rounded-[1.95rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-0 backdrop-blur-xl"
      >
        <CardHeader className="flex flex-col gap-4 border-b border-border/70 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl">Comparison Chart</CardTitle>
            <CardDescription>Income vs Expense over time.</CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Chart type toggle */}
            <div className="flex rounded-xl border border-border/80 bg-background/60 p-1">
              {(["bar", "line"] as ChartType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all",
                    chartType === type
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground/60 hover:text-foreground"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Range toggles */}
            <div className="flex flex-wrap gap-2">
              {ranges.map((range) => (
                <button
                  key={range.key}
                  onClick={() => setActiveRange(range.key)}
                  className={cn(
                    "rounded-full border px-3.5 py-2 text-xs font-semibold transition-all",
                    activeRange === range.key
                      ? "border-primary/80 bg-primary text-primary-foreground shadow-[0_10px_30px_rgba(33,49,43,0.08)]"
                      : "border-border/80 bg-background/75 text-foreground/65 hover:bg-white/90"
                  )}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="h-[400px] px-3 pb-5 pt-5 sm:px-5">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart
                data={data}
                margin={{ top: 12, right: 8, left: -10, bottom: 0 }}
                barGap={6}
              >
                <CartesianGrid
                  stroke="rgba(91,107,100,0.12)"
                  strokeDasharray="4 4"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
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
                    formatCurrency(Number(value ?? 0), "INR"),
                    "",
                  ]}
                  labelStyle={{
                    color: "rgba(33,49,43,0.62)",
                    fontWeight: 600,
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: 12 }}
                  formatter={(value) => (
                    <span className="text-sm font-medium text-foreground/70">{value}</span>
                  )}
                />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#10B981"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
                <Bar
                  dataKey="expense"
                  name="Expense"
                  fill="#EF4444"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            ) : (
              <ComposedChart
                data={data}
                margin={{ top: 12, right: 8, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="rgba(91,107,100,0.12)"
                  strokeDasharray="4 4"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
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
                    formatCurrency(Number(value ?? 0), "INR"),
                    "",
                  ]}
                  labelStyle={{
                    color: "rgba(33,49,43,0.62)",
                    fontWeight: 600,
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: 12 }}
                  formatter={(value) => (
                    <span className="text-sm font-medium text-foreground/70">{value}</span>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#10B981" }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  name="Expense"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#EF4444" }}
                  activeDot={{ r: 5 }}
                />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}

