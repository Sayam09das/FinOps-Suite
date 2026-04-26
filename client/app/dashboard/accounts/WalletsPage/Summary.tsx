"use client"

import { motion } from "framer-motion"
import { Wallet } from "lucide-react"
import { formatCurrency } from "@/app/lib/utils/number"

interface SummaryProps {
  total: number
  count: number
  currency?: string
}

export default function Summary({ total, count, currency = "INR" }: SummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-3xl border border-border/60 bg-background/60 p-6 shadow-sm backdrop-blur-sm"
    >
      <div className="flex items-start gap-4">
        <div className="primary-wash flex h-12 w-12 items-center justify-center rounded-2xl">
          <Wallet className="h-6 w-6 text-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground/60">Total Wallet Balance</p>
          <p className="mt-1 text-4xl font-semibold tracking-[-0.04em] text-foreground">
            {formatCurrency(total, currency, "en-IN")}
          </p>
          <p className="mt-2 text-xs text-foreground/50">Across {count} wallet{count !== 1 ? "s" : ""}</p>
        </div>
      </div>
    </motion.div>
  )
}

