import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80).optional(),
  preferredCurrency: z.enum(['USD', 'INR', 'EUR', 'GBP']).optional(),
  locale: z.string().min(2).max(20).optional(),
  timezone: z.string().min(2).max(60).optional(),
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  weeklyDigest: z.boolean().optional(),
  budgetAlerts: z.boolean().optional(),
  securityAlerts: z.boolean().optional(),
});

export const getProfileSchema = z.object({});
