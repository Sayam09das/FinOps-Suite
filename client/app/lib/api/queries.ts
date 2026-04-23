import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './client'
import { ENDPOINTS } from './endpoints'
import type { Budget, DashboardOverview, Transaction } from '@/app/features/dashboard/types/dashboard'

type AuthUser = {
  id: string
  name: string
  email: string
  role?: string
}

type LoginCredentials = {
  email: string
  password: string
}

type RegisterCredentials = {
  name: string
  email: string
  password: string
}

// Auth queries/mutations
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: ({ email, password }: LoginCredentials) =>
      api.post<AuthUser>(ENDPOINTS.AUTH.LOGIN, { email, password }),
    onSuccess: () => {
      // Don't invalidate during grace period - use setQueryData in useAuth instead
      console.log('[QUERIES] Login success - cache preserved')
    },
    onError: (error) => {
      console.error('Login failed:', error)
    },
  })
}

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (data: RegisterCredentials) =>
      api.post<AuthUser>(ENDPOINTS.AUTH.REGISTER, data),
    onSuccess: () => {
      console.log('[QUERIES] Register success')
    },
  })
}

// SSR-safe useAuthMeQuery - localStorage only client-side
export const useAuthMeQuery = () => {
  return useQuery<AuthUser>({
    queryKey: ['auth', 'me'],
    queryFn: () => api.get<AuthUser>(ENDPOINTS.AUTH.ME),
    initialData: undefined, // Set via useAuth optimistic update
    staleTime: 10 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  })
}

export const useLogoutMutation = () => useMutation({
  mutationFn: () => api.post<void>(ENDPOINTS.AUTH.LOGOUT),
})

// Budget queries
export const useBudgetsQuery = (page = 1, enabled = true) => {
  return useQuery<Budget[]>({
    queryKey: ['budgets', page],
    queryFn: () => api.get<Budget[]>(ENDPOINTS.BUDGET.LIST + `?page=${page}`),
    enabled,
    staleTime: 2 * 60 * 1000,
  })
}

// Transaction queries
export const useTransactionsQuery = (page = 1, enabled = true) => {
  return useQuery<{ data?: Transaction[] } | Transaction[]>({
    queryKey: ['transactions', page],
    queryFn: () => api.get<{ data?: Transaction[] } | Transaction[]>(ENDPOINTS.TRANSACTION.LIST),
    enabled,
    staleTime: 2 * 60 * 1000,
  })
}

// Dashboard
export const useDashboardOverviewQuery = (enabled = true) => {
  return useQuery<DashboardOverview & { expense?: number }>({
    queryKey: ['dashboard', 'overview'],
    queryFn: () => api.get<DashboardOverview & { expense?: number }>('/api/dashboard/'), // Backend serves GET / at /api/dashboard
    enabled,
    staleTime: 2 * 60 * 1000,
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
