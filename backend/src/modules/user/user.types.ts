export type AppUserRole = 'USER' | 'ADMIN';

export interface CurrentUser {
  id: string;
  clerkId: string;
  email: string;
  role: AppUserRole;
  createdAt: Date;
}
