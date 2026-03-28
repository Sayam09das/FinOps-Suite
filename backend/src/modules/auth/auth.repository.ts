import prisma from '../../config/db';
import type { PrismaUser } from './auth.types';
import bcrypt from 'bcrypt';

export const authRepository = {
  // Find user by email
  findByEmail: async (email: string): Promise<PrismaUser | null> => {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  // Find user by id
  findById: async (id: string): Promise<PrismaUser | null> => {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  // Create new user
  createUser: async (email: string, hashedPassword: string): Promise<PrismaUser> => {
    return prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  },
};
