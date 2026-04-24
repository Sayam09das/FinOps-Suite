"use client"

import React from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"

import { Card } from "@/app/components/ui/card"
import { cn } from "@/app/lib/utils/cn"
import { formatCurrency } from "@/app/lib/utils/number"

import type { LiabilityItem } from "./types"

interface LiabilityCardProps {
  liabilities: LiabilityItem[]
  totalLiabilities: number
}

export default function LiabilityCard({ liabilities, totalLiabilities }: LiabilityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
    >
      <Card variant="surface" padding="lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
              Liabilities
            </h3>
            <p className="mt-0.5 text-sm text-foreground/55">
              What you owe
            </p>
          </div>
          <div className="rounded-2xl border border-rose-200/60 bg-rose-50/70 px-4 py-2 text-right">
            <p className="text-xs font-medium text-rose-700/70">Total</p>
            <p className="text-lg font-bold tracking-tight text-rose-600">
              ₹{formatCurrency(totalLiabilities, "INR", "en-IN").replace("₹", "")}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {liabilities.map((liability, index) => {
            const Icon = liability.icon
            const isDecreasing = (liability.change ?? 0) <= 0
            const ChangeIcon = isDecreasing ? TrendingDown : TrendingUp

            return (
              <motion.div
                key={liability.id}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + index * 0.08, duration: 0.35 }}
                className="group flex items-center gap-3 rounded-2xl border border-border/60 bg-background/60 p-3.5 transition-all hover:border-rose-200/80 hover:bg-rose-50/30 hover:shadow-sm"
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm"
                  style={{ backgroundColor: `${liability.color}18`, color: liability.color }}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">{liability.name}</p>
                    <p className="text-sm font-bold text-foreground">
                      ₹{formatCurrency(liability.amount, "INR", "en-IN").replace("₹", "")}
                    </p>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border/60">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${liability.percentage}%` }}
                        transition={{ delay: 0.55 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: liability.color }}
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground/50">
                      {liability.percentage}%
                    </span>
                  </div>
                </div>

                {liability.change !== undefined && (
                  <div
                    className={cn(
                      "flex shrink-0 items-center gap-0.5 rounded-lg px-2 py-1 text-xs font-semibold",
                      isDecreasing
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    )}
                  >
                    <ChangeIcon className="h-3 w-3" />
                    {Math.abs(liability.change)}%
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </Card>
    </motion.div>
  )
}

