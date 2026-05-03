"use client"

import { motion } from "framer-motion"
import {
  ArrowDownLeft,
  ArrowUpRight,
  Scale,
  CheckCircle2,
} from "lucide-react"
import { formatCurrency } from "@/app/lib/utils/number"
import { cn } from "@/app/lib/utils/cn"

interface SettlementProps {
  youOwe: number
  youAreOwed: number
  currency: string
}

export default function Settlement({
  youOwe,
  youAreOwed,
  currency,
}: SettlementProps) {
  const netBalance = youAreOwed - youOwe
  const isPositive = netBalance > 0
  const isSettled = youOwe === 0 && youAreOwed === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-border/60 bg-background/60 p-5 shadow-sm backdrop-blur-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
            Settlement
          </h3>
        </div>
        {isSettled && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
            <CheckCircle2 className="h-3 w-3" />
            All settled
          </span>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* You owe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className={cn(
            "flex flex-col rounded-2xl border p-4",
            youOwe > 0
              ? "border-rose-200 bg-rose-50/40"
              : "border-border/40 bg-background/40"
          )}
        >
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100">
              <ArrowDownLeft className="h-4 w-4 text-rose-600" />
            </div>
            <span className="text-xs font-medium uppercase tracking-wider text-foreground/50">
              You owe
            </span>
          </div>
          <p
            className={cn(
              "mt-2 text-2xl font-bold",
              youOwe > 0 ? "text-rose-600" : "text-foreground/30"
            )}
          >
            {formatCurrency(youOwe, currency)}
          </p>
        </motion.div>

        {/* You are owed */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.18 }}
          className={cn(
            "flex flex-col rounded-2xl border p-4",
            youAreOwed > 0
              ? "border-emerald-200 bg-emerald-50/40"
              : "border-border/40 bg-background/40"
          )}
        >
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
              <ArrowUpRight className="h-4 w-4 text-emerald-600" />
            </div>
            <span className="text-xs font-medium uppercase tracking-wider text-foreground/50">
              You are owed
            </span>
          </div>
          <p
            className={cn(
              "mt-2 text-2xl font-bold",
              youAreOwed > 0 ? "text-emerald-600" : "text-foreground/30"
            )}
          >
            {formatCurrency(youAreOwed, currency)}
          </p>
        </motion.div>
      </div>

      {/* Net balance */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.25 }}
        className={cn(
          "mt-3 rounded-2xl border p-4 text-center",
          isPositive
            ? "border-emerald-200 bg-emerald-50/30"
            : isSettled
            ? "border-border/40 bg-background/40"
            : "border-rose-200 bg-rose-50/30"
        )}
      >
        <p className="text-xs font-medium uppercase tracking-wider text-foreground/50">
          Net Balance
        </p>
        <p
          className={cn(
            "mt-1 text-xl font-bold",
            isPositive
              ? "text-emerald-600"
              : isSettled
              ? "text-foreground/30"
              : "text-rose-600"
          )}
        >
          {isPositive ? "+" : ""}
          {formatCurrency(Math.abs(netBalance), currency)}
        </p>
        <p className="text-xs text-foreground/40">
          {isPositive
            ? "You are owed money overall"
            : isSettled
            ? "All balances are settled"
            : "You owe money overall"}
        </p>
      </motion.div>

      <p className="mt-4 text-center text-xs text-foreground/45">
        Group balances refresh automatically from live data every few seconds.
      </p>
    </motion.div>
  )
}
