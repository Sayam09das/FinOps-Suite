// Budget types matching backend

export interface Budget {
  id: string
  userId: string
  category: string
  amount: number
  month: string // YYYY-MM format
  createdAt?: string
  updatedAt?: string
}

export interface BudgetStatus {
  [category: string]: {
    budget: number
    spent: number
    remaining: number
  }
}

export interface CreateBudgetDTO {
  category: string
  amount: number
  month: string
}

export interface CategorySpend {
  category: string
  lastMonthSpend: number
  avgSpend: number
  highestSpend: number
  currency: string
}

// For query parameters
export interface BudgetStatusQuery {
  month?: string
}

export interface CategorySpendQuery {
  category?: string
}
