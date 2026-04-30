import type { Request, Response } from 'express';
import { ApiResponse } from '../../common/utils/apiResponse';

// Environment-aware cookie options for clearCookie to match setCookie
const isProduction = process.env.NODE_ENV === 'production';
const COOKIE_OPTIONS: {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'none' | 'lax';
  path: '/';
} = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  path: '/',
};

export const logout = (req: Request, res: Response): void => {
  res.clearCookie('finops.access-token', COOKIE_OPTIONS);
  res.clearCookie('finops.refresh-token', COOKIE_OPTIONS);
  ApiResponse.success(null, res, 200, 'Logged out successfully');
};

