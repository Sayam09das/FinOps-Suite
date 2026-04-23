export const AUTH = {
  LOCAL_STORAGE_TOKEN: "finops-auth-token" as const,
  LOCAL_STORAGE_USER: "finops-user" as const,
  GRACE_UNTIL_KEY: "authGraceUntil" as const,
  REFRESH_TOKEN: "finops-refresh-token" as const,
  LOGIN_PATH: "/login" as const,
  DASHBOARD_PATH: "/dashboard" as const,
} as const

export const OAUTH = {
  GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "" as const,
  GITHUB_CLIENT_ID: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || "" as const,
} as const
