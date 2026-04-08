import { userRepository } from './user.repository';
import type { CurrentUser } from './user.types';

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
