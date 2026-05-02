"use client"

import { motion } from "framer-motion"
import { AlertTriangle, PiggyBank } from "lucide-react"
import { formatCurrency } from "@/app/lib/utils/number"
import type { Budget } from "@/app/features/budgets"

interface SnapshotProps {
  budgets: Budget[]
  selectedCategory: string
  isLoading?: boolean
}

export default function Snapshot({ budgets, selectedCategory, isLoading }: SnapshotProps) {
  const existing = budgets.find((b) => b.category === selectedCategory)

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-3xl border border-border/60 bg-background/60 p-6 shadow-sm backdrop-blur-sm"
      >
        <div className="mb-4 flex items-center gap-2">
          <PiggyBank className="h-5 w-5 text-foreground/70" />
          <h2 className="text-lg font-semibold text-foreground">Your Budgets</h2>
        </div>
        <div className="animate-pulse space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded-xl bg-muted/50" />
          ))}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-3xl border border-border/60 bg-background/60 p-6 shadow-sm backdrop-blur-sm"
    >
      <div className="mb-4 flex items-center gap-2">
        <PiggyBank className="h-5 w-5 text-foreground/70" />
        <h2 className="text-lg font-semibold text-foreground">Your Budgets</h2>
        <span className="ml-auto rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          {budgets.length}
        </span>
      </div>

      {existing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/50 p-4"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <div>
            <p className="text-sm font-medium text-amber-700">
              Budget already exists for {selectedCategory}
            </p>
            <p className="text-xs text-amber-600/70">
              {formatCurrency(existing.amount, "INR", "en-IN")} for {existing.month}
            </p>
          </div>
        </motion.div>
      )}

      <div className="space-y-2">
        {budgets.length === 0 ? (
          <p className="text-sm text-foreground/50">No budgets yet. Create your first budget!</p>
        ) : (
          budgets.slice(0, 6).map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center justify-between rounded-xl border p-3 ${
                b.category === selectedCategory
                  ? "border-amber-300 bg-amber-50/30"
                  : "border-border/40 bg-background/40"
              }`}
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">{b.category}</span>
                <span className="text-xs text-foreground/50">{b.month}</span>
              </div>
              <span className="text-sm font-semibold text-foreground/70">
                {formatCurrency(b.amount, "INR", "en-IN")}
              </span>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}
