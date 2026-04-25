import type { LucideIcon } from "lucide-react"

export type TransactionType = "income" | "expense" | "transfer"
export type TransactionTone = "positive" | "warning" | "danger" | "neutral"

export interface Transaction {
  id: string
  date: string
  description: string
  category: string
  account: string
  type: TransactionType
  amount: number
  note?: string
  tags?: string[]
  isRecurring?: boolean
  nextDueDate?: string
  createdAt: string
}

export interface TransactionFilterState {
  search: string
  dateRange: "all" | "this_month" | "last_month" | "this_quarter" | "this_year" | "custom"
  customDateFrom?: string
  customDateTo?: string
  categories: string[]
  accounts: string[]
  types: TransactionType[]
  smartFilter: "all" | "high_spending" | "recurring" | "uncategorized"
}

export interface TransactionSummary {
  totalTransactions: number
  totalIncome: number
  totalExpense: number
  net: number
}

export interface CategoryConfig {
  name: string
  icon: LucideIcon
  color: string
  bgColor: string
}

export interface AccountConfig {
  name: string
  icon: LucideIcon
  color: string
}

