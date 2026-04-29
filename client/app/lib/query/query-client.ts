import { QueryClient } from '@tanstack/react-query'
import { getAuthToken } from '@/app/features/auth/utils/auth-utils'

export const getQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: (failureCount: number, error: any) => {
          if (error?.status === 401) return false;
          if (error?.status === 404) return false;
          if (error?.status === 408) return false;
          return failureCount < 3;
        },
      },
      mutations: {
        retry: (failureCount: number, error: any) => {
          if (error?.status === 401 || error?.status === 404 || error?.status === 408) return false;
          return failureCount < 1;
        },
      },
    },
  })
}

