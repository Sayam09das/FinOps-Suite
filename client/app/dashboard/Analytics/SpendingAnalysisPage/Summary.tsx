"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Wallet } from "lucide-react"

import { Card, CardContent } from "@/app/components/ui/card"
import { formatCurrency } from "@/app/lib/utils/number"
import { cn } from "@/app/lib/utils/cn"

interface SummaryProps {
  total: number
  previousTotal: number
  changePercent: number
  currency?: string
}

export default function Summary({
  total,
  previousTotal,
  changePercent,
  currency = "INR",
}: SummaryProps) {
  const isPositive = changePercent >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
    >
      <Card
        variant="surface"
        className="rounded-[1.95rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-0 backdrop-blur-xl"
      >
        <CardContent className="flex flex-col gap-6 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-sm">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground/60">
                Total Spent
              </p>
              <motion.p
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
              >
                {formatCurrency(total, currency)}
              </motion.p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1">
            <div
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold",
                isPositive
                  ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                  : "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {Math.abs(changePercent).toFixed(1)}%
            </div>
            <p className="text-sm text-foreground/60">
              vs previous period ({formatCurrency(previousTotal, currency)})
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

