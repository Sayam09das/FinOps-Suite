"use client"

import { motion } from "framer-motion"
import { Copy, Lightbulb, Receipt } from "lucide-react"

import { cn } from "@/app/lib/utils/cn"
import { useTransactionsQuery } from "@/app/lib/api/queries"
import { mapApiTransaction } from "../AllTransactions/view-model"
import type { Transaction } from "../AllTransactions/types"

interface SmartSuggestionsProps {
  onDuplicate: (txn: Transaction) => void
}

export default function SmartSuggestions({ onDuplicate }: SmartSuggestionsProps) {
  const { data: transactionsResponse } = useTransactionsQuery(1, true, 5)
  const source = Array.isArray(transactionsResponse)
    ? transactionsResponse
    : transactionsResponse?.data || []
  const recentTransactions = source.map(mapApiTransaction).slice(0, 5)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100">
          <Lightbulb className="h-4 w-4 text-amber-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Smart Suggestions</h3>
          <p className="text-xs text-foreground/50">Recently used & quick actions</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-foreground/40">Last 5 transactions</p>
        {recentTransactions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/60 bg-background/50 px-3 py-6 text-center">
            <p className="text-sm font-medium text-foreground/55">No backend transactions yet</p>
          </div>
        ) : recentTransactions.map((txn, i) => (
          <motion.div
            key={txn.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group flex items-center gap-3 rounded-xl border border-border/50 bg-background/50 px-3 py-2.5 transition hover:border-primary/30 hover:bg-white/70"
          >
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              txn.type === "income" ? "bg-emerald-100" : "bg-rose-100"
            )}>
              <Receipt className={cn(
                "h-3.5 w-3.5",
                txn.type === "income" ? "text-emerald-600" : "text-rose-600"
              )} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{txn.description}</p>
              <p className="text-xs text-foreground/50">{txn.category}</p>
            </div>
            <div className="text-right">
              <p className={cn(
                "text-sm font-semibold",
                txn.type === "income" ? "text-emerald-600" : "text-rose-600"
              )}>
                {txn.type === "income" ? "+" : "-"}₹{txn.amount.toLocaleString("en-IN")}
              </p>
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDuplicate(txn)}
              className="opacity-0 transition group-hover:opacity-100"
              title="Duplicate"
            >
              <Copy className="h-4 w-4 text-foreground/50 hover:text-primary" />
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
