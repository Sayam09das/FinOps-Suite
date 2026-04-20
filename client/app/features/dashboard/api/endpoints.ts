// Dashboard-specific API helpers (extends global queries)

// Local constants
export const DASHBOARD_ENDPOINTS = {
  OVERVIEW: '/dashboard/overview',
  RECENT_TRANSACTIONS: '/dashboard/transactions/recent',
} as const

// Wrapper for dashboard data (uses global api)
export const dashboardApi = {
  getOverview: () => import('@/app/lib/api/client').then(mod => mod.api.get(DASHBOARD_ENDPOINTS.OVERVIEW)),
  getRecentTransactions: () => import('@/app/lib/api/client').then(mod => mod.api.get(DASHBOARD_ENDPOINTS.RECENT_TRANSACTIONS)),
}

// Re-export global queries for convenience
export { useDashboardOverviewQuery, useBudgetsQuery, useTransactionsQuery } from '@/app/lib/api/queries'

