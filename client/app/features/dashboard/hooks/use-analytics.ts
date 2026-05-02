"use client"

import { useQuery } from "@tanstack/react-query"
import { api } from "@/app/lib/api/client"
import { QUERY } from "@/app/lib/constants"

export interface AnalyticsTrend {
  month: string   // "YYYY-MM"
  income: number
  expense: number
  balance: number
}

export interface AnalyticsResult {
  overview: {
    period: string
    income: number
    expense: number
    balance: number
    categories: Record<string, { spent: number; percentage: number }>
  }
  trends: AnalyticsTrend[]
  forecast: {
    nextMonthIncome: number
    nextMonthExpense: number
    projectedBalance: number
    trend: "UP" | "DOWN" | "STABLE"
  }
  topCategories: string[]
}

export function useAnalytics() {
  return useQuery<AnalyticsResult>({
    queryKey: ["analytics", "overview"],
    queryFn: () => api.get<AnalyticsResult>("/api/analytics/overview"),
    staleTime: QUERY.STALE_TIME,
    refetchOnWindowFocus: true,
  })
}
