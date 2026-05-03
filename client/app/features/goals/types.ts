export interface Contribution {
  id?: string
  date: string
  amount: number
}

export interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
  linkedAccount: string
  color: string
  icon: string
  currency: string
  contributions: Contribution[]
}

export interface SavingsSummaryData {
  totalGoals: number
  totalSaved: number
  totalTarget: number
  currency: string
}

export interface SavingsDashboardData {
  summary: SavingsSummaryData
  goals: SavingsGoal[]
}

export interface DebtPaymentRecord {
  id?: string
  date: string
  amount: number
  type: "regular" | "extra"
}

export interface Debt {
  id: string
  name: string
  type: "loan" | "credit-card"
  totalAmount: number
  remainingBalance: number
  interestRate: number
  emi: number
  color: string
  currency: string
  payments: DebtPaymentRecord[]
}

export interface DebtSummaryData {
  totalDebt: number
  totalPaid: number
  remaining: number
  currency: string
}

export interface DebtDashboardData {
  summary: DebtSummaryData
  debts: Debt[]
}

export interface HoldingHistoryEntry {
  id?: string
  date: string
  value: number
}

export interface Holding {
  id: string
  name: string
  type: "stock" | "mutual-fund"
  investedAmount: number
  currentValue: number
  quantity: number
  buyPrice: number
  color: string
  currency: string
  history: HoldingHistoryEntry[]
}

export interface InvestmentSummaryData {
  totalInvested: number
  currentValue: number
  currency: string
}

export interface InvestmentDashboardData {
  summary: InvestmentSummaryData
  holdings: Holding[]
  portfolioHistory: Array<{ date: string; value: number }>
}
