import type { Request, Response } from 'express';
import { ApiResponse } from '../../common/utils/apiResponse';

export const logout = (req: Request, res: Response): void => {
  // Clear cookies
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  ApiResponse.success(null, res, 200, 'Logged out successfully');
};

