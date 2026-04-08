import { authRepository } from './auth.repository';
import type { AuthenticatedSession } from './auth.types';
import { createSession, resolveRole } from './auth.service';

type OAuthInput = {
  email: string;
  name: string;
  provider: 'google' | 'apple' | 'facebook';
  providerId: string;
};

export const handleOAuth = async ({
  email,
  name,
  provider,
  providerId,
}: OAuthInput): Promise<AuthenticatedSession> => {
  const normalizedEmail = email.trim().toLowerCase();
  let user = await authRepository.findByEmail(normalizedEmail);

  const role = resolveRole(normalizedEmail, user?.role);

  if (!user) {
    // Create new OAuth user (no password)
    user = await authRepository.createOAuthUser(normalizedEmail, name, provider, role);
  } else {
    // Upsert OAuth data
    user = await authRepository.upsertOAuthUser(
      user.id,
      name,
      provider,
      role,
    );
  }

  return createSession({
    id: user.id,
    name: user.name,
    email: user.email,
    role,
    isOAuth: user.isOAuth,
    provider: user.provider,
    createdAt: user.createdAt,
  });
};
