"use client"

import React from "react"
import { motion } from "framer-motion"
import { Pencil, Trash2, Eye, Repeat } from "lucide-react"

import { cn } from "@/app/lib/utils/cn"
import { formatCurrency } from "@/app/lib/utils/number"

import type { Transaction } from "./types"
import { ACCOUNT_CONFIG, CATEGORY_CONFIG } from "./view-model"

interface TransactionRowProps {
  transaction: Transaction
  index: number
  isSelected: boolean
  onSelect: (id: string) => void
  onEdit: (txn: Transaction) => void
  onDelete: (id: string) => void
  onView: (txn: Transaction) => void
}

export default function TransactionRow({
  transaction,
  index,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onView,
}: TransactionRowProps) {
  const categoryConfig = CATEGORY_CONFIG[transaction.category] || CATEGORY_CONFIG["Uncategorized"]
  const accountConfig = ACCOUNT_CONFIG[transaction.account] || { name: transaction.account, icon: Repeat, color: "#9ca3af" }
  const CategoryIcon = categoryConfig.icon
  const AccountIcon = accountConfig.icon

  const isIncome = transaction.type === "income"
  const isExpense = transaction.type === "expense"
  const amountColor = isIncome ? "text-emerald-700" : isExpense ? "text-rose-600" : "text-blue-700"
  const amountPrefix = isIncome ? "+" : isExpense ? "-" : ""
  const typeBadge = isIncome
    ? "bg-emerald-100 text-emerald-800 border-emerald-200"
    : isExpense
    ? "bg-rose-100 text-rose-800 border-rose-200"
    : "bg-blue-100 text-blue-800 border-blue-200"

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.25 }}
      className={cn(
        "group border-b border-border/40 transition-colors hover:bg-white/50",
        isSelected && "bg-emerald-50/40"
      )}
    >
      {/* Checkbox */}
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(transaction.id)}
          className="h-4 w-4 rounded border-border/70 text-emerald-600 accent-emerald-600"
        />
      </td>

      {/* Date */}
      <td className="px-3 py-3">
        <div className="text-sm text-foreground/80">{transaction.date}</div>
      </td>

      {/* Description */}
      <td className="px-3 py-3">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${categoryConfig.color}18`, color: categoryConfig.color }}
          >
            <CategoryIcon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{transaction.description}</p>
            {transaction.isRecurring && (
              <span className="inline-flex items-center gap-1 rounded-full border border-violet-200/70 bg-violet-50/60 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                <Repeat className="h-2.5 w-2.5" />
                Recurring
                {transaction.nextDueDate && ` · ${transaction.nextDueDate}`}
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="px-3 py-3">
        <span
          className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium"
          style={{
            borderColor: `${categoryConfig.color}40`,
            color: categoryConfig.color,
            backgroundColor: `${categoryConfig.color}10`,
          }}
        >
          <CategoryIcon className="h-3 w-3" />
          {categoryConfig.name}
        </span>
      </td>

      {/* Account */}
      <td className="px-3 py-3">
        <div className="flex items-center gap-1.5 text-sm text-foreground/70">
          <AccountIcon className="h-3.5 w-3.5" style={{ color: accountConfig.color }} />
          {accountConfig.name}
        </div>
      </td>

      {/* Type */}
      <td className="px-3 py-3">
        <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider", typeBadge)}>
          {transaction.type}
        </span>
      </td>

      {/* Amount */}
      <td className="px-3 py-3 text-right">
        <span className={cn("text-sm font-bold", amountColor)}>
          {amountPrefix}{formatCurrency(transaction.amount, "INR", "en-IN")}
        </span>
      </td>

      {/* Actions */}
      <td className="px-3 py-3">
        <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onView(transaction)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground/50 transition hover:bg-blue-50 hover:text-blue-600"
            title="View"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onEdit(transaction)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground/50 transition hover:bg-amber-50 hover:text-amber-600"
            title="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(transaction.id)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground/50 transition hover:bg-rose-50 hover:text-rose-600"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </motion.tr>
  )
}

