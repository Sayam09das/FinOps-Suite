import { apiRequest } from './client';
import type { CurrentUser } from './types';

export const userService = {
  getCurrent: (token: string) =>
    apiRequest<CurrentUser>('/api/user', {
      token,
      method: 'GET',
    }),
};
