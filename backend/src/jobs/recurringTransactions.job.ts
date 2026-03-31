import { Job } from 'bullmq';
import prisma from '../config/db';
import { logger } from '../config/logger';

export interface RecurringTransactionsData {}

export async function processRecurringTransactions(job?: Job<RecurringTransactionsData>): Promise<void> {
  logger.info({ jobId: job?.id }, 'Running recurring transactions job');

  // Example: Create a monthly expense transaction for each category budget
  const budgets = await prisma.budget.findMany();

  for (const budget of budgets) {
    await prisma.transaction.create({
      data: {
        userId: budget.userId,
        amount: budget.amount,
        category: budget.category,
        type: 'expense',
        note: `Recurring budget for ${budget.category} - ${budget.month}`,
        date: new Date()
      }
    });
    logger.info({ budgetId: budget.id }, 'Created recurring transaction');
  }

  logger.info('Recurring transactions job completed');
}
