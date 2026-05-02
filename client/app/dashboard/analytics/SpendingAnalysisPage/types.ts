export interface CategorySpend {
  name: string
  amount: number
  percentage: number
  color: string
  icon: string
}

export interface TrendPoint {
  label: string
  amount: number
}

export interface TrendSeries {
  daily: TrendPoint[]
  weekly: TrendPoint[]
  monthly: TrendPoint[]
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
    { value: "Education", label: "Education" },
  ],
  accounts: [
    { value: "all", label: "All Accounts" },
    { value: "savings", label: "Savings Account" },
    { value: "checking", label: "Checking Account" },
    { value: "credit", label: "Credit Card" },
    { value: "wallet", label: "Wallet" },
  ],
}
