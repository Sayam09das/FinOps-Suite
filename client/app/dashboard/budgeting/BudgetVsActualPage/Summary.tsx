"use client"

import { motion } from "framer-motion"
import { AlertTriangle, IndianRupee, PiggyBank, TrendingUp } from "lucide-react"
import { formatCurrency } from "@/app/lib/utils/number"

interface SummaryProps {
  totalBudget: number
  totalSpent: number
  currency: string
}

export default function Summary({ totalBudget, totalSpent, currency }: SummaryProps) {
  const diff = totalSpent - totalBudget
  const isOver = diff > 0

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
            <p className="text-xs font-medium uppercase tracking-wider text-foreground/50">Total Budget</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{formatCurrency(totalBudget, currency, "en-IN")}</p>
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
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isOver ? "bg-rose-100" : "bg-emerald-100"}`}>
            <TrendingUp className={`h-5 w-5 ${isOver ? "text-rose-500" : "text-emerald-600"}`} />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-foreground/50">Difference</p>
            <div className="mt-1 flex items-center gap-1.5">
              <p className={`text-2xl font-bold ${isOver ? "text-rose-500" : "text-emerald-600"}`}>
                {isOver ? "−" : "+"}{formatCurrency(Math.abs(diff), currency, "en-IN")}
              </p>
              {isOver && <AlertTriangle className="h-4 w-4 text-rose-400" />}
            </div>
            <p className={`text-xs ${isOver ? "text-rose-400" : "text-emerald-500/70"}`}>
              {isOver ? `Over by ${formatCurrency(diff, currency, "en-IN")}` : "Under budget"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

