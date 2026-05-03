"use client"

import React from "react"
import { motion } from "framer-motion"
import { Flame, Clock, AlertCircle } from "lucide-react"

import { Card } from "@/app/components/ui/card"
import { cn } from "@/app/lib/utils/cn"
import { formatCurrency } from "@/app/lib/utils/number"

import type { LiabilityItem } from "./types"

interface LiabilityListProps {
  liabilities: LiabilityItem[]
}

export default function LiabilityList({ liabilities }: LiabilityListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
    >
      <Card variant="surface" padding="lg">
        <div>
          <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
            Liability Breakdown
          </h3>
          <p className="mt-0.5 text-sm text-foreground/55">
            Details with interest & due dates
          </p>
        </div>

        <div className="mt-5 space-y-3">
          {liabilities.map((liability, index) => {
            const isUrgent = (liability.dueInDays ?? 99) <= 3
            const isWarning = (liability.dueInDays ?? 99) <= 7 && !isUrgent

            return (
              <motion.div
                key={liability.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.35 }}
                className={cn(
                  "rounded-2xl border p-4 transition-all hover:shadow-sm",
                  isUrgent
                    ? "border-rose-200/80 bg-rose-50/50"
                    : isWarning
                    ? "border-amber-200/70 bg-amber-50/40"
                    : "border-border/60 bg-background/50"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: `${liability.color}18`,
                        color: liability.color,
                      }}
                    >
                      <liability.icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {liability.name}
                      </p>
                      <p className="text-xs text-foreground/50">
                        {liability.category.replace("_", " ").toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-foreground">
                      {formatCurrency(liability.amount, "INR", "en-IN")}
                    </p>
                    <p className="text-xs text-foreground/50">
                      {liability.percentage}% of liabilities
                    </p>
                  </div>
                </div>

                {/* Interest & Due Date Row */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {liability.interestRate !== undefined && (
                    <div className="inline-flex items-center gap-1 rounded-lg border border-orange-200/60 bg-orange-50/60 px-2.5 py-1 text-xs font-medium text-orange-700">
                      <Flame className="h-3 w-3" />
                      {liability.interestRate}% APR
                    </div>
                  )}

                  {liability.dueInDays !== undefined && (
                    <div
                      className={cn(
                        "inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium",
                        isUrgent
                          ? "border-rose-200/70 bg-rose-100/60 text-rose-700"
                          : isWarning
                          ? "border-amber-200/70 bg-amber-100/50 text-amber-700"
                          : "border-border/60 bg-background/60 text-foreground/60"
                      )}
                    >
                      {isUrgent ? (
                        <AlertCircle className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                      {isUrgent
                        ? `Due in ${liability.dueInDays} days`
                        : `Due in ${liability.dueInDays} days`}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </Card>
    </motion.div>
  )
}
