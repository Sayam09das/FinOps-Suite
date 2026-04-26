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

export const demoCategories: CategorySpend[] = [
  { name: "Food", amount: 12000, percentage: 30, color: "#EF4444", icon: "UtensilsCrossed" },
  { name: "Travel", amount: 5000, percentage: 12.5, color: "#3B82F6", icon: "Plane" },
  { name: "Shopping", amount: 9000, percentage: 22.5, color: "#10B981", icon: "ShoppingBag" },
  { name: "Entertainment", amount: 4500, percentage: 11.25, color: "#F59E0B", icon: "Film" },
  { name: "Utilities", amount: 5800, percentage: 14.5, color: "#8B5CF6", icon: "Zap" },
  { name: "Healthcare", amount: 2000, percentage: 5, color: "#EC4899", icon: "HeartPulse" },
  { name: "Education", amount: 1700, percentage: 4.25, color: "#06B6D4", icon: "GraduationCap" },
]

export const demoTrendSeries: TrendSeries = {
  daily: [
    { label: "Mon", amount: 1200 },
    { label: "Tue", amount: 850 },
    { label: "Wed", amount: 2100 },
    { label: "Thu", amount: 1500 },
    { label: "Fri", amount: 3200 },
    { label: "Sat", amount: 2800 },
    { label: "Sun", amount: 950 },
  ],
  weekly: [
    { label: "W1", amount: 8200 },
    { label: "W2", amount: 10500 },
    { label: "W3", amount: 7800 },
    { label: "W4", amount: 13500 },
  ],
  monthly: [
    { label: "Jan", amount: 32000 },
    { label: "Feb", amount: 28000 },
    { label: "Mar", amount: 35000 },
    { label: "Apr", amount: 31000 },
    { label: "May", amount: 40000 },
    { label: "Jun", amount: 36000 },
  ],
}

export const demoTotalSpend = {
  current: 40000,
  previous: 35000,
  changePercent: 14.3,
  currency: "INR" as const,
}

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

