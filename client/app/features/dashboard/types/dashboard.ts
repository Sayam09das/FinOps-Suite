export interface DashboardOverview {
  income: number
  expense: number
  balance: number
  recentTransactions: Transaction[]
  categoryAnalytics: Record<string, number>
  budgets?: Record<string, DashboardBudgetStatus>
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
  createdAt?: string
  amount: number
  category: string
  description: string
  note?: string | null
  type: 'income' | 'expense' | string
}

export interface Budget {
  id: string
  category: string
  amount: number
  month: string
  createdAt?: string
  updatedAt?: string
}

export interface DashboardBudgetStatus {
  budget: number
  spent: number
  remaining: number
  alert?: string
}
