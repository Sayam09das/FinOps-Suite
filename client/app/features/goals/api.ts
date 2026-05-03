"use client"

import { api } from "@/app/lib/api/client"
import { ENDPOINTS } from "@/app/lib/api/endpoints"
import type { DebtDashboardData, InvestmentDashboardData, SavingsDashboardData } from "./types"

export const goalsApi = {
  getSavings: () => api.get<SavingsDashboardData>(ENDPOINTS.GOALS.SAVINGS),
  createSavings: (data: {
    name: string
    targetAmount: number
    currentAmount?: number
    deadline: string
    linkedAccount: string
    color?: string
    icon?: string
    currency?: string
  }) => api.post(ENDPOINTS.GOALS.SAVINGS, data),

  getDebts: () => api.get<DebtDashboardData>(ENDPOINTS.GOALS.DEBTS),
  createDebt: (data: {
    name: string
    type: "loan" | "credit-card"
    totalAmount: number
    remainingBalance: number
    interestRate: number
    emi: number
    color?: string
    currency?: string
  }) => api.post(ENDPOINTS.GOALS.DEBTS, data),
  recordDebtPayment: (id: string, data: { amount: number; type?: "regular" | "extra"; date?: string }) =>
    api.post(ENDPOINTS.GOALS.DEBT_PAYMENT(id), data),

  getInvestments: () => api.get<InvestmentDashboardData>(ENDPOINTS.GOALS.INVESTMENTS),
  createInvestment: (data: {
    name: string
    type: "stock" | "mutual-fund"
    investedAmount: number
    currentValue: number
    quantity: number
    buyPrice: number
    color?: string
    currency?: string
  }) => api.post(ENDPOINTS.GOALS.INVESTMENTS, data),
}
