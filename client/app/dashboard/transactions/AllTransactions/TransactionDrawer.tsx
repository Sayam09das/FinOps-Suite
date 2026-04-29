"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Pencil,
  Trash2,
  Calendar,
  Hash,
  Save,
} from "lucide-react"

import { cn } from "@/app/lib/utils/cn"
import { formatCurrency } from "@/app/lib/utils/number"

import type { Transaction } from "./types"
import { CATEGORY_CONFIG } from "./view-model"

interface TransactionDrawerProps {
  transaction: Transaction | null
  isOpen: boolean
  onClose: () => void
  onSave?: (txn: Transaction) => void
  onDelete?: (id: string) => void
}

export default function TransactionDrawer({
  transaction,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: TransactionDrawerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<Transaction>>({})

  if (!transaction) return null

  const categoryConfig = CATEGORY_CONFIG[transaction.category] || CATEGORY_CONFIG["Uncategorized"]
  const CategoryIcon = categoryConfig.icon

  const isIncome = transaction.type === "income"
  const isExpense = transaction.type === "expense"
  const amountColor = isIncome ? "text-emerald-700" : isExpense ? "text-rose-600" : "text-blue-700"

  const handleSave = () => {
    onSave?.({ ...transaction, ...editForm } as Transaction)
    setIsEditing(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-[2px]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(255,255,255,0.9))] shadow-[0_0_80px_rgba(33,49,43,0.15)] backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
              <h2 className="text-lg font-semibold text-foreground">
                {isEditing ? "Edit Transaction" : "Transaction Details"}
              </h2>
              <div className="flex items-center gap-2">
                {!isEditing && (
                  <>
                    <button
                      onClick={() => { setIsEditing(true); setEditForm({}) }}
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-foreground/50 transition hover:bg-amber-50 hover:text-amber-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => { onDelete?.(transaction.id); onClose() }}
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-foreground/50 transition hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={onClose}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-foreground/50 transition hover:bg-foreground/5"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* Amount */}
              <div className="text-center">
                <p className={cn("text-4xl font-bold tracking-tight", amountColor)}>
                  {isIncome ? "+" : isExpense ? "-" : ""}
                  {formatCurrency(transaction.amount, "INR", "en-IN")}
                </p>
                <span
                  className={cn(
                    "mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider",
                    isIncome
                      ? "border-emerald-200 bg-emerald-100 text-emerald-800"
                      : isExpense
                      ? "border-rose-200 bg-rose-100 text-rose-800"
                      : "border-blue-200 bg-blue-100 text-blue-800"
                  )}
                >
                  {transaction.type}
                </span>
              </div>

              {/* Details */}
              <div className="mt-8 space-y-4">
                {/* Description */}
                <div className="rounded-2xl border border-border/60 bg-background/50 p-4">
                  <label className="text-xs font-medium text-foreground/50">Description</label>
                  {isEditing ? (
                    <input
                      value={editForm.description ?? transaction.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border/70 bg-white/80 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60"
                    />
                  ) : (
                    <p className="mt-1 text-sm font-medium text-foreground">{transaction.description}</p>
                  )}
                </div>

                {/* Category */}
                <div className="rounded-2xl border border-border/60 bg-background/50 p-4">
                  <label className="text-xs font-medium text-foreground/50">Category</label>
                  <div className="mt-1 flex items-center gap-2">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${categoryConfig.color}18`, color: categoryConfig.color }}
                    >
                      <CategoryIcon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{categoryConfig.name}</span>
                  </div>
                </div>

                {/* Date */}
                <div className="rounded-2xl border border-border/60 bg-background/50 p-4">
                  <label className="text-xs font-medium text-foreground/50">Date</label>
                  <div className="mt-1 flex items-center gap-2 text-sm text-foreground">
                    <Calendar className="h-4 w-4 text-foreground/50" />
                    {transaction.date}
                  </div>
                </div>

                {/* ID */}
                <div className="rounded-2xl border border-border/60 bg-background/50 p-4">
                  <label className="text-xs font-medium text-foreground/50">Transaction ID</label>
                  <div className="mt-1 flex items-center gap-2 text-sm text-foreground/70">
                    <Hash className="h-4 w-4 text-foreground/40" />
                    {transaction.id}
                  </div>
                </div>

                {/* Note */}
                {transaction.note && (
                  <div className="rounded-2xl border border-border/60 bg-background/50 p-4">
                    <label className="text-xs font-medium text-foreground/50">Note</label>
                    {isEditing ? (
                      <textarea
                        value={editForm.note ?? transaction.note ?? ""}
                        onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                        rows={3}
                        className="mt-1 w-full rounded-lg border border-border/70 bg-white/80 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-foreground/80">{transaction.note}</p>
                    )}
                  </div>
                )}

              </div>
            </div>

            {/* Footer actions */}
            {isEditing && (
              <div className="border-t border-border/60 px-6 py-4">
                <button
                  onClick={handleSave}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
