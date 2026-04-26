"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, PiggyBank, Wallet } from "lucide-react"

import { Card, CardContent } from "@/app/components/ui/card"
import { formatCurrency } from "@/app/lib/utils/number"
import { cn } from "@/app/lib/utils/cn"

interface SummaryProps {
  totalIncome: number
  totalExpense: number
  netSavings: number
  previousIncome: number
  previousExpense: number
  previousSavings: number
  currency?: string
}

export default function Summary({
  totalIncome,
  totalExpense,
  netSavings,
  previousIncome,
  previousExpense,
  previousSavings,
  currency = "INR",
}: SummaryProps) {
  const incomeChange = ((totalIncome - previousIncome) / previousIncome) * 100
  const expenseChange = ((totalExpense - previousExpense) / previousExpense) * 100
  const savingsChange = ((netSavings - previousSavings) / Math.abs(previousSavings || 1)) * 100

  const cards = [
    {
      label: "Total Income",
      value: totalIncome,
      change: incomeChange,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-950/40",
      iconBg: "bg-green-500/15",
      iconColor: "text-green-600",
    },
    {
      label: "Total Expense",
      value: totalExpense,
      change: expenseChange,
      icon: TrendingDown,
      color: "text-red-600",
      bg: "bg-red-100 dark:bg-red-950/40",
      iconBg: "bg-red-500/15",
      iconColor: "text-red-600",
    },
    {
      label: "Net Savings",
      value: netSavings,
      change: savingsChange,
      icon: PiggyBank,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-950/40",
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-600",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-3"
    >
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 + index * 0.08 }}
        >
          <Card
            variant="surface"
            className="rounded-[1.95rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-0 backdrop-blur-xl"
          >
            <CardContent className="flex items-center gap-4 px-5 py-5">
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                  card.iconBg
                )}
              >
                <card.icon className={cn("h-5 w-5", card.iconColor)} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground/60">{card.label}</p>
                <motion.p
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.08 }}
                  className="text-2xl font-bold tracking-tight text-foreground"
                >
                  {formatCurrency(card.value, currency)}
                </motion.p>
                <div className="mt-1 flex items-center gap-1">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
                      card.bg,
                      card.color
                    )}
                  >
                    {card.change >= 0 ? "+" : ""}
                    {card.change.toFixed(1)}%
                  </span>
                  <span className="text-xs text-foreground/50">vs last period</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}

