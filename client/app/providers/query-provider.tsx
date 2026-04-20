"use client"

import * as React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { getQueryClient } from '../lib/query/query-client'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => getQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

