import { apiRequest } from './client';
import type { CurrentUser } from './types';

export const userService = {
  getCurrent: () =>
    apiRequest<CurrentUser>('/api/user', {
      method: 'GET',
    }),
};
