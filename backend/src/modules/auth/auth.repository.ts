import prisma from '../../config/db';
import type { AppUserRole } from '../user/user.types';

const authUserSelect = {
  id: true,
  name: true,
  email: true,
  password: true,
  role: true,
  isOAuth: true,
  provider: true,
  createdAt: true,
} as const;

export type AuthRepositoryUser = {
  id: string;
  name: string | null;
  email: string;
  password: string | null;
  role: AppUserRole;
  isOAuth: boolean;
  provider: string | null;
  createdAt: Date;
};

export const authRepository = {
  findByEmail: async (email: string): Promise<AuthRepositoryUser | null> => {
    return prisma.user.findUnique({
      where: { email },
      select: authUserSelect,
    });
  },

  findById: async (id: string): Promise<AuthRepositoryUser | null> => {
    return prisma.user.findUnique({
      where: { id },
      select: authUserSelect,
    });
  },

  createUser: async (
    name: string | undefined,
    email: string,
    password: string,
    role: AppUserRole = 'USER',
  ): Promise<AuthRepositoryUser> => {
    return prisma.user.create({
      data: {
        name,
        email,
        password,
        role,
      },
      select: authUserSelect,
    });
  },

  setPassword: async (
    id: string,
    name: string | undefined,
    password: string,
    role: AppUserRole,
  ): Promise<AuthRepositoryUser> => {
    return prisma.user.update({
      where: { id },
      data: {
        ...(name ? { name } : {}),
        password,
        role,
      },
      select: authUserSelect,
    });
  },

  createOAuthUser: async (
    email: string,
    name: string,
    provider: string,
    role: AppUserRole,
  ): Promise<AuthRepositoryUser> => {
    return prisma.user.create({
      data: {
        name,
        email,
        isOAuth: true,
        provider,
        role,
      },
      select: authUserSelect,
    });
  },

  upsertOAuthUser: async (
    id: string,
    name: string,
    provider: string,
    role: AppUserRole,
  ): Promise<AuthRepositoryUser> => {
    return prisma.user.update({
      where: { id },
      data: {
        name,
        isOAuth: true,
        provider,
        role,
      },
      select: authUserSelect,
    });
  },
};
