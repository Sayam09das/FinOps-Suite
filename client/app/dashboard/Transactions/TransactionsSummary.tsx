"use client"

import React from "react"
import { motion } from "framer-motion"
import { Receipt, ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react"

import { Card } from "@/app/components/ui/card"
import { cn } from "@/app/lib/utils/cn"
import { formatCurrency } from "@/app/lib/utils/number"

import type { TransactionSummary } from "./types"

interface TransactionsSummaryProps {
  summary: TransactionSummary
}

const summaryCards = [
  {
    label: "Total Transactions",
    key: "totalTransactions" as const,
    icon: Receipt,
    tone: "neutral" as const,
    format: (v: number) => v.toString(),
  },
  {
    label: "Total Income",
    key: "totalIncome" as const,
    icon: ArrowUpCircle,
    tone: "positive" as const,
    format: (v: number) => formatCurrency(v, "INR", "en-IN"),
  },
  {
    label: "Total Expense",
    key: "totalExpense" as const,
    icon: ArrowDownCircle,
    tone: "danger" as const,
    format: (v: number) => formatCurrency(v, "INR", "en-IN"),
  },
  {
    label: "Net",
    key: "net" as const,
    icon: Wallet,
    tone: "neutral" as const,
    format: (v: number) => formatCurrency(v, "INR", "en-IN"),
  },
]

const toneStyles = {
  positive: {
    icon: "bg-emerald-100 text-emerald-700",
    value: "text-emerald-700",
    card: "border-emerald-200/50 bg-emerald-50/30",
  },
  danger: {
    icon: "bg-rose-100 text-rose-700",
    value: "text-rose-600",
    card: "border-rose-200/50 bg-rose-50/30",
  },
  neutral: {
    icon: "bg-blue-100 text-blue-700",
    value: "text-foreground",
    card: "border-border/60 bg-background/50",
  },
}

export default function TransactionsSummary({ summary }: TransactionsSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
    >
      {summaryCards.map((card, index) => {
        const Icon = card.icon
        const tone = toneStyles[card.tone]
        const value = summary[card.key]
        const isNetNegative = card.key === "net" && typeof value === "number" && value < 0

        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + index * 0.06, duration: 0.35 }}
          >
            <Card
              variant="surface"
              padding="md"
              className={cn(
                "border transition hover:shadow-sm",
                isNetNegative ? toneStyles.danger.card : tone.card
              )}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl",
                    isNetNegative ? toneStyles.danger.icon : tone.icon
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground/55">{card.label}</p>
                  <p
                    className={cn(
                      "text-lg font-bold tracking-tight",
                      isNetNegative ? toneStyles.danger.value : tone.value
                    )}
                  >
                    {card.format(value as number)}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

