export interface BalancePoint {
  label: string
  balance: number
}

export interface BalanceSeries {
  daily: BalancePoint[]
  weekly: BalancePoint[]
  monthly: BalancePoint[]
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

export const dateRangeOptions = [
  { value: "thisMonth", label: "This Month" },
  { value: "lastMonth", label: "Last Month" },
  { value: "last3Months", label: "Last 3 Months" },
  { value: "last6Months", label: "Last 6 Months" },
  { value: "thisYear", label: "This Year" },
] as const
