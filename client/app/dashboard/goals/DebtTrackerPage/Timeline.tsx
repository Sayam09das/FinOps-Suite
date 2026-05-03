"use client"

import { ResponsiveContainer } from "@/app/components/charts/MountedResponsiveContainer";
import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

import { Card, CardContent } from "@/app/components/ui/card"
import { formatCurrency } from "@/app/lib/utils/number"
import type { Debt } from "@/app/features/goals"

interface TimelineProps {
  debts: Debt[]
  currency: string
}

export default function Timeline({ debts, currency }: TimelineProps) {
  const data = debts.map((d) => ({
    name: d.name,
    months: Math.ceil(d.remainingBalance / d.emi),
    color: d.color,
  }))

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
            <h3 className="text-lg font-bold text-foreground">Payoff Timeline</h3>
            <span className="text-xs text-foreground/50">Months to clear</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" stroke="rgba(0,0,0,0.2)" fontSize={11} />
                <YAxis stroke="rgba(0,0,0,0.2)" fontSize={12} label={{ value: "Months", angle: -90, position: "insideLeft", style: { fontSize: 11 } }} />
                <Tooltip
                  formatter={(value: any) => [`${value} months`, "Time to clear"]}
                  contentStyle={{
                    borderRadius: "1rem",
                    border: "1px solid rgba(0,0,0,0.08)",
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(10px)",
                  }}
                />
                <Bar dataKey="months" radius={[6, 6, 0, 0]} animationDuration={1200}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
