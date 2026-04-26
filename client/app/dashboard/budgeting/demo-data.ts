import type { Budget, CategorySpend } from "./types"

export const demoBudgets: Budget[] = [
  {
    id: "b-1",
    category: "Food",
    budgetAmount: 12000,
    spentAmount: 11500,
    startMonth: "2025-01",
    recurrence: "monthly",
    currency: "INR",
    status: "active",
  },
  {
    id: "b-2",
    category: "Travel",
    budgetAmount: 8000,
    spentAmount: 3200,
    startMonth: "2025-01",
    recurrence: "monthly",
    currency: "INR",
    status: "active",
  },
  {
    id: "b-3",
    category: "Shopping",
    budgetAmount: 10000,
    spentAmount: 12800,
    startMonth: "2025-01",
    recurrence: "monthly",
    currency: "INR",
    status: "active",
  },
  {
    id: "b-4",
    category: "Entertainment",
    budgetAmount: 5000,
    spentAmount: 4800,
    startMonth: "2025-01",
    recurrence: "monthly",
    currency: "INR",
    status: "active",
  },
  {
    id: "b-5",
    category: "Utilities",
    budgetAmount: 6000,
    spentAmount: 5900,
    startMonth: "2025-01",
    recurrence: "monthly",
    currency: "INR",
    status: "active",
  },
  {
    id: "b-6",
    category: "Healthcare",
    budgetAmount: 4000,
    spentAmount: 1200,
    startMonth: "2025-01",
    recurrence: "monthly",
    currency: "INR",
    status: "active",
  },
]

export const demoCategorySpends: CategorySpend[] = [
  { category: "Food", lastMonthSpend: 11000, avgSpend: 9500, highestSpend: 15000, currency: "INR" },
  { category: "Travel", lastMonthSpend: 6000, avgSpend: 5500, highestSpend: 12000, currency: "INR" },
  { category: "Shopping", lastMonthSpend: 9000, avgSpend: 8500, highestSpend: 18000, currency: "INR" },
  { category: "Entertainment", lastMonthSpend: 4500, avgSpend: 4000, highestSpend: 8000, currency: "INR" },
  { category: "Utilities", lastMonthSpend: 5800, avgSpend: 5500, highestSpend: 7000, currency: "INR" },
  { category: "Healthcare", lastMonthSpend: 2000, avgSpend: 2500, highestSpend: 8000, currency: "INR" },
]

export const budgetCategories = [
  "Food",
  "Travel",
  "Shopping",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Education",
  "Rent",
  "Insurance",
  "Savings",
]

