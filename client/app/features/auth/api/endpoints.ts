// Auth API endpoints & helpers

export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  REFRESH: '/auth/refresh',
} as const

// Convenience functions (uses global api)
export const authApi = {
  login: (credentials: { email: string; password: string }) => 
    api.post(AUTH_ENDPOINTS.LOGIN, credentials),
  register: (formData: FormData) => 
    api.post(AUTH_ENDPOINTS.REGISTER, formData),
  logout: () => api.post(AUTH_ENDPOINTS.LOGOUT),
  me: () => api.get(AUTH_ENDPOINTS.ME),
}

// Re-export queries
export { useLoginMutation, useRegisterMutation, useLogoutMutation, useAuthMeQuery } from '@/app/lib/api/queries'

