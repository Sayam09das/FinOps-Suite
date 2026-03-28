import prisma from '../../config/db';

export const userRepository = {
  // Get user profile (self)
  findProfileById: async (id: string) => {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });
  },

  // Update user profile (self)
  updateProfile: async (id: string, data: { email?: string }) => {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });
  },
};
