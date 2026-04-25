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
  Landmark,
  Wallet,
  CreditCard,
  TrendingUp,
  Banknote,
  AlertCircle,
  type LucideIcon,
} from "lucide-react"

import type { CategoryConfig, Transaction, TransactionFilterState, TransactionSummary } from "./types"

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

export const ACCOUNT_CONFIG: Record<string, { name: string; icon: LucideIcon; color: string }> = {
  "Primary Bank": { name: "Primary Bank", icon: Landmark, color: "#2f7d67" },
  "Cash Wallet": { name: "Cash Wallet", icon: Wallet, color: "#d0a24d" },
  "Credit Card": { name: "Credit Card", icon: CreditCard, color: "#d27768" },
  "Investment Account": { name: "Investment Account", icon: TrendingUp, color: "#5687cc" },
  "Savings": { name: "Savings", icon: Banknote, color: "#4f9e96" },
}

const CATEGORIES = Object.keys(CATEGORY_CONFIG)
const ACCOUNTS = Object.keys(ACCOUNT_CONFIG)

const DESCRIPTIONS: Record<string, string[]> = {
  "Food & Dining": ["Swiggy Order", "Zomato Delivery", "Restaurant Dinner", "Starbucks Coffee", "Grocery Store", "Domino's Pizza", "Local Dhaba"],
  Transport: ["Uber Ride", "Ola Cab", "Petrol Refill", "Metro Recharge", "Auto Rickshaw", "Train Ticket", "Flight Booking"],
  Shopping: ["Amazon Purchase", "Flipkart Order", "Myntra Shopping", "Local Market", "Electronics Store", "Clothing Store"],
  Utilities: ["Electricity Bill", "Water Bill", "Internet Bill", "Gas Bill", "Mobile Recharge", "DTH Recharge"],
  Entertainment: ["Netflix Subscription", "Spotify Premium", "Movie Tickets", "Concert Tickets", "Game Purchase", "YouTube Premium"],
  Healthcare: ["Pharmacy", "Doctor Consultation", "Health Checkup", "Gym Membership", "Dental Visit"],
  Education: ["Course Fee", "Book Purchase", "Online Course", "Coaching Fee", "Exam Fee"],
  Travel: ["Hotel Booking", "Flight Ticket", "Train Reservation", "Cab Booking", "Tour Package"],
  Rent: ["Monthly Rent", "Maintenance Fee", "Society Charges", "Parking Fee"],
  Subscriptions: ["AWS Bill", "GitHub Pro", "Notion Premium", "Figma Pro", "Adobe CC"],
  Salary: ["Monthly Salary", "Bonus Payment", "Incentive", "Commission"],
  Freelance: ["Client Payment", "Project Fee", "Consulting Fee", "Retainer"],
  Investment: ["Stock Purchase", "Mutual Fund SIP", "FD Deposit", "Crypto Buy", "Gold Purchase"],
  Gifts: ["Birthday Gift", "Wedding Gift", "Festival Gift", "Charity Donation"],
  Uncategorized: ["Miscellaneous", "Unknown", "Adjustment", "Refund"],
}

function generateTransactions(count: number): Transaction[] {
  const transactions: Transaction[] = []
  const now = new Date()

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 90)
    const date = new Date(now)
    date.setDate(date.getDate() - daysAgo)

    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]
    const type: "income" | "expense" | "transfer" =
      category === "Salary" || category === "Freelance" || category === "Investment"
        ? "income"
        : category === "Uncategorized"
        ? Math.random() > 0.5 ? "income" : "expense"
        : "expense"

    const baseAmount = type === "income"
      ? 15000 + Math.random() * 70000
      : 50 + Math.random() * 8000

    const amount = Math.round(baseAmount)
    const descriptions = DESCRIPTIONS[category] || ["Transaction"]
    const description = descriptions[Math.floor(Math.random() * descriptions.length)]
    const account = ACCOUNTS[Math.floor(Math.random() * ACCOUNTS.length)]

    const isRecurring = Math.random() > 0.85
    const nextDueDate = isRecurring
      ? new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
      : undefined

    transactions.push({
      id: `txn_${i + 1}`,
      date: date.toISOString().split("T")[0],
      description,
      category,
      account,
      type,
      amount,
      note: Math.random() > 0.7 ? `Note for ${description}` : undefined,
      tags: Math.random() > 0.6 ? ["#personal", "#monthly"] : undefined,
      isRecurring,
      nextDueDate,
      createdAt: date.toISOString(),
    })
  }

  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export const allTransactions = generateTransactions(152)

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
        txn.account.toLowerCase().includes(search) ||
        txn.amount.toString().includes(search) ||
        (txn.note?.toLowerCase().includes(search) ?? false) ||
        (txn.tags?.some((t) => t.toLowerCase().includes(search)) ?? false)
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

    // Account filter
    if (filters.accounts.length > 0 && !filters.accounts.includes(txn.account)) return false

    // Type filter
    if (filters.types.length > 0 && !filters.types.includes(txn.type)) return false

    // Smart filter
    if (filters.smartFilter === "high_spending" && txn.amount < 5000) return false
    if (filters.smartFilter === "recurring" && !txn.isRecurring) return false
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
  accounts: [],
  types: [],
  smartFilter: "all",
}

