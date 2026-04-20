import { AUTH } from '@/app/lib/constants/auth'

export function getAuthToken() {
  return typeof window !== 'undefined' ? localStorage.getItem(AUTH.LOCAL_STORAGE_TOKEN) : null
}

export function setAuthData(token: string, user: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH.LOCAL_STORAGE_TOKEN, token)
    localStorage.setItem(AUTH.LOCAL_STORAGE_USER, JSON.stringify(user))
  }
}

export function clearAuthData() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH.LOCAL_STORAGE_TOKEN)
    localStorage.removeItem(AUTH.LOCAL_STORAGE_USER)
  }
}

export function isValidToken(token: string | null): boolean {
  return !!token && token.length > 10
}

