"use client"

import { motion } from "framer-motion"
import { Edit2, Pause, Play, Trash2, Calendar, Clock } from "lucide-react"

import { cn } from "@/app/lib/utils/cn"
import { CATEGORY_CONFIG } from "../AllTransactions/view-model"

export interface RecurringTransaction {
  id: string
  name: string
  amount: number
  category: string
  account: string
  frequency: "daily" | "weekly" | "monthly" | "yearly"
  nextDate: string
  status: "active" | "paused"
  type: "income" | "expense"
}

interface RecurringItemProps {
  item: RecurringTransaction
  onEdit: (item: RecurringTransaction) => void
  onToggleStatus: (id: string) => void
  onDelete: (id: string) => void
}

const frequencyLabels: Record<string, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
}

export default function RecurringItem({ item, onEdit, onToggleStatus, onDelete }: RecurringItemProps) {
  const config = CATEGORY_CONFIG[item.category]

  const daysUntil = Math.ceil(
    (new Date(item.nextDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30 }}
      whileHover={{ y: -2 }}
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background/50 p-4 transition hover:border-primary/30 hover:bg-white/70 hover:shadow-[0_12px_40px_rgba(33,49,43,0.08)]"
    >
      {/* Status indicator */}
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-1 rounded-l-2xl",
          item.status === "active"
            ? item.type === "income" ? "bg-emerald-400" : "bg-rose-400"
            : "bg-amber-400"
        )}
      />

      <div className="ml-3 flex items-start gap-3">
        {/* Icon */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted">
          {config ? (
            <config.icon className="h-5 w-5" style={{ color: config.color }} />
          ) : (
            <Calendar className="h-5 w-5 text-foreground/40" />
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-foreground">{item.name}</p>
              <p className="text-xs text-foreground/50">{item.category} · {item.account}</p>
            </div>
            <p
              className={cn(
                "text-sm font-bold",
                item.type === "income" ? "text-emerald-600" : "text-rose-600"
              )}
            >
              {item.type === "income" ? "+" : "-"}₹{item.amount.toLocaleString("en-IN")}
            </p>
          </div>

          {/* Meta row */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-muted px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground/60">
              {frequencyLabels[item.frequency]}
            </span>
            <span
              className={cn(
                "rounded-lg px-2 py-1 text-[10px] font-semibold uppercase tracking-wider",
                item.status === "active"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              )}
            >
              {item.status}
            </span>
            <span className="flex items-center gap-1 text-xs text-foreground/40">
              <Clock className="h-3 w-3" />
              {daysUntil <= 0
                ? "Due today"
                : daysUntil === 1
                ? "Due tomorrow"
                : `Due in ${daysUntil} days`}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100">
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(item)}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-foreground/50 transition hover:bg-primary/10 hover:text-primary"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggleStatus(item.id)}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-foreground/50 transition hover:bg-amber-100 hover:text-amber-600"
          >
            {item.status === "active" ? (
              <Pause className="h-3.5 w-3.5" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(item.id)}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-foreground/50 transition hover:bg-rose-100 hover:text-rose-600"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

