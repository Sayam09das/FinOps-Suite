import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { authRepository } from '../../modules/auth/auth.repository';
import { ApiResponse } from '../utils/apiResponse';
import type { AuthRepositoryUser } from '../../modules/auth/auth.repository';

declare global {
  namespace Express {
    interface Request {
      user?: AuthRepositoryUser;
    }
  }
}

type AccessTokenPayload = {
  userId: string;
  email: string;
  role: 'USER' | 'ADMIN';
  type: 'access';
};

const getAccessSecret = () =>
  process.env.JWT_ACCESS_SECRET || 'finops-access-secret';

const getToken = (req: Request): string | null => {
  // Priority 1: httpOnly cookie
  const cookieToken = req.cookies?.accessToken;
  if (cookieToken) return cookieToken;

  // Fallback: Bearer header
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const [scheme, token] = authHeader.split(' ');
    if (scheme === 'Bearer' && token) return token;
  }

  return null;
};

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = getToken(req);
    if (!token) {
      ApiResponse.error('No token provided', res, 401);
      return;
    }

    const payload = jwt.verify(token, getAccessSecret()) as AccessTokenPayload;
    if (payload.type !== 'access' || !payload.userId) {
      ApiResponse.error('Invalid token', res, 401);
      return;
    }

    const user = await authRepository.findById(payload.userId);
    if (!user) {
      ApiResponse.error('User not found', res, 401);
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    ApiResponse.error('Unauthorized', res, 401);
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
