import { apiClient } from './client';
import { apiEndpoints } from './endpoints';
import type {
  AuthUser,
  CurrentUser,
  LoginPayload,
  OAuthExchangePayload,
  RegisterPayload,
} from './types';

export const authService = {
  login: (payload: LoginPayload) =>
    apiClient.post<AuthUser>(apiEndpoints.auth.login, payload),

  register: (payload: RegisterPayload) =>
    apiClient.post<AuthUser>(apiEndpoints.auth.register, payload),

  completeOAuth: (payload: OAuthExchangePayload) =>
    apiClient.post<AuthUser>(apiEndpoints.auth.oauth, payload),

  getSession: () => apiClient.get<CurrentUser | null>(apiEndpoints.auth.session),

  logout: () => apiClient.post<null>(apiEndpoints.auth.logout),
};
