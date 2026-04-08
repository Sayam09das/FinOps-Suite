import prisma from '../../config/db';
import type { CurrentUser } from './user.types';

const currentUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isOAuth: true,
  provider: true,
  createdAt: true,
} as const;

export const userRepository = {
  findProfileById: async (id: string): Promise<CurrentUser | null> => {
    return prisma.user.findUnique({
      where: { id },
      select: currentUserSelect,
    });
  },
};
