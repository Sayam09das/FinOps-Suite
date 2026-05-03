"use client"

import { motion } from "framer-motion"
import { X, ArrowRight, User, Receipt } from "lucide-react"
import { formatCurrency } from "@/app/lib/utils/number"
import { cn } from "@/app/lib/utils/cn"
import type { Expense, GroupMember } from "../types"

interface SplitDetailsProps {
  expense: Expense
  members: GroupMember[]
  onClose: () => void
}

export default function SplitDetails({ expense, members, onClose }: SplitDetailsProps) {
  const payer = members.find((m) => m.id === expense.paidBy)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-border/60 bg-background/60 p-5 shadow-sm backdrop-blur-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
            Split Details
          </h3>
        </div>
        <button
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground/40 transition hover:bg-background/80 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-4 rounded-2xl border border-border/40 bg-background/50 p-4">
        <p className="text-sm font-medium text-foreground">{expense.description}</p>
        <p className="mt-1 text-2xl font-bold text-foreground">
          {formatCurrency(expense.amount, expense.currency)}
        </p>
        <p className="mt-1 text-xs text-foreground/50">
          Paid by <span className="font-medium text-foreground/70">{payer?.name || "Unknown"}</span>
          {" "}·{" "}
          <span className="capitalize">{expense.splitType} split</span>
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-foreground/40">
          Who owes what
        </p>
        {expense.splits.map((split) => {
          const member = members.find((m) => m.id === split.userId)
          const isPayer = split.userId === expense.paidBy

          return (
            <motion.div
              key={split.userId}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex items-center justify-between rounded-xl border p-3",
                isPayer
                  ? "border-emerald-200 bg-emerald-50/50"
                  : "border-border/40 bg-background/40"
              )}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  <User className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {member?.name || "Unknown"}
                  </p>
                  {isPayer && (
                    <p className="text-[10px] font-medium text-emerald-600">Payer</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isPayer ? (
                  <span className="text-sm font-semibold text-emerald-600">
                    +{formatCurrency(split.amount, expense.currency)}
                  </span>
                ) : (
                  <>
                    <span className="text-sm text-foreground/60">
                      owes {formatCurrency(split.amount, expense.currency)}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-foreground/30" />
                    <span className="text-sm font-medium text-foreground/70">
                      {payer?.name}
                    </span>
                  </>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
