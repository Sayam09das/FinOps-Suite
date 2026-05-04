import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { JWT } from '../../config/constants';
import { logger } from '../../config/logger';
import { authRepository, type AuthRepositoryUser } from './auth.repository';
import type { AppUserRole } from '../user/user.types';
import type { AuthUser, AuthenticatedSession } from './auth.types';
import { sendEmail } from '../../infrastructure/mail/mailer';

type AuthInput = {
  name?: string;
  email: string;
  password: string;
};

type ForgotPasswordInput = {
  email: string;
};

type ResetPasswordInput = {
  token: string;
  password: string;
  confirmPassword: string;
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
const RESET_TOKEN_TTL_MINUTES = 20;

const getFrontendBaseUrl = (): string => {
  const frontendUrls = (process.env.FRONTEND_URLS ?? process.env.FRONTEND_URL ?? 'http://localhost:3000')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  if (process.env.NODE_ENV === 'production') {
    return (
      frontendUrls.find((value) => value.startsWith('https://')) ||
      frontendUrls.find((value) => !value.includes('localhost')) ||
      frontendUrls[0] ||
      'https://fin-ops-suite.vercel.app'
    );
  }

  return frontendUrls[0] || 'http://localhost:3000';
};

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

export const forgotPassword = async ({
  email,
}: ForgotPasswordInput): Promise<void> => {
  const normalizedEmail = normalizeEmail(email);
  const user = await authRepository.findByEmail(normalizedEmail);

  if (!user) {
    logger.info({ email: normalizedEmail }, 'Password reset skipped because user was not found');
    return;
  }

  if (!user.password) {
    logger.info(
      { email: normalizedEmail, isOAuth: user.isOAuth, provider: user.provider },
      'Password reset skipped because account has no local password',
    );
    return;
  }

  if (!process.env.RESEND_API_KEY) {
    throw new Error('Email service is not configured');
  }

  const senderAddress = process.env.EMAIL_FROM?.trim() || 'FinOps Suite <onboarding@resend.dev>';
  const replyToAddress = process.env.OWNER_EMAIL?.trim().toLowerCase();

  if (
    senderAddress.includes('resend.dev') &&
    replyToAddress &&
    normalizedEmail !== replyToAddress
  ) {
    logger.warn(
      {
        email: normalizedEmail,
        senderAddress,
        replyToAddress,
      },
      'Password reset email blocked because resend.dev sender can only be used for limited testing',
    );
    throw new Error('Verify your own sending domain in Resend before sending reset links to other users.');
  }

  await authRepository.invalidatePasswordResetTokens(user.id);

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000);

  await authRepository.createPasswordResetToken(user.id, token, expiresAt);

  const resetUrl = `${getFrontendBaseUrl()}/reset-password?token=${token}`;
  const expiresLabel = `${RESET_TOKEN_TTL_MINUTES} minutes`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Reset your FinOps Suite password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #0f172a;">
          <h2 style="margin-bottom: 12px;">Reset your password</h2>
          <p style="line-height: 1.6; color: #334155;">
            We received a request to reset your FinOps Suite password. Use the button below to create a new password.
          </p>
          <p style="margin: 28px 0;">
            <a href="${resetUrl}" style="background: #0f766e; color: #ffffff; text-decoration: none; padding: 14px 22px; border-radius: 10px; display: inline-block; font-weight: 600;">
              Create new password
            </a>
          </p>
          <p style="line-height: 1.6; color: #334155;">
            This link expires in ${expiresLabel} and can only be used once.
          </p>
          <p style="line-height: 1.6; color: #64748b; font-size: 14px;">
            If you did not request a password reset, you can safely ignore this email.
          </p>
        </div>
      `,
      text: `Reset your FinOps Suite password

We received a request to reset your password.

Create a new password using this secure link:
${resetUrl}

This link expires in ${expiresLabel} and can only be used once.

If you did not request a password reset, you can ignore this email.`,
    });
  } catch (error) {
    logger.error({ error, email: normalizedEmail }, 'Password reset email failed');
    throw new Error('Password reset email could not be sent');
  }
};

export const resetPassword = async ({
  token,
  password,
}: ResetPasswordInput): Promise<void> => {
  const passwordResetToken = await authRepository.findValidPasswordResetToken(token);

  if (!passwordResetToken?.user?.id) {
    throw new Error('Reset link is invalid or expired');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const role = resolveRole(passwordResetToken.user.email, passwordResetToken.user.role);

  await authRepository.setPassword(
    passwordResetToken.user.id,
    passwordResetToken.user.name ?? undefined,
    hashedPassword,
    role,
  );
  await authRepository.markPasswordResetTokenUsed(passwordResetToken.id);
  await authRepository.invalidatePasswordResetTokens(passwordResetToken.user.id);
};
