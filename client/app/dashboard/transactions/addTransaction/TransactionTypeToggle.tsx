"use client"

import { motion } from "framer-motion"
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"

import { cn } from "@/app/lib/utils/cn"

export type TransactionType = "income" | "expense"

interface TransactionTypeToggleProps {
  value: TransactionType
  onChange: (type: TransactionType) => void
}

const types: { value: TransactionType; label: string; icon: typeof ArrowUpRight; color: string; bg: string; activeBg: string }[] = [
  {
    value: "income",
    label: "Income",
    icon: ArrowDownLeft,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    activeBg: "bg-emerald-500",
  },
  {
    value: "expense",
    label: "Expense",
    icon: ArrowUpRight,
    color: "text-rose-700",
    bg: "bg-rose-50",
    activeBg: "bg-rose-500",
  },
]

export default function TransactionTypeToggle({ value, onChange }: TransactionTypeToggleProps) {
  return (
    <div className="flex gap-2 rounded-2xl border border-border/60 bg-background/60 p-1.5 backdrop-blur-sm sm:gap-3 sm:p-2">
      {types.map((type) => {
        const isActive = value === type.value
        const Icon = type.icon

        return (
          <button
            key={type.value}
            type="button"
            onClick={() => onChange(type.value)}
            className={cn(
              "relative flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition sm:px-5 sm:py-3 sm:text-base",
              isActive
                ? "text-white"
                : "text-foreground/60 hover:bg-white/60 hover:text-foreground"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="transaction-type-pill"
                className={cn("absolute inset-0 rounded-xl", type.activeBg)}
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">{type.label}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
