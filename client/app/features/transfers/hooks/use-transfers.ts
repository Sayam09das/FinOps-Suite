"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/app/lib/api/client"
import { QUERY } from "@/app/lib/constants"

// Types
export interface Transfer {
  id: string
  fromAccountId: string
  toAccountId: string
  amount: number
  currency: string
  fee: number
  status: "pending" | "completed" | "failed"
  notes?: string
  date: string
  createdAt: string
  completedAt?: string
}

export interface CreateTransferDTO {
  fromAccountId: string
  toAccountId: string
  amount: number
  currency?: string
  fee?: number
  notes?: string
}

export interface UpdateTransferDTO {
  status?: "pending" | "completed" | "failed"
  notes?: string
}

// Query keys
export const transferKeys = {
  all: ["transfers"] as const,
  recent: (limit: number) => [...transferKeys.all, "recent", limit] as const,
  stats: () => [...transferKeys.all, "stats"] as const,
  detail: (id: string) => [...transferKeys.all, "detail", id] as const,
}

// API functions
export const transfersApi = {
  getAll: () => api.get<Transfer[]>("/api/transfers"),
  
  getRecent: (limit: number = 10) => api.get<Transfer[]>(`/api/transfers/recent?limit=${limit}`),
  
  getStats: () => api.get<{ totalSent: number; totalReceived: number; totalFees: number }>("/api/transfers/stats"),
  
  get: (id: string) => api.get<Transfer>(`/api/transfers/${id}`),
  
  create: (data: CreateTransferDTO) => api.post<Transfer>("/api/transfers", data),
  
  update: (id: string, data: UpdateTransferDTO) => api.patch<Transfer>(`/api/transfers/${id}`, data),
  
  delete: (id: string) => api.del<void>(`/api/transfers/${id}`),
}

// Hooks
export function useTransfers() {
  return useQuery({
    queryKey: transferKeys.all,
    queryFn: () => transfersApi.getAll(),
    staleTime: QUERY.STALE_TIME,
  })
}

export function useRecentTransfers(limit: number = 10) {
  return useQuery({
    queryKey: transferKeys.recent(limit),
    queryFn: () => transfersApi.getRecent(limit),
    staleTime: QUERY.STALE_TIME,
  })
}

export function useTransferStats() {
  return useQuery({
    queryKey: transferKeys.stats(),
    queryFn: () => transfersApi.getStats(),
    staleTime: QUERY.STALE_TIME,
  })
}

export function useTransfer(id: string) {
  return useQuery({
    queryKey: transferKeys.detail(id),
    queryFn: () => transfersApi.get(id),
    enabled: !!id,
    staleTime: QUERY.STALE_TIME,
  })
}

export function useCreateTransfer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTransferDTO) => transfersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transferKeys.all })
      queryClient.invalidateQueries({ queryKey: transferKeys.recent(10) })
      queryClient.invalidateQueries({ queryKey: transferKeys.stats() })
      // Invalidate accounts to reflect balance changes
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
    },
  })
}

export function useUpdateTransfer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTransferDTO }) =>
      transfersApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: transferKeys.all })
      queryClient.invalidateQueries({ queryKey: transferKeys.detail(id) })
    },
  })
}

export function useDeleteTransfer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => transfersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transferKeys.all })
      queryClient.invalidateQueries({ queryKey: transferKeys.recent(10) })
    },
  })
}
