import type { AppUserRole } from '../user/user.types';

export type AuthUser = {
  id: string;
  name: string | null;
  email: string;
  role: AppUserRole;
  isOAuth: boolean;
  provider: string | null;
  createdAt: Date;
};

export type AuthenticatedSession = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

