"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Lightbulb, TrendingUp } from "lucide-react"
import { formatCurrency } from "@/app/lib/utils/number"
import { demoCategorySpends } from "../demo-data"

interface SuggestionsProps {
  category: string
  amount: string
}

export default function Suggestions({ category, amount }: SuggestionsProps) {
  const data = demoCategorySpends.find((c) => c.category === category)
  const enteredAmount = parseFloat(amount) || 0

  const suggestions: { text: string; type: "info" | "warn" | "success" }[] = []

  if (data) {
    const suggested = Math.round(data.avgSpend * 1.1)
    suggestions.push({
      text: `You usually spend ${formatCurrency(data.avgSpend, "INR", "en-IN")} → suggested ${formatCurrency(suggested, "INR", "en-IN")}`,
      type: "info",
    })
    suggestions.push({
      text: `Your highest spend was ${formatCurrency(data.highestSpend, "INR", "en-IN")}`,
      type: "warn",
    })
    if (enteredAmount > 0) {
      if (enteredAmount < data.avgSpend) {
        suggestions.push({
          text: `Budget is ${Math.round((1 - enteredAmount / data.avgSpend) * 100)}% below your average — ambitious!`,
          type: "success",
        })
      } else if (enteredAmount > data.highestSpend) {
        suggestions.push({
          text: `Budget exceeds your highest recorded spend`,
          type: "warn",
        })
      }
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

