import { apiRequest } from './client';
import type { DashboardData } from './types';

export const dashboardService = {
  get: () =>
    apiRequest<DashboardData>('/api/dashboard', {
      method: 'GET',
    }),
};
