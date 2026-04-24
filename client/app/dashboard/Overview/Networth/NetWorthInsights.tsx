"use client"

import React from "react"
import { motion } from "framer-motion"

import { Card } from "@/app/components/ui/card"
import { cn } from "@/app/lib/utils/cn"

import type { NetWorthInsight } from "./types"

const toneStyles = {
  positive: {
    border: "border-emerald-200/70",
    bg: "bg-emerald-50/50",
    iconBg: "bg-emerald-100 text-emerald-700",
    badge: "bg-emerald-100 text-emerald-800",
  },
  warning: {
    border: "border-amber-200/70",
    bg: "bg-amber-50/50",
    iconBg: "bg-amber-100 text-amber-700",
    badge: "bg-amber-100 text-amber-800",
  },
  danger: {
    border: "border-rose-200/70",
    bg: "bg-rose-50/50",
    iconBg: "bg-rose-100 text-rose-700",
    badge: "bg-rose-100 text-rose-800",
  },
  neutral: {
    border: "border-blue-200/60",
    bg: "bg-blue-50/40",
    iconBg: "bg-blue-100 text-blue-700",
    badge: "bg-blue-100 text-blue-800",
  },
} as const

interface NetWorthInsightsProps {
  insights: NetWorthInsight[]
}

export default function NetWorthInsights({ insights }: NetWorthInsightsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
    >
      <Card variant="surface" padding="lg">
        <div>
          <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
            Growth Insights
          </h3>
          <p className="mt-0.5 text-sm text-foreground/55">
            Smart signals from your wealth data
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon
            const tone = toneStyles[insight.tone]

            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 15, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.45 + index * 0.08, duration: 0.35 }}
                className={cn(
                  "rounded-2xl border p-4 transition-all hover:shadow-md",
                  tone.border,
                  tone.bg
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                      tone.iconBg
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  {insight.metric && (
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-bold",
                        tone.badge
                      )}
                    >
                      {insight.metric}
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm font-semibold text-foreground">
                  {insight.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-foreground/60">
                  {insight.detail}
                </p>
              </motion.div>
            )
          })}
        </div>
      </Card>
    </motion.div>
  )
}

