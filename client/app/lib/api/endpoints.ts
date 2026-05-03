import { HTTP_STATUS } from "../constants/api"

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    REFRESH: "/api/auth/refresh",
    LOGOUT: "/api/auth/logout",
    ME: "/api/auth/me",
  },
  USER: {
    LIST: "/api/user",
    DETAIL: (id: string) => `/api/user/${id}`,
    UPDATE: (id: string) => `/api/user/${id}`,
    DELETE: (id: string) => `/api/user/${id}`,
  },
  BUDGET: {
    LIST: "/api/budgets",
    CREATE: "/api/budgets",
    DETAIL: (id: string) => `/api/budgets/${id}`,
    UPDATE: (id: string) => `/api/budgets/${id}`,
    DELETE: (id: string) => `/api/budgets/${id}`,
    CATEGORIES: "/api/budgets/categories",
  },
  TRANSACTION: {
    LIST: "/api/transactions",
    CREATE: "/api/transactions",
    DETAIL: (id: string) => `/api/transactions/${id}`,
    UPDATE: (id: string) => `/api/transactions/${id}`,
    DELETE: (id: string) => `/api/transactions/${id}`,
    CATEGORIES: "/api/transactions/categories",
  },
DASHBOARD: {
    OVERVIEW: "/api/dashboard/overview",
    ANALYTICS: "/api/dashboard/analytics",
    REPORTS: "/api/dashboard/reports",
    NETWORTH: "/api/dashboard/networth",
  },
  ACCOUNTS: {
    LIST: "/api/accounts",
    DETAIL: (id: string) => `/api/accounts/${id}`,
    CREATE: "/api/accounts",
    UPDATE: (id: string) => `/api/accounts/${id}`,
    DELETE: (id: string) => `/api/accounts/${id}`,
    BALANCE: "/api/accounts/balance",
    ACTIVITY: "/api/accounts/activity",
  },
  GOALS: {
    SAVINGS: "/api/goals/savings",
    DEBTS: "/api/goals/debts",
    DEBT_PAYMENT: (id: string) => `/api/goals/debts/${id}/payments`,
    INVESTMENTS: "/api/goals/investments",
  },
  UPLOAD: {
    SINGLE: "/api/uploads/single",
    MULTIPLE: "/api/uploads/multiple",
  },
} as const

export type ApiEndpoints = typeof ENDPOINTS
