export interface SavingsContributionDTO {
  date?: string
  amount: number
}

export interface CreateSavingsGoalDTO {
  name: string
  targetAmount: number
  currentAmount?: number
  deadline: string
  linkedAccount: string
  color?: string
  icon?: string
  currency?: string
}

export interface CreateDebtDTO {
  name: string
  type: "loan" | "credit-card"
  totalAmount: number
  remainingBalance: number
  interestRate: number
  emi: number
  color?: string
  currency?: string
}

export interface RecordDebtPaymentDTO {
  amount: number
  type?: "regular" | "extra"
  date?: string
}

export interface CreateInvestmentDTO {
  name: string
  type: "stock" | "mutual-fund"
  investedAmount: number
  currentValue: number
  quantity: number
  buyPrice: number
  color?: string
  currency?: string
}
