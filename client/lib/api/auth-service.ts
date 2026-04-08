import { apiRequest } from './client';
import type {
  AuthUser,
  CurrentUser,
  LoginPayload,
  OAuthExchangePayload,
  RegisterPayload,
} from './types';

export const authService = {
  login: (payload: LoginPayload) =>
    apiRequest<AuthUser>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  register: (payload: RegisterPayload) =>
    apiRequest<AuthUser>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  completeOAuth: (payload: OAuthExchangePayload) =>
    apiRequest<AuthUser>('/api/auth/oauth', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getSession: () =>
    apiRequest<CurrentUser>('/api/auth/session', {
      method: 'GET',
    }),

  logout: () =>
    apiRequest<null>('/api/auth/logout', {
      method: 'POST',
    }),
};
