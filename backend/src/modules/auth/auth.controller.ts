import type { Request, Response } from 'express';
import { ApiResponse } from '../../common/utils/apiResponse';
import { getUserProfile } from '../user/user.service';
import {
  createAccount,
  createFreshSession,
  loginUser,
} from './auth.service';
import type { AuthenticatedSession } from './auth.types';

export const sendAuthResponse = (
  session: AuthenticatedSession,
  res: Response,
  statusCode: number,
  message: string,
) => {
  ApiResponse.success(
    {
      ...session.user,
      user: session.user,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
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
    sendAuthResponse(session, res, 200, 'Login successful');
  } catch (error) {
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
