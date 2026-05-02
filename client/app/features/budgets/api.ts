import { api } from "@/app/lib/api/client"
import type { Budget, BudgetStatus, CreateBudgetDTO, CategorySpend } from "./types"

// Budget API wrapper functions
export const budgetsApi = {
  // Get all budgets for current user
  getAll: () => api.get<Budget[]>("/api/budgets"),

  // Get budgets with status (budget vs actual)
  getStatus: (month?: string) => {
    const params = month ? `?month=${month}` : ""
    return api.get<BudgetStatus>(`/api/budgets/status${params}`)
  },

  // Create a new budget
  create: (data: CreateBudgetDTO) => api.post<Budget>("/api/budgets", data),

  // Delete a budget
  delete: (id: string) => api.del<void>(`/api/budgets/${id}`),

  // Get category spending data (last month, avg, highest)
  // This would need a backend endpoint - using status as fallback
  getCategorySpend: (month?: string) => {
    // Use the status endpoint which provides spending data
    const params = month ? `?month=${month}` : ""
    return api.get<BudgetStatus>(`/api/budgets/status${params}`)
  },
}

// Export category spending helper - transforms status data to spend info
export const transformStatusToSpend = (
  status: BudgetStatus,
  category: string,
  currency: string = "INR"
): CategorySpend | null => {
  const categoryData = status[category]
  if (!categoryData) return null

  // Use historical data from the status - in real implementation,
  // this would come from a dedicated endpoint
  return {
    category,
    lastMonthSpend: categoryData.spent,
    avgSpend: Math.round(categoryData.spent * 0.9), // Placeholder - would come from backend
    highestSpend: Math.round(categoryData.spent * 1.2), // Placeholder - would come from backend
    currency,
  }
}

export default budgetsApi
