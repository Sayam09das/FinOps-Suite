import { AUTH } from '@/app/lib/constants/auth'

export function getAuthToken() {
  return typeof window !== 'undefined' ? localStorage.getItem(AUTH.LOCAL_STORAGE_TOKEN) : null
}

export function getRefreshToken() {
  return typeof window !== 'undefined' ? localStorage.getItem(AUTH.REFRESH_TOKEN) : null
}

export function getStoredUser<T = unknown>(): T | null {
  if (typeof window === 'undefined') return null

  const rawUser = localStorage.getItem(AUTH.LOCAL_STORAGE_USER)
  if (!rawUser) return null

  try {
    return JSON.parse(rawUser) as T
  } catch {
    localStorage.removeItem(AUTH.LOCAL_STORAGE_USER)
    return null
  }
}

export function isAuthGraceActive() {
  if (typeof window === 'undefined') return false

  const graceUntil = Number(localStorage.getItem(AUTH.GRACE_UNTIL_KEY) || '0')
  return Number.isFinite(graceUntil) && graceUntil > Date.now()
}

export function getGraceUser<T = unknown>(): T | null {
  return isAuthGraceActive() ? getStoredUser<T>() : null
}

export function setAuthData(token: string, user: unknown) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH.LOCAL_STORAGE_TOKEN, token)
    localStorage.setItem(AUTH.LOCAL_STORAGE_USER, JSON.stringify(user))
  }
}

export function setRefreshToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH.REFRESH_TOKEN, token)
  }
}

export function clearAuthData() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH.LOCAL_STORAGE_TOKEN)
    localStorage.removeItem(AUTH.LOCAL_STORAGE_USER)
    localStorage.removeItem(AUTH.GRACE_UNTIL_KEY)
    localStorage.removeItem(AUTH.REFRESH_TOKEN)
  }
}

export function isValidToken(token: string | null): boolean {
  // Valid tokens must be:
  // 1. Not null/undefined/empty
  // 2. A string
  // 3. Longer than 10 characters (JWT tokens are typically longer)
  // 4. Not just whitespace
  return !!token && typeof token === 'string' && token.length > 10 && token.trim() === token
}
