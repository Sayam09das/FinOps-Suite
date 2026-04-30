import { z } from 'zod';

export const createTransactionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Category is required'),
  note: z.string().optional(),
  date: z.string().optional(),
  createdAt: z.string().optional(),
  accountId: z.string().optional(),
}).strict();

export const updateTransactionSchema = z.object({
  amount: z.number().positive('Amount must be positive').optional(),
  type: z.enum(['income', 'expense']).optional(),
  category: z.string().min(1, 'Category is required').optional(),
  note: z.string().optional(),
  date: z.string().optional(),
  createdAt: z.string().optional(),
  accountId: z.string().optional(),
}).strict();
