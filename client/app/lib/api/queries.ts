import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './client'
import { ENDPOINTS } from './endpoints'
import { HTTP_STATUS } from '../constants/api'
import { AUTH } from '../constants/auth'
import type { ApiEndpoints } from './endpoints'

// Auth queries/mutations
export const useLoginMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => 
      api.post(ENDPOINTS.AUTH.LOGIN, { email, password }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
    onError: (error) => {
      console.error('Login failed:', error)
    },
  })
}

export const useRegisterMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; email: string; password: string }) => 
      api.post(ENDPOINTS.AUTH.REGISTER, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })
}

export const useAuthMeQuery = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => api.get(ENDPOINTS.AUTH.ME),
    staleTime: 5 * 60 * 1000, // 5 min
    gcTime: 5 * 60 * 1000,   // Preserve cache during sync
    retry: 1,                // Reduce 401 spam
    refetchOnWindowFocus: false,
    refetchOnMount: false,   // Prevent immediate refetch spam
  })
}

export const useLogoutMutation = () => useMutation({
  mutationFn: () => api.post(ENDPOINTS.AUTH.LOGOUT),
})

// Budget queries
export const useBudgetsQuery = (page = 1) => {
  return useQuery({
    queryKey: ['budgets', page],
    queryFn: () => api.get(`/budgets?page=${page}`), 
    staleTime: 2 * 60 * 1000,
  })
}

// Transaction queries
export const useTransactionsQuery = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: () => api.get(ENDPOINTS.TRANSACTION.LIST),
  })
}

// Dashboard
export const useDashboardOverviewQuery = () => {
  return useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: () => api.get(ENDPOINTS.DASHBOARD.OVERVIEW),
  })
}

// Generic create/update/delete mutations
export const useCreateBudgetMutation = () => useMutation({
  mutationFn: (data: FormData) => api.post(ENDPOINTS.BUDGET.CREATE, data),
})

export const useUpdateBudgetMutation = (budgetId: string) => useMutation({
  mutationFn: (data: FormData) => api.put(ENDPOINTS.BUDGET.DETAIL(budgetId), data),
})

export const useDeleteBudgetMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (budgetId: string) => api.del(`/budgets/${budgetId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
    },
  })
}

/**
 * More hooks can be added for other endpoints as needed
 * Usage example in components:
 * const { data: budgets } = useBudgetsQuery()
 * const loginMutation = useLoginMutation()
 */

