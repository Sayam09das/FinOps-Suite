export interface DashboardOverview {
  totalSpend: number
  budgetUtilization: number
  monthToDateSpend: number
}

export interface DashboardStats {
  totalBudgets: number
  totalSpend: number
  transactionsThisMonth: number
  budgetUtilization: number
}

export interface Transaction {
  id: string
  date: string
  amount: number
  category: string
  description: string
}

export interface Budget {
  id: string
  name: string
  amount: number
  spent: number
  period: string
}

