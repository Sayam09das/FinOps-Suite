import { userRepository } from './user.repository';
import type { CurrentUser, UpdateCurrentUserInput } from './user.types';

const adminEmails = new Set(
  (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean),
);

export const resolveRole = (
  email: string,
  currentRole?: CurrentUser['role'],
): CurrentUser['role'] => {
  if (currentRole === 'ADMIN' || adminEmails.has(email.toLowerCase())) {
    return 'ADMIN';
  }

  return 'USER';
};

export const getUserProfile = async (userId: string): Promise<CurrentUser> => {
  const user = await userRepository.findProfileById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

export const updateUserProfile = async (
  userId: string,
  data: UpdateCurrentUserInput,
): Promise<CurrentUser> => {
  const current = await getUserProfile(userId);

  return userRepository.updateProfileById(userId, {
    name: data.name?.trim() || current.name,
    preferredCurrency: data.preferredCurrency ?? current.preferredCurrency,
    locale: data.locale ?? current.locale,
    timezone: data.timezone ?? current.timezone,
    emailNotifications: data.emailNotifications ?? current.emailNotifications,
    pushNotifications: data.pushNotifications ?? current.pushNotifications,
    weeklyDigest: data.weeklyDigest ?? current.weeklyDigest,
    budgetAlerts: data.budgetAlerts ?? current.budgetAlerts,
    securityAlerts: data.securityAlerts ?? current.securityAlerts,
  });
};
