"use client"

import React from "react"
import { motion } from "framer-motion"
import { Search, Calendar, Tag, CreditCard, Repeat, X, Filter, Sparkles } from "lucide-react"

import { Card } from "@/app/components/ui/card"
import { cn } from "@/app/lib/utils/cn"

import type { TransactionFilterState, TransactionType } from "./types"
import { ACCOUNT_CONFIG, CATEGORY_CONFIG } from "./view-model"

interface TransactionsFiltersProps {
  filters: TransactionFilterState
  onChange: (filters: TransactionFilterState) => void
}

const dateRangeOptions = [
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "this_quarter", label: "This Quarter" },
  { value: "this_year", label: "This Year" },
  { value: "all", label: "All Time" },
] as const

const typeOptions: { value: TransactionType; label: string; color: string }[] = [
  { value: "income", label: "Income", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { value: "expense", label: "Expense", color: "bg-rose-100 text-rose-700 border-rose-200" },
  { value: "transfer", label: "Transfer", color: "bg-blue-100 text-blue-700 border-blue-200" },
]

const smartFilters = [
  { value: "all", label: "All Transactions" },
  { value: "high_spending", label: "High Spending" },
  { value: "recurring", label: "Recurring" },
  { value: "uncategorized", label: "Uncategorized" },
] as const

export default function TransactionsFilters({ filters, onChange }: TransactionsFiltersProps) {
  const hasActiveFilters =
    filters.search ||
    filters.categories.length > 0 ||
    filters.accounts.length > 0 ||
    filters.types.length > 0 ||
    filters.smartFilter !== "all" ||
    filters.dateRange !== "this_month"

  const toggleArray = <T,>(arr: T[], val: T) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]

  const resetFilters = () => {
    onChange({
      search: "",
      dateRange: "this_month",
      categories: [],
      accounts: [],
      types: [],
      smartFilter: "all",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
    >
      <Card variant="surface" padding="lg">
        {/* Search + Date Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => onChange({ ...filters, search: e.target.value })}
              className="h-10 w-full rounded-xl border border-border/70 bg-background/60 pl-9 pr-4 text-sm text-foreground outline-none transition placeholder:text-foreground/40 focus:border-primary/60 focus:bg-white/80"
            />
          </div>

          {/* Date Range */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
            <select
              value={filters.dateRange}
              onChange={(e) =>
                onChange({ ...filters, dateRange: e.target.value as TransactionFilterState["dateRange"] })
              }
              className="h-10 appearance-none rounded-xl border border-border/70 bg-background/60 pl-9 pr-8 text-sm text-foreground outline-none transition focus:border-primary/60 focus:bg-white/80"
            >
              {dateRangeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filters */}
          <div className="flex gap-1.5">
            {typeOptions.map((type) => {
              const active = filters.types.includes(type.value)
              return (
                <button
                  key={type.value}
                  onClick={() => onChange({ ...filters, types: toggleArray(filters.types, type.value) })}
                  className={cn(
                    "h-10 rounded-xl border px-3.5 text-xs font-semibold transition",
                    active ? type.color : "border-border/70 bg-background/60 text-foreground/60 hover:bg-white/80"
                  )}
                >
                  {type.label}
                </button>
              )
            })}
          </div>

          {/* Smart Filter */}
          <div className="relative">
            <Sparkles className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
            <select
              value={filters.smartFilter}
              onChange={(e) =>
                onChange({
                  ...filters,
                  smartFilter: e.target.value as TransactionFilterState["smartFilter"],
                })
              }
              className="h-10 appearance-none rounded-xl border border-border/70 bg-background/60 pl-9 pr-8 text-sm text-foreground outline-none transition focus:border-primary/60 focus:bg-white/80"
            >
              {smartFilters.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset */}
          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={resetFilters}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-rose-200/70 bg-rose-50/60 px-3.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100/80"
            >
              <X className="h-3.5 w-3.5" />
              Reset
            </motion.button>
          )}
        </div>

        {/* Category + Account Chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {/* Category chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <Tag className="h-3.5 w-3.5 text-foreground/40" />
            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
              const active = filters.categories.includes(key)
              return (
                <button
                  key={key}
                  onClick={() =>
                    onChange({ ...filters, categories: toggleArray(filters.categories, key) })
                  }
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition",
                    active
                      ? "border-current bg-current/10"
                      : "border-border/60 bg-background/50 text-foreground/55 hover:bg-white/70"
                  )}
                  style={active ? { borderColor: config.color, color: config.color, backgroundColor: `${config.color}15` } : {}}
                >
                  <config.icon className="h-3 w-3" />
                  {config.name}
                </button>
              )
            })}
          </div>

          {/* Account chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <CreditCard className="h-3.5 w-3.5 text-foreground/40" />
            {Object.entries(ACCOUNT_CONFIG).map(([key, config]) => {
              const active = filters.accounts.includes(key)
              return (
                <button
                  key={key}
                  onClick={() =>
                    onChange({ ...filters, accounts: toggleArray(filters.accounts, key) })
                  }
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition",
                    active
                      ? "border-current bg-current/10"
                      : "border-border/60 bg-background/50 text-foreground/55 hover:bg-white/70"
                  )}
                  style={active ? { borderColor: config.color, color: config.color, backgroundColor: `${config.color}15` } : {}}
                >
                  {config.name}
                </button>
              )
            })}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

