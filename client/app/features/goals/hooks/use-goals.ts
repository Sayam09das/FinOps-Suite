"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { goalsApi } from "../api"

const GOALS_REFETCH_INTERVAL = 5000

export const goalKeys = {
  all: ["goals"] as const,
  savings: () => [...goalKeys.all, "savings"] as const,
  debts: () => [...goalKeys.all, "debts"] as const,
  investments: () => [...goalKeys.all, "investments"] as const,
}

export function useSavingsGoals() {
  return useQuery({
    queryKey: goalKeys.savings(),
    queryFn: goalsApi.getSavings,
    refetchInterval: GOALS_REFETCH_INTERVAL,
    staleTime: 0,
  })
}

export function useCreateSavingsGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: goalsApi.createSavings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.savings() })
    },
  })
}

export function useDebts() {
  return useQuery({
    queryKey: goalKeys.debts(),
    queryFn: goalsApi.getDebts,
    refetchInterval: GOALS_REFETCH_INTERVAL,
    staleTime: 0,
  })
}

export function useCreateDebt() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: goalsApi.createDebt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.debts() })
    },
  })
}

export function useRecordDebtPayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, amount, type }: { id: string; amount: number; type?: "regular" | "extra" }) =>
      goalsApi.recordDebtPayment(id, { amount, type }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.debts() })
    },
  })
}

export function useInvestments() {
  return useQuery({
    queryKey: goalKeys.investments(),
    queryFn: goalsApi.getInvestments,
    refetchInterval: GOALS_REFETCH_INTERVAL,
    staleTime: 0,
  })
}

export function useCreateInvestment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: goalsApi.createInvestment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.investments() })
    },
  })
}
