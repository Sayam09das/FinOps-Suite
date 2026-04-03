import { getAuth } from '@clerk/express';
import type { NextFunction, Request, Response } from 'express';
import { syncUserFromClerk } from '../../modules/user/user.service';
import { ApiResponse } from '../utils/apiResponse';

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const auth = getAuth(req);

    if (!auth.userId) {
      ApiResponse.error('Unauthorized', res, 401);
      return;
    }

    req.user = await syncUserFromClerk(auth.userId);
    next();
  } catch (error) {
    next(error);
  }
};

export const requireRole = (...roles: Array<'USER' | 'ADMIN'>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ApiResponse.error('Unauthorized', res, 401);
      return;
    }

    if (!roles.includes(req.user.role)) {
      ApiResponse.error('Forbidden', res, 403);
      return;
    }

    next();
  };
};
