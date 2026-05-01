export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login" as const,
    REGISTER: "/api/auth/register" as const,
    REFRESH: "/api/auth/refresh" as const,
    LOGOUT: "/api/auth/logout" as const,
    ME: "/api/auth/me" as const,
  },
  USER: {
    LIST: "/users" as const,
    BY_ID: (id: string) => `/users/${id}` as const,
  },
  BUDGET: {
    LIST: "/budgets" as const,
    BY_ID: (id: string) => `/budgets/${id}` as const,
    CREATE: "/budgets" as const,
  },
  TRANSACTION: {
    LIST: "/transactions" as const,
    CREATE: "/transactions" as const,
  },
DASHBOARD: {
    OVERVIEW: "/dashboard/overview" as const,
    ANALYTICS: "/dashboard/analytics" as const,
    NETWORTH: "/dashboard/networth" as const,
  },
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
} as const

