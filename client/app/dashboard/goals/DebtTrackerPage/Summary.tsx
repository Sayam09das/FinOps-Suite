"use client"

import { motion } from "framer-motion"
import { CreditCard, Wallet, TrendingDown, Percent } from "lucide-react"

import { Card, CardContent } from "@/app/components/ui/card"
import { formatCurrency } from "@/app/lib/utils/number"
import { cn } from "@/app/lib/utils/cn"
import type { DebtSummaryData } from "@/app/features/goals"

interface SummaryProps {
  data: DebtSummaryData
}

export default function Summary({ data }: SummaryProps) {
  const paidPercent = data.totalDebt > 0 ? Math.round((data.totalPaid / data.totalDebt) * 100) : 0

  const cards = [
    {
      label: "Total Debt",
      display: formatCurrency(data.totalDebt, data.currency),
      icon: CreditCard,
      color: "text-red-600",
      bg: "bg-red-500/15",
    },
    {
      label: "Total Paid",
      display: formatCurrency(data.totalPaid, data.currency),
      icon: Wallet,
      color: "text-green-600",
      bg: "bg-green-500/15",
    },
    {
      label: "Remaining",
      display: formatCurrency(data.remaining, data.currency),
      icon: TrendingDown,
      color: "text-orange-600",
      bg: "bg-orange-500/15",
    },
    {
      label: "Progress",
      display: `${paidPercent}%`,
      icon: Percent,
      color: "text-blue-600",
      bg: "bg-blue-500/15",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
    >
      <Card
        variant="surface"
        className="rounded-[1.95rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-0 backdrop-blur-xl"
      >
        <CardContent className="space-y-5 px-6 py-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, index) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + index * 0.08 }}
                className="flex items-center gap-4"
              >
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                    card.bg
                  )}
                >
                  <card.icon className={cn("h-5 w-5", card.color)} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground/60">
                    {card.label}
                  </p>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.25 + index * 0.08 }}
                    className="text-2xl font-bold tracking-tight text-foreground"
                  >
                    {card.display}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground/70">
                Debt Payoff Progress
              </span>
              <span className="text-sm font-bold text-foreground">
                {formatCurrency(data.totalPaid, data.currency)} paid of{" "}
                {formatCurrency(data.totalDebt, data.currency)}
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${paidPercent}%` }}
                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                className="h-full rounded-full bg-green-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
