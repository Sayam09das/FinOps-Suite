"use client"

import { motion, AnimatePresence } from "framer-motion"
import { TrendingDown, TrendingUp } from "lucide-react"
import { formatCurrency } from "@/app/lib/utils/number"
import { demoCategorySpends } from "../demo-data"

interface PreviewProps {
  category: string
}

export default function Preview({ category }: PreviewProps) {
  const data = demoCategorySpends.find((c) => c.category === category)

  return (
    <AnimatePresence mode="wait">
      {data ? (
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
                <span className="text-xs font-medium uppercase tracking-wider">Last Month</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {formatCurrency(data.lastMonthSpend, data.currency, "en-IN")}
              </p>
            </div>

            <div className="rounded-2xl border border-border/50 bg-background/50 p-4">
              <div className="flex items-center gap-2 text-foreground/50">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Avg Spend</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {formatCurrency(data.avgSpend, data.currency, "en-IN")}
              </p>
            </div>

            <div className="rounded-2xl border border-border/50 bg-background/50 p-4">
              <div className="flex items-center gap-2 text-rose-400">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Highest</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-rose-500">
                {formatCurrency(data.highestSpend, data.currency, "en-IN")}
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs text-foreground/50">
            Use these insights to set a realistic budget for {category}.
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

