"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { budgetsApi, transformStatusToSpend } from "../api"
import type { Budget, CreateBudgetDTO, BudgetStatus, CategorySpend } from "../types"
import { QUERY } from "@/app/lib/constants"

// Query keys for budgets
export const budgetKeys = {
  all: ["budgets"] as const,
  status: (month?: string) => [...budgetKeys.all, "status", month] as const,
  categorySpend: (category: string, month?: string) => [...budgetKeys.all, "categorySpend", category, month] as const,
}

// Hook to get all budgets
export function useBudgets() {
  return useQuery({
    queryKey: budgetKeys.all,
    queryFn: () => budgetsApi.getAll(),
    staleTime: QUERY.STALE_TIME,
    refetchOnMount: true,
  })
}

// Hook to get budget status (budget vs actual)
export function useBudgetStatus(month?: string) {
  return useQuery({
    queryKey: budgetKeys.status(month),
    queryFn: () => budgetsApi.getStatus(month),
    staleTime: QUERY.STALE_TIME,
    enabled: true,
  })
}

// Hook to get category spending data for Preview/Suggestions
export function useCategorySpend(category: string, month?: string) {
  return useQuery({
    queryKey: budgetKeys.categorySpend(category, month),
    queryFn: async () => {
      const status = await budgetsApi.getStatus(month)
      return transformStatusToSpend(status, category, "INR")
    },
    staleTime: QUERY.STALE_TIME,
    enabled: !!category,
  })
}

// Hook to create a new budget
export function useCreateBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateBudgetDTO) => budgetsApi.create(data),
    onSuccess: () => {
      // Invalidate all budget-related queries
      queryClient.invalidateQueries({ queryKey: budgetKeys.all })
    },
  })
}

// Hook to delete a budget
export function useDeleteBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => budgetsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all })
    },
  })
}
