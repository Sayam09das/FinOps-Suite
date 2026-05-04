import prisma from '../../config/db';
import type { CurrentUser } from './user.types';

const currentUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isOAuth: true,
  provider: true,
  preferredCurrency: true,
  locale: true,
  timezone: true,
  emailNotifications: true,
  pushNotifications: true,
  weeklyDigest: true,
  budgetAlerts: true,
  securityAlerts: true,
  createdAt: true,
} as const;

export const userRepository = {
  findProfileById: async (id: string): Promise<CurrentUser | null> => {
    return prisma.user.findUnique({
      where: { id },
      select: currentUserSelect,
    });
  },
  updateProfileById: async (
    id: string,
    data: Partial<CurrentUser>,
  ): Promise<CurrentUser> => {
    return prisma.user.update({
      where: { id },
      data,
      select: currentUserSelect,
    });
  },
};
