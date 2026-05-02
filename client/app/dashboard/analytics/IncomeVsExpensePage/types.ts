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

export const dateRangeOptions = [
  { value: "thisMonth", label: "This Month" },
  { value: "lastMonth", label: "Last Month" },
  { value: "last3Months", label: "Last 3 Months" },
  { value: "last6Months", label: "Last 6 Months" },
  { value: "thisYear", label: "This Year" },
] as const
