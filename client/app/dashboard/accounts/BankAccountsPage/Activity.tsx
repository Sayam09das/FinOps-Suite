"use client"

import { motion } from "framer-motion"
import { ArrowDownLeft, ArrowUpRight, Receipt } from "lucide-react"

import { cn } from "@/app/lib/utils/cn"
import { formatCurrency } from "@/app/lib/utils/number"

import type { AccountActivity } from "../types"

interface ActivityProps {
  activities: AccountActivity[]
}

export default function Activity({ activities }: ActivityProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="surface-card rounded-[1.95rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-6 backdrop-blur-xl"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="primary-wash flex h-10 w-10 items-center justify-center rounded-2xl">
          <Receipt className="h-4 w-4 text-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <p className="text-xs text-foreground/55">Latest transactions across all accounts</p>
        </div>
      </div>

      <div className="space-y-2">
        {activities.slice(0, 5).map((act, i) => (
          <motion.div
            key={act.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/50 px-4 py-3 transition hover:bg-white/80"
          >
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                act.type === "credit"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-700"
              )}
            >
              {act.type === "credit" ? (
                <ArrowDownLeft className="h-4 w-4" />
              ) : (
                <ArrowUpRight className="h-4 w-4" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">{act.description}</p>
              <p className="text-xs text-foreground/50">{act.category} &middot; {act.date}</p>
            </div>
            <p
              className={cn(
                "text-sm font-semibold",
                act.type === "credit" ? "text-emerald-700" : "text-rose-700"
              )}
            >
              {act.type === "credit" ? "+" : "-"}
              {formatCurrency(act.amount, "INR", "en-IN")}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
