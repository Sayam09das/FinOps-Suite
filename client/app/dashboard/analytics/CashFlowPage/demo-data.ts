export interface BalancePoint {
  label: string
  balance: number
}

export interface BalanceSeries {
  daily: BalancePoint[]
  weekly: BalancePoint[]
  monthly: BalancePoint[]
}

export interface FlowItem {
  label: string
  amount: number
  color: string
}

export interface BreakdownItem {
  name: string
  amount: number
  percentage: number
  color: string
}

export interface CashFlowSummaryData {
  openingBalance: number
  moneyIn: number
  moneyOut: number
  closingBalance: number
  previousOpeningBalance: number
  previousMoneyIn: number
  previousMoneyOut: number
  previousClosingBalance: number
  currency: string
}

export const demoCashFlowSummary: CashFlowSummaryData = {
  openingBalance: 125000,
  moneyIn: 85000,
  moneyOut: 62000,
  closingBalance: 148000,
  previousOpeningBalance: 110000,
  previousMoneyIn: 78000,
  previousMoneyOut: 58000,
  previousClosingBalance: 130000,
  currency: "INR",
}

export const demoBalanceSeries: BalanceSeries = {
  daily: [
    { label: "Mon", balance: 125000 },
    { label: "Tue", balance: 127500 },
    { label: "Wed", balance: 132000 },
    { label: "Thu", balance: 130500 },
    { label: "Fri", balance: 138000 },
    { label: "Sat", balance: 145000 },
    { label: "Sun", balance: 148000 },
  ],
  weekly: [
    { label: "W1", balance: 118000 },
    { label: "W2", balance: 125000 },
    { label: "W3", balance: 132000 },
    { label: "W4", balance: 148000 },
  ],
  monthly: [
    { label: "Jan", balance: 98000 },
    { label: "Feb", balance: 105000 },
    { label: "Mar", balance: 112000 },
    { label: "Apr", balance: 125000 },
    { label: "May", balance: 130000 },
    { label: "Jun", balance: 148000 },
  ],
}

export const demoIncomeSources: BreakdownItem[] = [
  { name: "Salary", amount: 55000, percentage: 64.7, color: "#10B981" },
  { name: "Freelance", amount: 15000, percentage: 17.6, color: "#3B82F6" },
  { name: "Investments", amount: 10000, percentage: 11.8, color: "#8B5CF6" },
  { name: "Rental", amount: 5000, percentage: 5.9, color: "#F59E0B" },
]

export const demoExpenseCategories: BreakdownItem[] = [
  { name: "Housing", amount: 22000, percentage: 35.5, color: "#EF4444" },
  { name: "Food", amount: 12000, percentage: 19.4, color: "#F59E0B" },
  { name: "Transport", amount: 8000, percentage: 12.9, color: "#3B82F6" },
  { name: "Utilities", amount: 7000, percentage: 11.3, color: "#8B5CF6" },
  { name: "Entertainment", amount: 8000, percentage: 12.9, color: "#EC4899" },
  { name: "Healthcare", amount: 5000, percentage: 8.0, color: "#06B6D4" },
]

export const dateRangeOptions = [
  { value: "thisMonth", label: "This Month" },
  { value: "lastMonth", label: "Last Month" },
  { value: "last3Months", label: "Last 3 Months" },
  { value: "last6Months", label: "Last 6 Months" },
  { value: "thisYear", label: "This Year" },
  { value: "custom", label: "Custom Range" },
]

