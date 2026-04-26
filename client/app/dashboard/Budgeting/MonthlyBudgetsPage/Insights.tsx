"use client"

import { motion } from "framer-motion"
import { AlertTriangle, CheckCircle2, Lightbulb, TrendingDown, TrendingUp } from "lucide-react"
import { formatCurrency } from "@/app/lib/utils/number"
import type { Budget } from "../types"

interface InsightsProps {
  budgets: Budget[]
}

export default function Insights({ budgets }: InsightsProps) {
  const overspent = budgets.filter((b) => b.spentAmount > b.budgetAmount)
  const underutilized = budgets.filter((b) => b.spentAmount < b.budgetAmount * 0.5)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-3xl border border-border/60 bg-background/60 p-6 shadow-sm backdrop-blur-sm"
    >
      <div className="mb-4 flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-amber-500" />
        <h2 className="text-lg font-semibold text-foreground">Insights</h2>
      </div>

      <div className="space-y-3">
        {overspent.map((b) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/40 p-4"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
            <div>
              <p className="text-sm font-medium text-rose-700">
                You overspent on {b.category}
              </p>
              <p className="text-xs text-rose-500/70">
                Spent {formatCurrency(b.spentAmount, b.currency, "en-IN")} against{" "}
                {formatCurrency(b.budgetAmount, b.currency, "en-IN")}
              </p>
            </div>
          </motion.div>
        ))}

        {underutilized.map((b) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            <div>
              <p className="text-sm font-medium text-emerald-700">
                {b.category} budget unused
              </p>
              <p className="text-xs text-emerald-500/70">
                Only {((b.spentAmount / b.budgetAmount) * 100).toFixed(0)}% used — consider lowering next month
              </p>
            </div>
          </motion.div>
        ))}

        {overspent.length === 0 && underutilized.length === 0 && (
          <div className="flex items-center gap-3 rounded-2xl border border-border/40 bg-background/40 p-4">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <p className="text-sm text-foreground/60">All budgets are on track!</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

