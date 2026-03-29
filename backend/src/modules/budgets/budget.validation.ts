import { z } from 'zod';
import { CreateBudgetRequest, BudgetStatusQuery } from './budget.types';

export const createBudgetSchema = z.object({
  category: z.string().min(1, 'Category is required').max(50),
  amount: z.number().positive('Amount must be positive'),
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Month must be YYYY-MM format'),
}) satisfies z.ZodType<CreateBudgetRequest>;

export const budgetStatusQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Month must be YYYY-MM format').optional(),
}) satisfies z.ZodType<BudgetStatusQuery>;

