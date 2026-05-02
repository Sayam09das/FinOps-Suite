"use client"

import { motion, AnimatePresence } from "framer-motion"
import { TrendingDown, TrendingUp } from "lucide-react"
import { formatCurrency } from "@/app/lib/utils/number"
import type { BudgetStatus } from "@/app/features/budgets"

interface PreviewProps {
  category: string
  budgetStatus?: BudgetStatus
}

export default function Preview({ category, budgetStatus }: PreviewProps) {
  const categoryData = budgetStatus?.[category]

  return (
    <AnimatePresence mode="wait">
      {categoryData ? (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="rounded-3xl border border-border/60 bg-background/60 p-6 shadow-sm backdrop-blur-sm"
        >
          <h2 className="mb-4 text-lg font-semibold text-foreground">Category Preview</h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/50 bg-background/50 p-4">
              <div className="flex items-center gap-2 text-foreground/50">
                <TrendingDown className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Budget</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {formatCurrency(categoryData.budget, "INR", "en-IN")}
              </p>
            </div>

            <div className="rounded-2xl border border-border/50 bg-background/50 p-4">
              <div className="flex items-center gap-2 text-foreground/50">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Spent</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {formatCurrency(categoryData.spent, "INR", "en-IN")}
              </p>
            </div>

            <div className="rounded-2xl border border-border/50 bg-background/50 p-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Remaining</span>
              </div>
              <p className={`mt-2 text-2xl font-bold ${
                categoryData.remaining < 0 ? "text-rose-500" : "text-emerald-500"
              }`}>
                {formatCurrency(categoryData.remaining, "INR", "en-IN")}
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs text-foreground/50">
            Based on your transactions for this category
          </p>
        </motion.div>
      ) : (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="rounded-3xl border border-dashed border-border/60 bg-background/40 p-8 text-center"
        >
          <p className="text-sm text-foreground/40">Select a category to see spending preview</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
