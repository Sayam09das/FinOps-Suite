// Auth API endpoints & helpers

export const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  ME: '/api/auth/me',
  REFRESH: '/api/auth/refresh',
} as const

// Convenience functions (uses global api)
export const authApi = {
  login: (credentials: { email: string; password: string }) => 
    import('@/app/lib/api/client').then(mod => mod.api.post(AUTH_ENDPOINTS.LOGIN, credentials)),
  register: (formData: FormData) => 
    import('@/app/lib/api/client').then(mod => mod.api.post(AUTH_ENDPOINTS.REGISTER, formData)),
  logout: () => import('@/app/lib/api/client').then(mod => mod.api.post(AUTH_ENDPOINTS.LOGOUT)),
  me: () => import('@/app/lib/api/client').then(mod => mod.api.get(AUTH_ENDPOINTS.ME)),
}

// Re-export queries
export { useLoginMutation, useRegisterMutation, useLogoutMutation, useAuthMeQuery } from '@/app/lib/api/queries'

