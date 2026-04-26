"use client"

import { motion } from "framer-motion"
import { AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react"
import { formatCurrency } from "@/app/lib/utils/number"
import type { Budget } from "../types"

interface CategoryCardsProps {
  budgets: Budget[]
}

function getStatusColor(percent: number) {
  if (percent > 100) return { bar: "bg-rose-500", text: "text-rose-500", badge: "bg-rose-50 text-rose-600" }
  if (percent >= 70) return { bar: "bg-amber-400", text: "text-amber-500", badge: "bg-amber-50 text-amber-600" }
  return { bar: "bg-emerald-500", text: "text-emerald-600", badge: "bg-emerald-50 text-emerald-600" }
}

export default function CategoryCards({ budgets }: CategoryCardsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="rounded-3xl border border-border/60 bg-background/60 p-6 shadow-sm backdrop-blur-sm"
    >
      <h2 className="mb-5 text-lg font-semibold text-foreground">Budget Breakdown</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {budgets.map((b, i) => {
          const percent = (b.spentAmount / b.budgetAmount) * 100
          const colors = getStatusColor(percent)
          const remaining = b.budgetAmount - b.spentAmount

          return (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.01 }}
              className="rounded-2xl border border-border/50 bg-background/50 p-5 transition hover:bg-white/80"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">{b.category}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${colors.badge}`}>
                  {percent > 100 ? "Over" : percent >= 70 ? "Caution" : "On Track"}
                </span>
              </div>

              <div className="mb-3 space-y-1">
                <div className="flex justify-between text-xs text-foreground/50">
                  <span>Spent</span>
                  <span>{formatCurrency(b.spentAmount, b.currency, "en-IN")}</span>
                </div>
                <div className="flex justify-between text-xs text-foreground/50">
                  <span>Limit</span>
                  <span>{formatCurrency(b.budgetAmount, b.currency, "en-IN")}</span>
                </div>
              </div>

              <div className="h-2.5 w-full overflow-hidden rounded-full bg-border/30">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percent, 100)}%` }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className={`h-full rounded-full ${colors.bar}`}
                />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className={`text-xs font-medium ${colors.text}`}>
                  {percent.toFixed(0)}% used
                </span>
                <span className="text-xs text-foreground/40">
                  {remaining >= 0
                    ? `${formatCurrency(remaining, b.currency, "en-IN")} left`
                    : `${formatCurrency(Math.abs(remaining), b.currency, "en-IN")} over`}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

