export type AppUserRole = 'USER' | 'ADMIN';

export interface CurrentUser {
  id: string;
  name: string | null;
  email: string;
  role: AppUserRole;
  isOAuth: boolean;
  provider: string | null;
  preferredCurrency: string;
  locale: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  budgetAlerts: boolean;
  securityAlerts: boolean;
  createdAt: Date;
}

export interface UpdateCurrentUserInput {
  name?: string;
  preferredCurrency?: string;
  locale?: string;
  timezone?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  weeklyDigest?: boolean;
  budgetAlerts?: boolean;
  securityAlerts?: boolean;
}
