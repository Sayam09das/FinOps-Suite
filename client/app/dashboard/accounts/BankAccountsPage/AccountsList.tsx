"use client"

import { motion } from "framer-motion"
import { Eye, Pencil, Trash2, AlertTriangle, Ban } from "lucide-react"

import { cn } from "@/app/lib/utils/cn"
import { formatCurrency } from "@/app/lib/utils/number"

import type { BankAccount } from "../types"

interface AccountsListProps {
  accounts: BankAccount[]
  onView: (account: BankAccount) => void
  onEdit: (account: BankAccount) => void
  onDelete: (id: string) => void
}

const accountTypeColors: Record<string, string> = {
  Savings: "bg-blue-100 text-blue-700",
  Current: "bg-emerald-100 text-emerald-700",
  "Fixed Deposit": "bg-violet-100 text-violet-700",
  "Recurring Deposit": "bg-amber-100 text-amber-700",
}

const bankInitials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

export default function AccountsList({ accounts, onView, onEdit, onDelete }: AccountsListProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      {accounts.map((acc) => {
        const isLowBalance = acc.balance < 5000 && acc.status === "active"
        const isInactive = acc.status === "inactive"

        return (
          <motion.div
            key={acc.id}
            variants={item}
            whileHover={{ y: -3 }}
            className={cn(
              "relative rounded-[1.85rem] border p-5 backdrop-blur-xl transition",
              "bg-[linear-gradient(180deg,rgba(255,255,255,0.68),rgba(255,255,255,0.34))]",
              isInactive
                ? "border-border/50 opacity-70"
                : "border-border/80 shadow-[0_16px_45px_rgba(33,49,43,0.06)]"
            )}
          >
            {isLowBalance && (
              <div className="absolute -top-2 right-4 inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-700">
                <AlertTriangle className="h-3 w-3" />
                Low Balance
              </div>
            )}
            {isInactive && (
              <div className="absolute -top-2 right-4 inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                <Ban className="h-3 w-3" />
                Inactive
              </div>
            )}

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-foreground/8 text-sm font-bold text-foreground">
                  {bankInitials(acc.bankName)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{acc.bankName}</p>
                  <span
                    className={cn(
                      "mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                      accountTypeColors[acc.accountType] || "bg-gray-100 text-gray-700"
                    )}
                  >
                    {acc.accountType}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs text-foreground/50">Balance</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                {formatCurrency(acc.balance, acc.currency, "en-IN")}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-foreground/45">
                ****{acc.accountNumber.slice(-4)}
              </p>
              <p className="text-[11px] text-foreground/40">
                Updated {new Date(acc.lastUpdated).toLocaleDateString("en-IN")}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2 border-t border-border/60 pt-4">
              <button
                onClick={() => onView(acc)}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-background/70 py-2 text-xs font-semibold text-foreground/70 transition hover:bg-white"
              >
                <Eye className="h-3.5 w-3.5" />
                View
              </button>
              <button
                onClick={() => onEdit(acc)}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-background/70 py-2 text-xs font-semibold text-foreground/70 transition hover:bg-white"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                onClick={() => onDelete(acc.id)}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-rose-50 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
