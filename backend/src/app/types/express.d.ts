import type { AuthRepositoryUser } from '../modules/auth/auth.repository';

declare global {
  namespace Express {
    interface Request {
      user?: AuthRepositoryUser;
    }
  }
}

export {};

