import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './client'
import { ENDPOINTS } from './endpoints'
import { API } from '../constants'
import { getAuthToken, getStoredUser } from '@/app/features/auth/utils/auth-utils'
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

type ForgotPasswordInput = {
  email: string
}

type ResetPasswordInput = {
  token: string
  password: string
  confirmPassword: string
}

// Auth queries/mutations
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: ({ email, password }: LoginCredentials) =>
      api.post<AuthUser>(ENDPOINTS.AUTH.LOGIN, { email, password }, { timeoutMs: API.AUTH_TIMEOUT }),
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
      api.post<AuthUser>(ENDPOINTS.AUTH.REGISTER, data, { timeoutMs: API.AUTH_TIMEOUT }),
    onSuccess: () => {
      console.log('[QUERIES] Register success')
    },
  })
}

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: ({ email }: ForgotPasswordInput) =>
      api.post<{ sent: boolean }>(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }, { timeoutMs: API.AUTH_TIMEOUT }),
  })
}

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: ({ token, password, confirmPassword }: ResetPasswordInput) =>
      api.post<{ reset: boolean }>(
        ENDPOINTS.AUTH.RESET_PASSWORD,
        { token, password, confirmPassword },
        { timeoutMs: API.AUTH_TIMEOUT },
      ),
  })
}

// SSR-safe useAuthMeQuery - localStorage only client-side
export const useAuthMeQuery = ({ enabled }: { enabled?: boolean } = {}) => {
  const hasStoredSession = !!getAuthToken() || !!getStoredUser()

  return useQuery<AuthUser>({
    queryKey: ['auth', 'me'],
    queryFn: () => api.get<AuthUser>(ENDPOINTS.AUTH.ME, { timeoutMs: API.AUTH_TIMEOUT }),
    enabled: enabled ?? hasStoredSession,
    initialData: undefined,
    staleTime: 10 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      const status = (error as Error & { status?: number })?.status
      if (status === 401) {
        return false
      }

      return failureCount < 2
    },
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000),
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
export const useTransactionsQuery = (page = 1, enabled = !!getAuthToken(), limit = 50) => {
  return useQuery<{ data?: Transaction[] } | Transaction[]>({
    queryKey: ['transactions', page, limit],
    queryFn: () => api.get<{ data?: Transaction[] } | Transaction[]>(`${ENDPOINTS.TRANSACTION.LIST}?page=${page}&limit=${limit}`),
    enabled,
    staleTime: 0,
    refetchInterval: enabled ? 5000 : false,
    refetchOnWindowFocus: true,
  })
}

// Dashboard
export const useDashboardOverviewQuery = (enabled = !!getAuthToken(), dateRange = 'thisMonth') => {
  return useQuery<DashboardOverview>({
    queryKey: ['dashboard', 'overview', dateRange],
    queryFn: () => api.get<DashboardOverview>(`/api/dashboard/?dateRange=${dateRange}`),
    enabled,
    staleTime: 0,
    refetchInterval: enabled ? 5000 : false,
    refetchOnWindowFocus: true,
  })
}

// NetWorth
export const useNetWorthQuery = (enabled = !!getAuthToken()) => {
  return useQuery({
    queryKey: ['dashboard', 'networth'],
    queryFn: async () => {
      const data = await api.get(ENDPOINTS.DASHBOARD.NETWORTH)
      // Transform backend data to view model using the mapper
      const { mapBackendToViewModel } = await import('@/app/dashboard/Overview/Networth/view-model')
      return mapBackendToViewModel(data)
    },
    enabled,
    staleTime: 0,
    refetchInterval: enabled ? 30000 : false, // Refetch every 30 seconds for real-time updates
    refetchOnWindowFocus: true,
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
