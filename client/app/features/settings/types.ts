export interface UserSettings {
  id: string
  name: string | null
  email: string
  role: "USER" | "ADMIN"
  isOAuth: boolean
  provider: string | null
  preferredCurrency: "USD" | "INR" | "EUR" | "GBP"
  locale: string
  timezone: string
  emailNotifications: boolean
  pushNotifications: boolean
  weeklyDigest: boolean
  budgetAlerts: boolean
  securityAlerts: boolean
  createdAt: string
}

export type UpdateUserSettingsInput = Partial<{
  name: string
  preferredCurrency: UserSettings["preferredCurrency"]
  locale: string
  timezone: string
  emailNotifications: boolean
  pushNotifications: boolean
  weeklyDigest: boolean
  budgetAlerts: boolean
  securityAlerts: boolean
}>
