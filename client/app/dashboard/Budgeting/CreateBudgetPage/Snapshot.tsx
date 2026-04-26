"use client"

import { motion } from "framer-motion"
import { AlertTriangle, CheckCircle2, PiggyBank } from "lucide-react"
import { formatCurrency } from "@/app/lib/utils/number"
import type { Budget } from "../types"

interface SnapshotProps {
  budgets: Budget[]
  selectedCategory: string
}

export default function Snapshot({ budgets, selectedCategory }: SnapshotProps) {
  const existing = budgets.find((b) => b.category === selectedCategory)
  const activeBudgets = budgets.filter((b) => b.status === "active")

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-3xl border border-border/60 bg-background/60 p-6 shadow-sm backdrop-blur-sm"
    >
      <div className="mb-4 flex items-center gap-2">
        <PiggyBank className="h-5 w-5 text-foreground/70" />
        <h2 className="text-lg font-semibold text-foreground">Active Budgets</h2>
        <span className="ml-auto rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          {activeBudgets.length}
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
              {formatCurrency(existing.budgetAmount, existing.currency, "en-IN")} / month
            </p>
          </div>
        </motion.div>
      )}

      <div className="space-y-2">
        {activeBudgets.map((b, i) => (
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
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-sm font-medium text-foreground">{b.category}</span>
            </div>
            <span className="text-sm font-semibold text-foreground/70">
              {formatCurrency(b.budgetAmount, b.currency, "en-IN")}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

