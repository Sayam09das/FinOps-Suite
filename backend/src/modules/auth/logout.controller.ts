import type { Request, Response } from 'express';
import { ApiResponse } from '../../common/utils/apiResponse';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'none' as const,
  path: '/',
};

export const logout = (req: Request, res: Response): void => {
  res.clearCookie('finops.access-token', COOKIE_OPTIONS);
  res.clearCookie('finops.refresh-token', COOKIE_OPTIONS);
  ApiResponse.success(null, res, 200, 'Logged out successfully');
};

