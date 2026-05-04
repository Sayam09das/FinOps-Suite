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
    ME: "/api/user/me",
    UPDATE_ME: "/api/user/me",
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
  COLLABORATION: {
    INVITE_USERS: "/api/collaboration/invite-users",
    INVITES: "/api/collaboration/invite-users/invites",
    INVITE_RESEND: (id: string) => `/api/collaboration/invite-users/invites/${id}/resend`,
    INVITE_CANCEL: (id: string) => `/api/collaboration/invite-users/invites/${id}`,
    MEMBER_ROLE: (id: string) => `/api/collaboration/invite-users/members/${id}/role`,
    MEMBER_REMOVE: (id: string) => `/api/collaboration/invite-users/members/${id}`,
    SHARED_ACCOUNTS: "/api/collaboration/shared-accounts",
    SHARED_ACCOUNT_MEMBER_ROLE: (accountId: string, memberId: string) => `/api/collaboration/shared-accounts/${accountId}/members/${memberId}/role`,
    SHARED_ACCOUNT_MEMBER_REMOVE: (accountId: string, memberId: string) => `/api/collaboration/shared-accounts/${accountId}/members/${memberId}`,
    SHARED_ACCOUNT_LEAVE: (accountId: string) => `/api/collaboration/shared-accounts/${accountId}/leave`,
    GROUP_EXPENSES: "/api/collaboration/group-expenses",
  },
  SECURITY: {
    LOGIN_ACTIVITY: "/api/security/login-activity",
    AUDIT_LOGS: "/api/security/audit-logs",
    PERMISSIONS: "/api/security/permissions",
    USER_ROLE: (userId: string) => `/api/security/permissions/users/${userId}/role`,
  },
  NOTIFICATIONS: {
    LIST: "/api/notifications",
    MARK_READ: (id: string) => `/api/notifications/${id}/read`,
    MARK_ALL_READ: "/api/notifications/read-all",
  },
  UPLOAD: {
    SINGLE: "/api/uploads/single",
    MULTIPLE: "/api/uploads/multiple",
  },
} as const

export type ApiEndpoints = typeof ENDPOINTS
