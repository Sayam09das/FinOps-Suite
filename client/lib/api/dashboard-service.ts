import { apiRequest } from './client';
import type { DashboardData } from './types';

export const dashboardService = {
  get: (token: string) =>
    apiRequest<DashboardData>('/api/dashboard', {
      token,
      method: 'GET',
    }),
};
