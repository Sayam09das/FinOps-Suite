"use client"

import { ResponsiveContainer } from "@/app/components/charts/MountedResponsiveContainer";
import { useState } from "react"
import { motion } from "framer-motion"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { formatCurrency } from "@/app/lib/utils/number"
import { cn } from "@/app/lib/utils/cn"
import type { BalanceSeries } from "./types"

type RangeKey = "daily" | "weekly" | "monthly"

const ranges: { key: RangeKey; label: string }[] = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
]

interface TimelineProps {
  series: BalanceSeries
  currency?: string
}

export default function Timeline({ series, currency = "INR" }: TimelineProps) {
  const [activeRange, setActiveRange] = useState<RangeKey>("weekly")
  const data = series[activeRange]

  const totalChange = data[data.length - 1].balance - data[0].balance

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
    >
      <Card
        variant="surface"
        className="rounded-[1.95rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-0 backdrop-blur-xl"
      >
        <CardHeader className="flex flex-col gap-4 border-b border-border/70 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl">Balance Timeline</CardTitle>
            <CardDescription>
              Closing balance trend across {activeRange} intervals.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {ranges.map((range) => (
                <button
                  key={range.key}
                  onClick={() => setActiveRange(range.key)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-semibold transition-all",
                    activeRange === range.key
                      ? "border-primary/80 bg-primary text-primary-foreground shadow-[0_10px_30px_rgba(33,49,43,0.08)]"
                      : "border-border/80 bg-background/75 text-foreground/65 hover:bg-white/90"
                  )}
                >
                  {range.label}
                </button>
              ))}
            </div>

            <div className="hidden items-center gap-3 rounded-xl border border-border/60 bg-background/60 px-4 py-2 md:flex">
              <div className="text-center">
                <p className="text-xs text-foreground/50">Period Change</p>
                <p
                  className={cn(
                    "text-sm font-bold",
                    totalChange >= 0 ? "text-green-600" : "text-red-600"
                  )}
                >
                  {totalChange >= 0 ? "+" : ""}
                  {formatCurrency(totalChange, currency)}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="h-[380px] px-3 pb-5 pt-5 sm:px-5">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 12, right: 8, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
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
                tickFormatter={(value) =>
                  `₹${Math.round(value / 1000)}k`
                }
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
                  "Balance",
                ]}
                labelStyle={{
                  color: "rgba(33,49,43,0.62)",
                  fontWeight: 600,
                }}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#3B82F6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#balanceGradient)"
                dot={{ r: 0 }}
                activeDot={{
                  r: 6,
                  strokeWidth: 3,
                  stroke: "#fff",
                  fill: "#3B82F6",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}



