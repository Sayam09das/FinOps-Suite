"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Lightbulb, TrendingUp } from "lucide-react"
import { formatCurrency } from "@/app/lib/utils/number"
import type { BudgetStatus } from "@/app/features/budgets"

interface SuggestionsProps {
  category: string
  amount: string
  budgetStatus?: BudgetStatus
}

export default function Suggestions({ category, amount, budgetStatus }: SuggestionsProps) {
  const categoryData = budgetStatus?.[category]
  const enteredAmount = parseFloat(amount) || 0

  const suggestions: { text: string; type: "info" | "warn" | "success" }[] = []

  if (categoryData) {
    // Show budget vs spending comparison
    if (enteredAmount > 0) {
      if (enteredAmount < categoryData.budget) {
        const percentage = Math.round((1 - enteredAmount / categoryData.budget) * 100)
        suggestions.push({
          text: `${percentage}% under budget - conservative but safe`,
          type: "success",
        })
      } else if (enteredAmount > categoryData.budget) {
        suggestions.push({
          text: `Budget exceeds your planned amount by ${formatCurrency(enteredAmount - categoryData.budget, "INR", "en-IN")}`,
          type: "warn",
        })
      } else {
        suggestions.push({
          text: `Matches your budget exactly`,
          type: "info",
        })
      }
    }

    // Add info about current spending
    if (categoryData.spent > 0) {
      suggestions.push({
        text: `You've already spent ${formatCurrency(categoryData.spent, "INR", "en-IN")} this month`,
        type: "info",
      })
    }

    // Check if over budget
    if (categoryData.remaining < 0) {
      suggestions.push({
        text: `Warning: You've exceeded your budget by ${formatCurrency(Math.abs(categoryData.remaining), "INR", "en-IN")}`,
        type: "warn",
      })
    }
  }

  return (
    <AnimatePresence mode="wait">
      {suggestions.length > 0 && (
        <motion.div
          key={category + amount}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="rounded-3xl border border-border/60 bg-background/60 p-6 shadow-sm backdrop-blur-sm"
        >
          <div className="mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-foreground">Smart Suggestions</h2>
          </div>

          <div className="space-y-3">
            {suggestions.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-start gap-3 rounded-2xl border p-4 ${
                  s.type === "warn"
                    ? "border-amber-200 bg-amber-50/50"
                    : s.type === "success"
                    ? "border-emerald-200 bg-emerald-50/50"
                    : "border-border/50 bg-background/50"
                }`}
              >
                <TrendingUp
                  className={`mt-0.5 h-4 w-4 shrink-0 ${
                    s.type === "warn" ? "text-amber-500" : s.type === "success" ? "text-emerald-500" : "text-foreground/40"
                  }`}
                />
                <p className="text-sm text-foreground/80">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
