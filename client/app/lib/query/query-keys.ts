// import { ENDPOINTS } from "../constants/api"

export const queryKeys = {
  // Auth
  auth: ["auth"] as const,
  me: () => [...queryKeys.auth, "me"] as const,
  
  // Users
  users: () => ["users"] as const,
  user: (id: string) => [...queryKeys.users(), id] as const,
  usersList: (filters?: any) => [...queryKeys.users(), "list", filters] as const,
  
  // Budgets
  budgets: () => ["budgets"] as const,
  budget: (id: string) => [...queryKeys.budgets(), id] as const,
  budgetsList: (filters?: any) => [...queryKeys.budgets(), "list", filters] as const,
  
  // Transactions
  transactions: () => ["transactions"] as const,
  transaction: (id: string) => [...queryKeys.transactions(), id] as const,
  transactionsList: (filters?: any) => [...queryKeys.transactions(), "list", filters] as const,
  
  // Dashboard
  dashboard: () => ["dashboard"] as const,
  dashboardOverview: () => [...queryKeys.dashboard(), "overview"] as const,
  dashboardAnalytics: (params?: any) => [...queryKeys.dashboard(), "analytics", params] as const,
  
  // Infinite queries
  infiniteTransactions: (filters?: any) => [...queryKeys.transactions(), "infinite", filters] as const,
  
  // All
  all: ["all"] as const,
} as const

// Types
export type QueryKey = 
  | readonly ["all"]
  | readonly [...QueryKeyArray, string | number | undefined | null]
  
type QueryKeyArray = 
  | readonly ["auth"]
  | readonly [...readonly ["auth"], "me"]
  | readonly ["users"]
  | readonly [...readonly ["users"], string]
  | readonly [...readonly ["users"], "list", any]
  | readonly ["budgets"]
  | readonly [...readonly ["budgets"], string]
  | readonly [...readonly ["budgets"], "list", any]
  | readonly ["transactions"]
  | readonly [...readonly ["transactions"], string]
  | readonly [...readonly ["transactions"], "list", any]
  | readonly ["dashboard"]
  | readonly [...readonly ["dashboard"], "overview"]
  | readonly [...readonly ["dashboard"], "analytics", any]
  | readonly [...readonly ["transactions"], "infinite", any]
