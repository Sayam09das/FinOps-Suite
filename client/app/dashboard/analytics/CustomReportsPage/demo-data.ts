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

export const demoSavedReports: SavedReport[] = [
  {
    id: "1",
    name: "Monthly Food Spend",
    description: "Track food expenses monthly",
    dateRange: "thisMonth",
    category: "Food",
    account: "all",
    groupBy: "day",
    lastRun: "2 hours ago",
  },
  {
    id: "2",
    name: "Travel Expenses Q1",
    description: "Quarterly travel spending analysis",
    dateRange: "last3Months",
    category: "Travel",
    account: "all",
    groupBy: "month",
    lastRun: "1 day ago",
  },
  {
    id: "3",
    name: "Investment Income",
    description: "Income from investments and dividends",
    dateRange: "thisYear",
    category: "all",
    account: "savings",
    groupBy: "month",
    lastRun: "3 days ago",
  },
]

export const demoReportOutput: ReportRow[] = [
  { date: "2025-01-01", category: "Food", account: "Checking", amount: 450, type: "expense" },
  { date: "2025-01-02", category: "Salary", account: "Savings", amount: 55000, type: "income" },
  { date: "2025-01-03", category: "Transport", account: "Checking", amount: 120, type: "expense" },
  { date: "2025-01-04", category: "Freelance", account: "Savings", amount: 15000, type: "income" },
  { date: "2025-01-05", category: "Utilities", account: "Checking", amount: 2200, type: "expense" },
  { date: "2025-01-06", category: "Entertainment", account: "Credit Card", amount: 800, type: "expense" },
  { date: "2025-01-07", category: "Investments", account: "Savings", amount: 10000, type: "income" },
  { date: "2025-01-08", category: "Healthcare", account: "Checking", amount: 1500, type: "expense" },
]

export const filterOptions = {
  dateRanges: [
    { value: "thisMonth", label: "This Month" },
    { value: "lastMonth", label: "Last Month" },
    { value: "last3Months", label: "Last 3 Months" },
    { value: "last6Months", label: "Last 6 Months" },
    { value: "thisYear", label: "This Year" },
    { value: "custom", label: "Custom Range" },
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
}

