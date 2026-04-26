"use client"

import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { Budget } from "../types"

interface ChartProps {
  budgets: Budget[]
}

export default function Chart({ budgets }: ChartProps) {
  const data = budgets.map((b) => ({
    category: b.category,
    Budget: b.budgetAmount,
    Actual: b.spentAmount,
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-3xl border border-border/60 bg-background/60 p-6 shadow-sm backdrop-blur-sm"
    >
      <h2 className="mb-5 text-lg font-semibold text-foreground">Variance Chart</h2>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, ""]}
              contentStyle={{ borderRadius: "1rem", border: "1px solid #e5e7eb" }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              iconType="circle"
              iconSize={8}
            />
            <Bar dataKey="Budget" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={36} />
            <Bar dataKey="Actual" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

