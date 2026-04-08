import type { AuthRepositoryUser } from '../src/modules/auth/auth.repository';

declare global {
  namespace Express {
    interface Request {
      user?: AuthRepositoryUser;
    }
  }
}

export {};

