import type { Request, Response } from 'express';
import { ApiResponse } from '../../common/utils/apiResponse';

export const logout = (req: Request, res: Response): void => {
  // Clear cookies with cross-origin options
  res.clearCookie('finops.access-token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });
  res.clearCookie('finops.refresh-token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });
  ApiResponse.success(null, res, 200, 'Logged out successfully');
};

