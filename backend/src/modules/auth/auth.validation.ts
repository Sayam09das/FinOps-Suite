import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshSchema = z.object({
  token: z.string().min(1, 'Refresh token is required').optional(),
  refreshToken: z.string().min(1, 'Refresh token is required').optional(),
}).refine((data) => Boolean(data.token || data.refreshToken), {
  message: 'Refresh token is required',
  path: ['token'],
});
