import type { Request, Response } from 'express';
import { ApiResponse } from '../../common/utils/apiResponse';
import { getUserProfile } from '../user/user.service';
import {
  createAccount,
  createFreshSession,
  loginUser,
} from './auth.service';
import type { AuthenticatedSession } from './auth.types';
import { securityRepository } from '../security/security.repository';

export const sendAuthResponse = (
  session: AuthenticatedSession,
  res: Response,
  statusCode: number,
  message: string,
) => {
// Cookie configuration: environment-aware for dev/prod
  const isProduction = process.env.NODE_ENV === 'production';
  
  // In production (HTTPS): secure + sameSite: none for cross-site cookies
  // In development (HTTP): no secure flag, sameSite: lax for local cookies
  const cookieOptions: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'none' | 'lax';
    path: '/';
  } = {
    httpOnly: true,
    secure: isProduction, // Only true in production
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
    // Don't set domain for cross-site cookies - let browser handle it
  };

  res.cookie('finops.access-token', session.accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15m
  });
  res.cookie('finops.refresh-token', session.refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
  });
  
// Return user + accessToken + refreshToken for frontend localStorage fallback
  ApiResponse.success(
    { 
      ...session.user, 
      accessToken: session.accessToken,
      refreshToken: session.refreshToken 
    },
    res,

    statusCode,
    message,
  );
};

const handleAuthError = (error: unknown, res: Response) => {
  if (error instanceof Error) {
    if (error.message === 'User already exists') {
      ApiResponse.error(error.message, res, 409);
      return;
    }

    if (
      error.message === 'Invalid email or password' ||
      error.message === 'Invalid refresh token'
    ) {
      ApiResponse.error(error.message, res, 401);
      return;
    }
  }

  throw error;
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const session = await createAccount(req.body);
    sendAuthResponse(session, res, 201, 'Account created successfully');
  } catch (error) {
    handleAuthError(error, res);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const session = await loginUser(req.body);
    await securityRepository.recordLoginAttempt({
      request: req,
      email: req.body.email,
      status: 'success',
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      },
      sessionToken: session.accessToken,
    });
    sendAuthResponse(session, res, 200, 'Login successful');
  } catch (error) {
    await securityRepository.recordLoginAttempt({
      request: req,
      email: req.body.email || 'unknown@local',
      status: 'failed',
      user: null,
    });
    handleAuthError(error, res);
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const session = await createFreshSession(req.body.refreshToken);
    sendAuthResponse(session, res, 200, 'Session refreshed');
  } catch (error) {
    handleAuthError(error, res);
  }
};

export const getSession = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    ApiResponse.error('Unauthorized', res, 401);
    return;
  }

  const profile = await getUserProfile(userId);
  ApiResponse.success(profile, res, 200, 'Current user loaded');
};
