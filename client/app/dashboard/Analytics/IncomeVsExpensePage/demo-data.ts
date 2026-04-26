export interface IncomeExpensePoint {
  label: string
  income: number
  expense: number
}

export interface IncomeExpenseSeries {
  weekly: IncomeExpensePoint[]
  monthly: IncomeExpensePoint[]
  yearly: IncomeExpensePoint[]
}

export interface InsightItem {
  id: string
  message: string
  type: "warning" | "success" | "info" | "danger"
  icon: string
}

export const demoIncomeExpenseSeries: IncomeExpenseSeries = {
  weekly: [
    { label: "W1", income: 12000, expense: 8500 },
    { label: "W2", income: 15000, expense: 10200 },
    { label: "W3", income: 11000, expense: 9800 },
    { label: "W4", income: 18000, expense: 12500 },
  ],
  monthly: [
    { label: "Jan", income: 45000, expense: 32000 },
    { label: "Feb", income: 48000, expense: 35000 },
    { label: "Mar", income: 52000, expense: 38000 },
    { label: "Apr", income: 50000, expense: 42000 },
    { label: "May", income: 55000, expense: 40000 },
    { label: "Jun", income: 60000, expense: 45000 },
  ],
  yearly: [
    { label: "2020", income: 480000, expense: 380000 },
    { label: "2021", income: 520000, expense: 400000 },
    { label: "2022", income: 580000, expense: 450000 },
    { label: "2023", income: 620000, expense: 480000 },
    { label: "2024", income: 680000, expense: 510000 },
    { label: "2025", income: 720000, expense: 540000 },
  ],
}

export const demoSummary = {
  totalIncome: 60000,
  totalExpense: 45000,
  netSavings: 15000,
  previousIncome: 55000,
  previousExpense: 40000,
  previousSavings: 15000,
  currency: "INR" as const,
}

export const demoSavingsRate = {
  current: 25.0,
  previous: 27.3,
  target: 30.0,
}

export const demoInsights: InsightItem[] = [
  {
    id: "1",
    message: "Expenses increased by 12% compared to last month",
    type: "warning",
    icon: "TrendingUp",
  },
  {
    id: "2",
    message: "Savings dropped compared to last month",
    type: "danger",
    icon: "TrendingDown",
  },
  {
    id: "3",
    message: "Income is up 9% — great job!",
    type: "success",
    icon: "TrendingUp",
  },
  {
    id: "4",
    message: "You're 5% away from your savings target",
    type: "info",
    icon: "Target",
  },
  {
    id: "5",
    message: "Food expenses are 20% higher than your monthly average",
    type: "warning",
    icon: "AlertTriangle",
  },
]

export const dateRangeOptions = [
  { value: "thisMonth", label: "This Month" },
  { value: "lastMonth", label: "Last Month" },
  { value: "last3Months", label: "Last 3 Months" },
  { value: "last6Months", label: "Last 6 Months" },
  { value: "thisYear", label: "This Year" },
  { value: "custom", label: "Custom Range" },
]

