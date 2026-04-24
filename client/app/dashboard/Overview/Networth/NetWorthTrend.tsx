"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"

import { Card } from "@/app/components/ui/card"
import { cn } from "@/app/lib/utils/cn"
import { formatCurrency } from "@/app/lib/utils/number"

import type { NetWorthTimeRange, TrendPoint } from "./types"

const ranges: { key: NetWorthTimeRange; label: string }[] = [
  { key: "1M", label: "1 Month" },
  { key: "3M", label: "3 Months" },
  { key: "6M", label: "6 Months" },
  { key: "1Y", label: "1 Year" },
]

interface NetWorthTrendProps {
  series: Record<NetWorthTimeRange, TrendPoint[]>
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="rounded-2xl border border-border/80 bg-white/95 p-4 shadow-[0_20px_60px_rgba(33,49,43,0.14)] backdrop-blur-xl">
      <p className="text-xs font-semibold text-foreground/60">{label}</p>
      <div className="mt-2 space-y-1">
        {payload.map((entry: any, idx: number) => (
          <div key={idx} className="flex items-center gap-2 text-sm">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-foreground/70">{entry.name}:</span>
            <span className="font-semibold text-foreground">
              {formatCurrency(entry.value, "INR", "en-IN")}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function NetWorthTrend({ series }: NetWorthTrendProps) {
  const [activeRange, setActiveRange] = useState<NetWorthTimeRange>("1M")
  const data = series[activeRange]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
    >
      <Card variant="surface" padding="lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-foreground">
              Net Worth Trend
            </h3>
            <p className="mt-1 text-sm text-foreground/60">
              Track your wealth trajectory over time
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {ranges.map((range) => (
              <button
                key={range.key}
                type="button"
                onClick={() => setActiveRange(range.key)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200",
                  activeRange === range.key
                    ? "border-emerald-300/80 bg-emerald-50 text-emerald-800 shadow-[0_4px_12px_rgba(47,125,103,0.12)]"
                    : "border-border/80 bg-background/75 text-foreground/55 hover:bg-white/90 hover:text-foreground/80"
                )}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 h-[280px] sm:h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="networthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2f7d67" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2f7d67" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="assetsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5687cc" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#5687cc" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="rgba(91,107,100,0.1)"
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
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="assets"
                stroke="#5687cc"
                strokeWidth={2}
                fill="url(#assetsGradient)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: "#5687cc" }}
                name="Assets"
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#2f7d67"
                strokeWidth={3}
                fill="url(#networthGradient)"
                dot={{ r: 3, fill: "#2f7d67", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, strokeWidth: 3, stroke: "#fff", fill: "#2f7d67" }}
                name="Net Worth"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  )
}

