"use client"

import { motion } from "framer-motion"
import { IndianRupee, PiggyBank, TrendingUp } from "lucide-react"
import { formatCurrency } from "@/app/lib/utils/number"

interface SummaryProps {
  totalBudgeted: number
  totalSpent: number
  currency: string
}

export default function Summary({ totalBudgeted, totalSpent, currency }: SummaryProps) {
  const remaining = totalBudgeted - totalSpent
  const percentUsed = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0
  const isOver = remaining < 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-3xl border border-border/60 bg-background/60 p-6 shadow-sm backdrop-blur-sm"
    >
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <PiggyBank className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-foreground/50">Total Budgeted</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{formatCurrency(totalBudgeted, currency, "en-IN")}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
            <IndianRupee className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-foreground/50">Total Spent</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{formatCurrency(totalSpent, currency, "en-IN")}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-foreground/50">Remaining</p>
            <p className={`mt-1 text-2xl font-bold ${isOver ? "text-rose-500" : "text-emerald-600"}`}>
              {isOver ? "−" : ""}{formatCurrency(Math.abs(remaining), currency, "en-IN")}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="mb-2 flex justify-between text-xs text-foreground/50">
          <span>{percentUsed.toFixed(0)}% used</span>
          <span>{isOver ? "Over budget" : "On track"}</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-border/40">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentUsed, 100)}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full rounded-full ${
              percentUsed > 100 ? "bg-rose-500" : percentUsed > 70 ? "bg-amber-400" : "bg-emerald-500"
            }`}
          />
        </div>
      </div>
    </motion.div>
  )
}

