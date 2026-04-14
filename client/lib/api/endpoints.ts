export const apiEndpoints = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    oauth: '/api/auth/oauth',
    session: '/api/auth/me',
    logout: '/api/auth/logout',
  },
  dashboard: {
    root: '/api/dashboard',
  },
  user: {
    current: '/api/user',
  },
  transactions: {
    root: '/api/transactions',
    list: '/api/transactions?limit=8',
    byId: (id: string) => `/api/transactions/${id}`,
  },
} as const;
