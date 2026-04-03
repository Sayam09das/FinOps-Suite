import { clerkClient } from '@clerk/express';
import { userRepository } from './user.repository';
import type { CurrentUser } from './user.types';

type ClerkUserRecord = Awaited<ReturnType<typeof clerkClient.users.getUser>>;

const adminIds = new Set(
  (process.env.CLERK_ADMIN_IDS ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean),
);

const adminEmails = new Set(
  (process.env.CLERK_ADMIN_EMAILS ?? '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean),
);

const resolveRole = (clerkId: string, email: string): CurrentUser['role'] => {
  if (adminIds.has(clerkId) || adminEmails.has(email.toLowerCase())) {
    return 'ADMIN';
  }

  return 'USER';
};

const getPrimaryEmailAddress = (user: ClerkUserRecord): string => {
  const primaryEmail =
    user.emailAddresses.find(
      (emailAddress) => emailAddress.id === user.primaryEmailAddressId,
    ) ?? user.emailAddresses[0];

  if (!primaryEmail?.emailAddress) {
    throw new Error('Authenticated Clerk user does not have a primary email address.');
  }

  return primaryEmail.emailAddress;
};

export const syncUserFromClerk = async (clerkId: string): Promise<CurrentUser> => {
  const existingUser = await userRepository.findByClerkId(clerkId);

  if (existingUser) {
    const role = resolveRole(clerkId, existingUser.email);

    if (existingUser.role === role) {
      return existingUser;
    }

    return userRepository.upsertClerkUser({
      clerkId,
      email: existingUser.email,
      role,
    });
  }

  const clerkUser = await clerkClient.users.getUser(clerkId);
  const email = getPrimaryEmailAddress(clerkUser);

  return userRepository.upsertClerkUser({
    clerkId,
    email,
    role: resolveRole(clerkId, email),
  });
};

export const getUserProfile = async (userId: string): Promise<CurrentUser> => {
  const user = await userRepository.findProfileById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};
