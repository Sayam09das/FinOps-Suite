"use client"

import { ResponsiveContainer } from "@/app/components/charts/MountedResponsiveContainer";
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart } from 'recharts';

import { Card, CardContent } from "@/app/components/ui/card"
import { formatCompactCurrency, formatCurrency } from "@/app/lib/utils/number"

interface ChartProps {
  data: { date: string; value: number }[]
  currency: string
}

export default function Chart({ data, currency }: ChartProps) {
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
        <CardContent className="space-y-4 px-6 py-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Portfolio Performance</h3>
            <span className="text-xs text-foreground/50">Value over time</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(v) => new Date(v).toLocaleDateString("en-IN", { month: "short" })}
                  stroke="rgba(0,0,0,0.2)"
                  fontSize={12}
                />
                <YAxis
                  tickFormatter={(v) => formatCompactCurrency(Number(v ?? 0), currency)}
                  stroke="rgba(0,0,0,0.2)"
                  fontSize={12}
                />
                <Tooltip
                  formatter={(value: any) => [formatCurrency(value as number, currency), "Portfolio Value"]}
                  labelFormatter={(label) => new Date(label as string).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                  contentStyle={{
                    borderRadius: "1rem",
                    border: "1px solid rgba(0,0,0,0.08)",
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(10px)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fill="url(#portfolioGradient)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
