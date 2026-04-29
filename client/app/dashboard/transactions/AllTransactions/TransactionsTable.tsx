"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Inbox, AlertCircle } from "lucide-react"

import { Card } from "@/app/components/ui/card"

import type { Transaction } from "./types"
import TransactionRow from "./TransactionRow"

interface TransactionsTableProps {
  transactions: Transaction[]
  selectedIds: string[]
  onToggleSelect: (id: string) => void
  onSelectAll: () => void
  onEdit: (txn: Transaction) => void
  onDelete: (id: string) => void
  onView: (txn: Transaction) => void
}

export default function TransactionsTable({
  transactions,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onEdit,
  onDelete,
  onView,
}: TransactionsTableProps) {
  const allSelected = transactions.length > 0 && selectedIds.length === transactions.length
  const someSelected = selectedIds.length > 0 && selectedIds.length < transactions.length

  if (transactions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <Card variant="surface" padding="xl" className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground/5">
            <Inbox className="h-8 w-8 text-foreground/30" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-foreground">No transactions found</h3>
          <p className="mt-1 max-w-sm text-sm text-foreground/55">
            Try adjusting your filters or search terms to find what you are looking for.
          </p>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      <Card variant="surface" padding="none" className="overflow-hidden">
        {/* Mobile Card View */}
        <div className="block sm:hidden">
          <div className="divide-y divide-border/40">
            <AnimatePresence>
              {transactions.map((txn, index) => {
                const isSelected = selectedIds.includes(txn.id)
                return (
                  <motion.div
                    key={txn.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={`p-4 ${isSelected ? "bg-emerald-50/30" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleSelect(txn.id)}
                          className="h-4 w-4 rounded border-border/70 accent-emerald-600"
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground">{txn.description}</p>
                          <p className="text-xs text-foreground/50">{txn.date} · {txn.category}</p>
                        </div>
                      </div>
                      <span
                        className={`text-sm font-bold ${
                          txn.type === "income"
                            ? "text-emerald-700"
                            : txn.type === "expense"
                            ? "text-rose-600"
                            : "text-blue-700"
                        }`}
                      >
                        {txn.type === "income" ? "+" : txn.type === "expense" ? "-" : ""}
                        {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(txn.amount)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        txn.type === "income"
                          ? "border-emerald-200 bg-emerald-100 text-emerald-800"
                          : txn.type === "expense"
                          ? "border-rose-200 bg-rose-100 text-rose-800"
                          : "border-blue-200 bg-blue-100 text-blue-800"
                      }`}>
                        {txn.type}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="sticky top-0 z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,255,255,0.8))] backdrop-blur-sm">
              <tr className="border-b border-border/60">
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected
                    }}
                    onChange={onSelectAll}
                    className="h-4 w-4 rounded border-border/70 accent-emerald-600"
                  />
                </th>
                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-foreground/50">Date</th>
                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-foreground/50">Description</th>
                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-foreground/50">Category</th>
                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-foreground/50">Type</th>
                <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-foreground/50">Amount</th>
                <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-foreground/50">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              <AnimatePresence>
                {transactions.map((txn, index) => (
                  <TransactionRow
                    key={txn.id}
                    transaction={txn}
                    index={index}
                    isSelected={selectedIds.includes(txn.id)}
                    onSelect={onToggleSelect}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={onView}
                  />
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  )
}
