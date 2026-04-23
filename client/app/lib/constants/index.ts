export const APP = {
  NAME: "FinOps Suite" as const,
  VERSION: "1.0.0" as const,
  AUTHOR: "FinOps Team" as const,
} as const

export const API = {
  BASE_URL: "",
  TIMEOUT: 15000,
  AUTH_TIMEOUT: 60000,
  VERSION: "v1" as const,
} as const

export const QUERY = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  CACHE_TIME: 10 * 60 * 1000, // 10 minutes
} as const

export const THEME = {
  DEFAULT_THEME: "system" as const,
  THEMES: ["light", "dark", "system"] as const,
} as const

export const CURRENCY = {
  DEFAULT: "USD" as const,
  SUPPORTED: ["USD", "EUR", "GBP", "JPY", "CAD"] as const,
} as const

export const DATE = {
  DEFAULT_LOCALE: "en-US" as const,
} as const

export const ROLES = {
  ADMIN: "admin" as const,
  USER: "user" as const,
  VIEWER: "viewer" as const,
} as const

export const LIMITS = {
  PAGE_SIZE: 20,
  MAX_TOASTS: 5,
} as const

export const COLORS = {
  PRIMARY: "hsl(var(--primary))",
  SECONDARY: "hsl(var(--secondary))",
} as const
