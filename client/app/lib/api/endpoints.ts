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
    LIST: "/users",
    DETAIL: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
  BUDGET: {
    LIST: "/budgets",
    CREATE: "/budgets",
    DETAIL: (id: string) => `/budgets/${id}`,
    UPDATE: (id: string) => `/budgets/${id}`,
    DELETE: (id: string) => `/budgets/${id}`,
    CATEGORIES: "/budgets/categories",
  },
  TRANSACTION: {
    LIST: "/transactions",
    CREATE: "/transactions",
    DETAIL: (id: string) => `/transactions/${id}`,
    UPDATE: (id: string) => `/transactions/${id}`,
    DELETE: (id: string) => `/transactions/${id}`,
    CATEGORIES: "/transactions/categories",
  },
  DASHBOARD: {
    OVERVIEW: "/dashboard/overview",
    ANALYTICS: "/dashboard/analytics",
    REPORTS: "/dashboard/reports",
  },
  UPLOAD: {
    SINGLE: "/uploads/single",
    MULTIPLE: "/uploads/multiple",
  },
} as const

export type ApiEndpoints = typeof ENDPOINTS

