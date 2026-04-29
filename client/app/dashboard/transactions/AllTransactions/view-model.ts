"use client"

import {
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  Film,
  Heart,
  GraduationCap,
  Plane,
  Home,
  Smartphone,
  Briefcase,
  Gift,
  TrendingUp,
  AlertCircle,
} from "lucide-react"

import type { CategoryConfig, Transaction, TransactionFilterState, TransactionSummary } from "./types"
import type { Transaction as ApiTransaction } from "@/app/features/dashboard/types/dashboard"

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  "Food & Dining": { name: "Food & Dining", icon: Utensils, color: "#d27768", bgColor: "bg-orange-100" },
  Transport: { name: "Transport", icon: Car, color: "#5687cc", bgColor: "bg-blue-100" },
  Shopping: { name: "Shopping", icon: ShoppingBag, color: "#8d6ad8", bgColor: "bg-violet-100" },
  Utilities: { name: "Utilities", icon: Zap, color: "#d0a24d", bgColor: "bg-amber-100" },
  Entertainment: { name: "Entertainment", icon: Film, color: "#e85d9a", bgColor: "bg-pink-100" },
  Healthcare: { name: "Healthcare", icon: Heart, color: "#c66a6a", bgColor: "bg-rose-100" },
  Education: { name: "Education", icon: GraduationCap, color: "#4f9e96", bgColor: "bg-teal-100" },
  Travel: { name: "Travel", icon: Plane, color: "#2f7d67", bgColor: "bg-emerald-100" },
  Rent: { name: "Rent", icon: Home, color: "#d27768", bgColor: "bg-orange-100" },
  Subscriptions: { name: "Subscriptions", icon: Smartphone, color: "#5687cc", bgColor: "bg-blue-100" },
  Salary: { name: "Salary", icon: Briefcase, color: "#2f7d67", bgColor: "bg-emerald-100" },
  Freelance: { name: "Freelance", icon: TrendingUp, color: "#4f9e96", bgColor: "bg-teal-100" },
  Investment: { name: "Investment", icon: TrendingUp, color: "#d0a24d", bgColor: "bg-amber-100" },
  Gifts: { name: "Gifts", icon: Gift, color: "#e85d9a", bgColor: "bg-pink-100" },
  Uncategorized: { name: "Uncategorized", icon: AlertCircle, color: "#9ca3af", bgColor: "bg-gray-100" },
}

export function mapApiTransaction(transaction: ApiTransaction): Transaction {
  const date = transaction.date || transaction.createdAt || new Date().toISOString()
  const type = transaction.type === "income" ? "income" : "expense"

  return {
    id: transaction.id,
    date: date.slice(0, 10),
    description: transaction.description || transaction.note || transaction.category,
    category: transaction.category || "Uncategorized",
    type,
    amount: Number(transaction.amount) || 0,
    note: transaction.note || undefined,
    createdAt: transaction.createdAt || date,
  }
}

export function filterTransactions(
  transactions: Transaction[],
  filters: TransactionFilterState
): Transaction[] {
  return transactions.filter((txn) => {
    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase()
      const match =
        txn.description.toLowerCase().includes(search) ||
        txn.category.toLowerCase().includes(search) ||
        txn.amount.toString().includes(search) ||
        (txn.note?.toLowerCase().includes(search) ?? false)
      if (!match) return false
    }

    // Date range filter
    if (filters.dateRange !== "custom" && filters.dateRange !== "all") {
      const txnDate = new Date(txn.date)
      const now = new Date()
      let startDate: Date

      switch (filters.dateRange) {
        case "this_month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        case "last_month":
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
          break
        case "this_quarter":
          const quarter = Math.floor(now.getMonth() / 3)
          startDate = new Date(now.getFullYear(), quarter * 3, 1)
          break
        case "this_year":
          startDate = new Date(now.getFullYear(), 0, 1)
          break
        default:
          startDate = new Date(0)
      }

      if (txnDate < startDate) return false
    }

    if (filters.customDateFrom && new Date(txn.date) < new Date(filters.customDateFrom)) return false
    if (filters.customDateTo && new Date(txn.date) > new Date(filters.customDateTo)) return false

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(txn.category)) return false

    // Type filter
    if (filters.types.length > 0 && !filters.types.includes(txn.type)) return false

    // Smart filter
    if (filters.smartFilter === "high_spending" && txn.amount < 5000) return false
    if (filters.smartFilter === "uncategorized" && txn.category !== "Uncategorized") return false

    return true
  })
}

export function computeSummary(transactions: Transaction[]): TransactionSummary {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  return {
    totalTransactions: transactions.length,
    totalIncome,
    totalExpense,
    net: totalIncome - totalExpense,
  }
}

export const defaultFilters: TransactionFilterState = {
  search: "",
  dateRange: "this_month",
  categories: [],
  types: [],
  smartFilter: "all",
}
