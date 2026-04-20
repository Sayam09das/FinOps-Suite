import { QueryClient } from '@tanstack/react-query'

export const getQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: (failureCount, error: any) => {
          if (error.status === 404) return false
          return failureCount < 3
        },
      },
      mutations: {
        retry: (failureCount, error: any) => {
          if (error.status === 404) return false
          return failureCount < 1
        },
      },
    },
  })
}

