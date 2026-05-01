import { api } from "@/app/lib/api/client"

// Types
export interface BankAccount {
  id: string
  userId: string
  name: string
  type: "bank" | "cash" | "investment" | "credit_card" | "wallet" | "other"
  balance: number
  currency: string
  institution?: string
  accountNumber?: string
  isActive: boolean
  asOfDate: string
  createdAt: string
  updatedAt: string
}

export interface CreateAccountDTO {
  name: string
  type: "bank" | "cash" | "investment" | "credit_card" | "wallet" | "other"
  balance?: number
  currency?: string
  institution?: string
  accountNumber?: string
}

export interface UpdateAccountDTO {
  name?: string
  type?: string
  balance?: number
  currency?: string
  institution?: string
  accountNumber?: string
  isActive?: boolean
}

// API functions
export const accountsApi = {
  getAll: () => api.get<BankAccount[]>("/api/accounts"),
  
  getBanks: () => api.get<BankAccount[]>("/api/accounts/banks"),
  
  getWallets: () => api.get<BankAccount[]>("/api/accounts/wallets"),
  
  getCreditCards: () => api.get<BankAccount[]>("/api/accounts/credit-cards"),
  
  getTotalBalance: () => api.get<{ totalBalance: number }>("/api/accounts/total-balance"),
  
  get: (id: string) => api.get<BankAccount>(`/api/accounts/${id}`),
  
  create: (data: CreateAccountDTO) => api.post<BankAccount>("/api/accounts", data),
  
  update: (id: string, data: UpdateAccountDTO) => api.patch<BankAccount>(`/api/accounts/${id}`, data),
  
  delete: (id: string) => api.del<void>(`/api/accounts/${id}`),
  
  updateBalance: (id: string, amount: number, operation: "add" | "subtract") => 
    api.patch<BankAccount>(`/api/accounts/${id}/balance`, { amount, operation }),
}

export default accountsApi
