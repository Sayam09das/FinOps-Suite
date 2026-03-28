import { z } from 'zod';

export const updateUserSchema = z.object({
  email: z.string().email('Invalid email').optional(),
});

export const getProfileSchema = z.object({});
