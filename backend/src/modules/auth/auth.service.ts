import bcrypt from 'bcrypt';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { JWT } from '../../config/constants';
import { authRepository, type AuthRepositoryUser } from './auth.repository';
import type { AppUserRole } from '../user/user.types';
import type { AuthUser, AuthenticatedSession } from './auth.types';

type AuthInput = {
  name?: string;
  email: string;
  password: string;
};

type AuthTokenPayload = {
  userId: string;
  email: string;
  role: AppUserRole;
  type: 'access' | 'refresh';
};

const adminEmails = new Set(
  (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean),
);

const accessSecret = process.env.JWT_ACCESS_SECRET || 'finops-access-secret';
const refreshSecret = process.env.JWT_REFRESH_SECRET || 'finops-refresh-secret';

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const resolveRole = (
  email: string,
  currentRole?: AppUserRole,
): AppUserRole => {
  if (currentRole === 'ADMIN' || adminEmails.has(email.toLowerCase())) {
    return 'ADMIN';
  }

  return 'USER';
};

export const toAuthUser = (user: AuthRepositoryUser): AuthUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  isOAuth: user.isOAuth,
  provider: user.provider,
  createdAt: user.createdAt,
});

const signToken = (
  payload: AuthTokenPayload,
  secret: string,
  expiresIn: SignOptions['expiresIn'],
): string => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const createSession = (user: AuthUser): AuthenticatedSession => {
  return {
    user,
    accessToken: signToken(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        type: 'access',
      },
      accessSecret,
      JWT.ACCESS_EXPIRES,
    ),
    refreshToken: signToken(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        type: 'refresh',
      },
      refreshSecret,
      JWT.REFRESH_EXPIRES,
    ),
  };
};

export const createAccount = async ({
  name,
  email,
  password,
}: AuthInput): Promise<AuthenticatedSession> => {
  const normalizedEmail = normalizeEmail(email);
  const existingUser = await authRepository.findByEmail(normalizedEmail);

  if (existingUser?.password) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const role = resolveRole(normalizedEmail, existingUser?.role);

  const user = existingUser
    ? await authRepository.setPassword(
        existingUser.id,
        name?.trim() || undefined,
        hashedPassword,
        role,
      )
    : await authRepository.createUser(
        name?.trim() || undefined,
        normalizedEmail,
        hashedPassword,
        role,
      );

  return createSession(toAuthUser(user));
};

export const loginUser = async ({
  email,
  password,
}: AuthInput): Promise<AuthenticatedSession> => {
  const normalizedEmail = normalizeEmail(email);
  const user = await authRepository.findByEmail(normalizedEmail);

  if (!user?.password) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  return createSession(
    toAuthUser({
      ...user,
      role: resolveRole(user.email, user.role),
    }),
  );
};

export const createFreshSession = async (
  refreshToken: string,
): Promise<AuthenticatedSession> => {
  try {
    const payload = jwt.verify(refreshToken, refreshSecret) as AuthTokenPayload;

    if (payload.type !== 'refresh') {
      throw new Error('Invalid refresh token');
    }

    const user = await authRepository.findById(payload.userId);

    if (!user) {
      throw new Error('Invalid refresh token');
    }

    return createSession(
      toAuthUser({
        ...user,
        role: resolveRole(user.email, user.role),
      }),
    );
  } catch {
    throw new Error('Invalid refresh token');
  }
};
