"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { accountsApi, type BankAccount, type CreateAccountDTO, type UpdateAccountDTO } from "../api"
import { QUERY } from "@/app/lib/constants"

// Query keys
export const accountKeys = {
  all: ["accounts"] as const,
  banks: () => [...accountKeys.all, "banks"] as const,
  wallets: () => [...accountKeys.all, "wallets"] as const,
  creditCards: () => [...accountKeys.all, "credit-cards"] as const,
  totalBalance: () => [...accountKeys.all, "total-balance"] as const,
  detail: (id: string) => [...accountKeys.all, "detail", id] as const,
}

// Hooks
export function useAccounts() {
  return useQuery({
    queryKey: accountKeys.all,
    queryFn: () => accountsApi.getAll(),
    staleTime: QUERY.STALE_TIME,
  })
}

export function useBankAccounts() {
  return useQuery({
    queryKey: accountKeys.banks(),
    queryFn: () => accountsApi.getBanks(),
    staleTime: QUERY.STALE_TIME,
    refetchOnMount: true, // Fetch immediately when component mounts
  })
}

export function useWalletAccounts() {
  return useQuery({
    queryKey: accountKeys.wallets(),
    queryFn: () => accountsApi.getWallets(),
    staleTime: QUERY.STALE_TIME,
    refetchOnMount: true, // Fetch immediately when component mounts
  })
}

export function useCreditCardAccounts() {
  return useQuery({
    queryKey: accountKeys.creditCards(),
    queryFn: () => accountsApi.getCreditCards(),
    staleTime: QUERY.STALE_TIME,
  })
}

export function useTotalBalance() {
  return useQuery({
    queryKey: accountKeys.totalBalance(),
    queryFn: () => accountsApi.getTotalBalance(),
    staleTime: QUERY.STALE_TIME,
  })
}

export function useAccount(id: string) {
  return useQuery({
    queryKey: accountKeys.detail(id),
    queryFn: () => accountsApi.get(id),
    enabled: !!id,
    staleTime: QUERY.STALE_TIME,
  })
}

// Special hook for getting single wallet by ID
export function useWallet(id: string) {
  return useQuery({
    queryKey: [...accountKeys.all, "wallet", id],
    queryFn: () => accountsApi.get(id),
    enabled: !!id,
    staleTime: QUERY.STALE_TIME,
  })
}

export function useCreateAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAccountDTO) => accountsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all })
    },
  })
}

export function useUpdateAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountDTO }) =>
      accountsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all })
      queryClient.invalidateQueries({ queryKey: accountKeys.detail(id) })
    },
  })
}

export function useDeleteAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => accountsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all })
    },
  })
}

export function useUpdateBalance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, amount, operation }: { id: string; amount: number; operation: "add" | "subtract" }) =>
      accountsApi.updateBalance(id, amount, operation),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all })
      queryClient.invalidateQueries({ queryKey: accountKeys.totalBalance() })
      queryClient.invalidateQueries({ queryKey: accountKeys.detail(id) })
    },
  })
}
