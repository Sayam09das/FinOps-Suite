export type AppUserRole = 'USER' | 'ADMIN';

export interface CurrentUser {
  id: string;
  name: string | null;
  email: string;
  role: AppUserRole;
  isOAuth: boolean;
  provider: string | null;
  createdAt: Date;
}
