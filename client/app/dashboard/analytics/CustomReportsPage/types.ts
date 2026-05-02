export interface SavedReport {
  id: string
  name: string
  description: string
  dateRange: string
  category: string
  account: string
  groupBy: string
  lastRun: string
}

export interface ReportRow {
  date: string
  category: string
  account: string
  amount: number
  type: "income" | "expense"
}

export const filterOptions = {
  dateRanges: [
    { value: "thisMonth", label: "This Month" },
    { value: "lastMonth", label: "Last Month" },
    { value: "last3Months", label: "Last 3 Months" },
    { value: "last6Months", label: "Last 6 Months" },
    { value: "thisYear", label: "This Year" },
  ],
  categories: [
    { value: "all", label: "All Categories" },
    { value: "Food", label: "Food" },
    { value: "Travel", label: "Travel" },
    { value: "Shopping", label: "Shopping" },
    { value: "Entertainment", label: "Entertainment" },
    { value: "Utilities", label: "Utilities" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Salary", label: "Salary" },
    { value: "Freelance", label: "Freelance" },
    { value: "Investments", label: "Investments" },
  ],
  accounts: [
    { value: "all", label: "All Accounts" },
    { value: "savings", label: "Savings Account" },
    { value: "checking", label: "Checking Account" },
    { value: "credit", label: "Credit Card" },
    { value: "wallet", label: "Wallet" },
  ],
  groupBy: [
    { value: "day", label: "Day" },
    { value: "month", label: "Month" },
    { value: "category", label: "Category" },
  ],
} as const
