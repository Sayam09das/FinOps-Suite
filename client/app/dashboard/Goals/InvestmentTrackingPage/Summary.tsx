"use client"

import { motion } from "framer-motion"
import { Wallet, TrendingUp, TrendingDown, Percent } from "lucide-react"

import { Card, CardContent } from "@/app/components/ui/card"
import { formatCurrency } from "@/app/lib/utils/number"
import { cn } from "@/app/lib/utils/cn"
import type { InvestmentSummaryData } from "./demo-data"

interface SummaryProps {
  data: InvestmentSummaryData
}

export default function Summary({ data }: SummaryProps) {
  const profitLoss = data.currentValue - data.totalInvested
  const returnPercent = Math.round((profitLoss / data.totalInvested) * 100)
  const isProfit = profitLoss >= 0

  const cards = [
    {
      label: "Total Invested",
      display: formatCurrency(data.totalInvested, data.currency),
      icon: Wallet,
      color: "text-blue-600",
      bg: "bg-blue-500/15",
    },
    {
      label: "Current Value",
      display: formatCurrency(data.currentValue, data.currency),
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-500/15",
    },
    {
      label: isProfit ? "Profit" : "Loss",
      display: formatCurrency(Math.abs(profitLoss), data.currency),
      icon: isProfit ? TrendingUp : TrendingDown,
      color: isProfit ? "text-green-600" : "text-red-600",
      bg: isProfit ? "bg-green-500/15" : "bg-red-500/15",
    },
    {
      label: "Return %",
      display: `${returnPercent > 0 ? "+" : ""}${returnPercent}%`,
      icon: Percent,
      color: isProfit ? "text-purple-600" : "text-red-600",
      bg: isProfit ? "bg-purple-500/15" : "bg-red-500/15",
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
        <CardContent className="px-6 py-6">
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
        </CardContent>
      </Card>
    </motion.div>
  )
}
