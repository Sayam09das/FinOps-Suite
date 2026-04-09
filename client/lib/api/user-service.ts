import { apiClient } from './client';
import { apiEndpoints } from './endpoints';
import type { CurrentUser } from './types';

export const userService = {
  getCurrent: () => apiClient.get<CurrentUser>(apiEndpoints.user.current),
};
