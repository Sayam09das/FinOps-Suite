import prisma from '../../config/db';
import type { CurrentUser } from './user.types';

const currentUserSelect = {
  id: true,
  clerkId: true,
  email: true,
  role: true,
  createdAt: true,
} as const;

export const userRepository = {
  findByClerkId: async (clerkId: string): Promise<CurrentUser | null> => {
    return prisma.user.findUnique({
      where: { clerkId },
      select: currentUserSelect,
    });
  },

  findProfileById: async (id: string): Promise<CurrentUser | null> => {
    return prisma.user.findUnique({
      where: { id },
      select: currentUserSelect,
    });
  },

  upsertClerkUser: async (input: {
    clerkId: string;
    email: string;
    role: CurrentUser['role'];
  }): Promise<CurrentUser> => {
    return prisma.user.upsert({
      where: { clerkId: input.clerkId },
      update: {
        email: input.email,
        role: input.role,
      },
      create: {
        clerkId: input.clerkId,
        email: input.email,
        role: input.role,
      },
      select: currentUserSelect,
    });
  },
};
