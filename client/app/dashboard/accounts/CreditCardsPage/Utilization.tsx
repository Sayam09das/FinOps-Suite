"use client"

import { motion } from "framer-motion"
import { CreditCard, TrendingUp, Wallet } from "lucide-react"
import { formatCurrency } from "@/app/lib/utils/number"

interface UtilizationProps {
  totalLimit: number
  totalUsed: number
  totalAvailable: number
  utilization: number
  cardCount: number
}

export default function Utilization({
  totalLimit,
  totalUsed,
  totalAvailable,
  utilization: utilizationPercent,
  cardCount,
}: UtilizationProps) {

  const getUtilizationColor = (percent: number) => {
    if (percent >= 80) return "bg-red-500"
    if (percent >= 50) return "bg-amber-500"
    return "bg-emerald-500"
  }

  const getUtilizationTextColor = (percent: number) => {
    if (percent >= 80) return "text-red-600"
    if (percent >= 50) return "text-amber-600"
    return "text-emerald-600"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-3xl border border-border/60 bg-background/60 p-5 shadow-sm backdrop-blur-sm md:p-6"
    >
      <div className="mb-5 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-foreground/70" />
        <h2 className="text-lg font-semibold text-foreground">Utilization Summary</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {/* Total Limit */}
        <div className="rounded-2xl bg-primary/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm text-foreground/60">
            <CreditCard className="h-4 w-4" />
            Total Limit
          </div>
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {formatCurrency(totalLimit, "INR")}
          </p>
        </div>

        {/* Total Used */}
        <div className="rounded-2xl bg-primary/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm text-foreground/60">
            <Wallet className="h-4 w-4" />
            Total Used
          </div>
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {formatCurrency(totalUsed, "INR")}
          </p>
        </div>

        {/* Available */}
        <div className="rounded-2xl bg-primary/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm text-foreground/60">
            <TrendingUp className="h-4 w-4" />
            Available
          </div>
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {formatCurrency(totalAvailable, "INR")}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-foreground/70">Utilization</span>
          <span className={`text-sm font-bold ${getUtilizationTextColor(utilizationPercent)}`}>
            {utilizationPercent.toFixed(1)}%
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-border/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(utilizationPercent, 100)}%` }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className={`h-full rounded-full ${getUtilizationColor(utilizationPercent)}`}
          />
        </div>
        <p className="mt-2 text-xs text-foreground/50">
          {utilizationPercent >= 80
            ? "High utilization — consider paying down balances to improve credit score"
            : utilizationPercent >= 50
              ? "Moderate utilization — keep below 30% for optimal credit health"
              : "Healthy utilization — great job managing your credit"}
        </p>
      </div>
    </motion.div>
  )
}

