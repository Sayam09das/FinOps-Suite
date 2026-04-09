import { apiClient } from './client';
import { apiEndpoints } from './endpoints';
import type { DashboardData } from './types';

export const dashboardService = {
  get: () => apiClient.get<DashboardData>(apiEndpoints.dashboard.root),
};
