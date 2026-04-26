"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Calendar,
  Hash,
  StickyNote,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react"
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { cn } from "@/app/lib/utils/cn"
import { formatCurrency } from "@/app/lib/utils/number"

import type { BankAccount, AccountActivity } from "../types"

interface DetailsDrawerProps {
  account: BankAccount | null
  activities: AccountActivity[]
  isOpen: boolean
  onClose: () => void
}

export default function DetailsDrawer({ account, activities, isOpen, onClose }: DetailsDrawerProps) {
  if (!account) return null

  const accountActivities = activities.filter(() => Math.random() > 0.3)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(255,255,255,0.9))] shadow-[0_0_80px_rgba(33,49,43,0.15)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
              <h2 className="text-lg font-semibold text-foreground">Account Details</h2>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-foreground/50 transition hover:bg-foreground/5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground/8 text-base font-bold text-foreground">
                  {account.bankName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">{account.bankName}</p>
                  <p className="text-xs text-foreground/55">{account.accountType}</p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-foreground/55">Current Balance</p>
                <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                  {formatCurrency(account.balance, account.currency, "en-IN")}
                </p>
                <span
                  className={cn(
                    "mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider",
                    account.status === "active"
                      ? "border-emerald-200 bg-emerald-100 text-emerald-800"
                      : "border-amber-200 bg-amber-100 text-amber-800"
                  )}
                >
                  {account.status}
                </span>
              </div>

              <div className="mt-8">
                <p className="mb-3 text-sm font-semibold text-foreground">Balance History</p>
                <div className="h-48 rounded-2xl border border-border/60 bg-background/50 p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={account.history}>
                      <defs>
                        <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" hide />
                      <YAxis hide domain={["dataMin - 5000", "dataMax + 5000"]} />
                      <Tooltip
                        formatter={(value: number) => [
                          formatCurrency(value, account.currency, "en-IN"),
                          "Balance",
                        ]}
                        contentStyle={{ borderRadius: "1rem", border: "1px solid #e5e7eb" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="balance"
                        stroke="#10b981"
                        strokeWidth={2}
                        fill="url(#histGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="rounded-2xl border border-border/60 bg-background/50 p-4">
                  <label className="text-xs font-medium text-foreground/50">Account Number</label>
                  <div className="mt-1 flex items-center gap-2 text-sm text-foreground">
                    <Hash className="h-4 w-4 text-foreground/40" />
                    ****{account.accountNumber.slice(-4)}
                  </div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/50 p-4">
                  <label className="text-xs font-medium text-foreground/50">Last Updated</label>
                  <div className="mt-1 flex items-center gap-2 text-sm text-foreground">
                    <Calendar className="h-4 w-4 text-foreground/40" />
                    {new Date(account.lastUpdated).toLocaleString("en-IN")}
                  </div>
                </div>
                {account.notes && (
                  <div className="rounded-2xl border border-border/60 bg-background/50 p-4">
                    <label className="text-xs font-medium text-foreground/50">Notes</label>
                    <div className="mt-1 flex items-start gap-2 text-sm text-foreground/80">
                      <StickyNote className="mt-0.5 h-4 w-4 text-foreground/40" />
                      {account.notes}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <p className="mb-3 text-sm font-semibold text-foreground">Linked Transactions</p>
                <div className="space-y-2">
                  {accountActivities.slice(0, 4).map((act) => (
                    <div
                      key={act.id}
                      className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/50 px-4 py-3"
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
                          act.type === "credit"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        )}
                      >
                        {act.type === "credit" ? (
                          <ArrowDownLeft className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">{act.description}</p>
                        <p className="text-[11px] text-foreground/50">{act.date}</p>
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
                    </div>
                  ))}
                  {accountActivities.length === 0 && (
                    <p className="py-4 text-center text-sm text-foreground/45">No linked transactions</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
