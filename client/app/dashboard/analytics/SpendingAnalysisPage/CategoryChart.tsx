"use client"

import { ResponsiveContainer } from "@/app/components/charts/MountedResponsiveContainer";
import { motion } from "framer-motion"
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { formatCurrency } from "@/app/lib/utils/number"
import type { CategorySpend } from "./demo-data"

interface CategoryChartProps {
  categories: CategorySpend[]
}

export default function CategoryChart({ categories }: CategoryChartProps) {
  const total = categories.reduce((sum, cat) => sum + cat.amount, 0)

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
        <CardHeader className="border-b border-border/70 px-5 py-5">
          <CardTitle className="text-xl">Category Breakdown</CardTitle>
          <CardDescription>
            Spending distribution by category for the selected period.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-5 py-6">
          {categories.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-border/80 bg-background/55 px-6 py-10 text-center">
              <p className="text-base font-semibold text-foreground">
                No category data yet
              </p>
              <p className="mt-2 text-sm text-foreground/58">
                Start tracking expenses to unlock category-level breakdowns.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-8 md:flex-row">
              {/* Donut Chart */}
              <div className="relative h-[280px] w-full md:w-[55%]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categories}
                      dataKey="amount"
                      nameKey="name"
                      innerRadius={72}
                      outerRadius={100}
                      paddingAngle={3}
                      strokeWidth={0}
                      cx="50%"
                      cy="50%"
                    >
                      {categories.map((item) => (
                        <Cell key={item.name} fill={item.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: "1rem",
                        border: "1px solid rgba(211,221,210,0.9)",
                        background: "rgba(255,255,255,0.92)",
                        boxShadow: "0 20px 60px rgba(33,49,43,0.12)",
                      }}
                      formatter={(value) => [
                        formatCurrency(Number(value ?? 0), "INR"),
                        "Amount",
                      ]}
                      labelStyle={{
                        color: "rgba(33,49,43,0.62)",
                        fontWeight: 600,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center Label */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-sm font-medium text-foreground/50">Total</p>
                  <p className="text-xl font-bold text-foreground">
                    {formatCurrency(total, "INR")}
                  </p>
                </div>
              </div>

              {/* Legend */}
              <div className="w-full space-y-3 md:w-[45%]">
                {categories.map((cat, index) => (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.3 + index * 0.06 }}
                    className="flex items-center justify-between rounded-[1.1rem] border border-border/60 bg-background/60 px-4 py-3 transition-colors hover:bg-background/90"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-3.5 w-3.5 rounded-full shadow-sm"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-sm font-semibold text-foreground">
                        {cat.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">
                        {formatCurrency(cat.amount, "INR")}
                      </p>
                      <p className="text-xs text-foreground/55">
                        {cat.percentage.toFixed(1)}%
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

