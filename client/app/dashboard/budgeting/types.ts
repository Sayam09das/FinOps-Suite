export interface Budget {
  id: string
  category: string
  categoryIcon?: string
  budgetAmount: number
  spentAmount: number
  startMonth: string
  recurrence: "monthly" | "quarterly" | "yearly"
  currency: string
  status: "active" | "paused" | "completed"
}

export interface CategorySpend {
  category: string
  lastMonthSpend: number
  avgSpend: number
  highestSpend: number
  currency: string
}

