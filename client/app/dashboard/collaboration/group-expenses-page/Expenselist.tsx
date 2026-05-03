"use client"

import { motion } from "framer-motion"
import {
  Receipt,
  Equal,
  SlidersHorizontal,
  Percent,
  Calendar,
  Tag,
  ChevronRight,
} from "lucide-react"
import { formatCurrency } from "@/app/lib/utils/number"
import { cn } from "@/app/lib/utils/cn"
import type { ExpenseGroup, Expense } from "../types"

interface ExpenselistProps {
  group: ExpenseGroup
  currentUserId: string
  onViewSplit: (expense: Expense) => void
}

const splitTypeIcon: Record<string, typeof Equal> = {
  equal: Equal,
  custom: SlidersHorizontal,
  percentage: Percent,
}

const splitTypeLabel: Record<string, string> = {
  equal: "Equal split",
  custom: "Custom split",
  percentage: "Percentage",
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

export default function Expenselist({ group, currentUserId, onViewSplit }: ExpenselistProps) {
  const sortedExpenses = [...group.expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const getPayerName = (paidBy: string) =>
    group.members.find((m) => m.id === paidBy)?.name || "Unknown"

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-3xl border border-border/60 bg-background/60 p-5 shadow-sm backdrop-blur-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
            Expenses
          </h3>
          <p className="text-xs text-foreground/50">
            {sortedExpenses.length} expenses in {group.name}
          </p>
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
        {sortedExpenses.map((expense) => {
          const SplitIcon = splitTypeIcon[expense.splitType] || Equal
          const isYouPayer = expense.paidBy === currentUserId
          const yourSplit = expense.splits.find((s) => s.userId === currentUserId)?.amount || 0

          return (
            <motion.button
              key={expense.id}
              variants={item}
              whileHover={{ scale: 1.005 }}
              onClick={() => onViewSplit(expense)}
              className="flex w-full items-center gap-3 rounded-2xl border border-border/40 p-3 text-left transition hover:bg-background/80"
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${group.color}18` }}
              >
                <Receipt className="h-5 w-5" style={{ color: group.color }} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {expense.description}
                  </p>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-border/40 px-2 py-0.5 text-[10px] font-medium text-foreground/60">
                    <SplitIcon className="h-3 w-3" />
                    {splitTypeLabel[expense.splitType]}
                  </span>
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-foreground/40">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {expense.date}
                  </span>
                  <span>
                    Paid by{" "}
                    <span className={cn("font-medium", isYouPayer ? "text-primary" : "text-foreground/60")}>
                      {isYouPayer ? "You" : getPayerName(expense.paidBy)}
                    </span>
                  </span>
                  {expense.tags.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {expense.tags.join(", ")}
                    </span>
                  )}
                </div>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-sm font-bold text-foreground">
                  {formatCurrency(expense.amount, expense.currency)}
                </p>
                <p className="text-[10px] text-foreground/40">
                  your share {formatCurrency(yourSplit, expense.currency)}
                </p>
              </div>

              <ChevronRight className="h-4 w-4 shrink-0 text-foreground/30" />
            </motion.button>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
