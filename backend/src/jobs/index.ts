import { Queue } from 'bullmq';
import { logger } from '../config/logger';
import redis from '../infrastructure/cache/redis';
import type { BudgetAlertsData } from './budgetAlerts.job';
import type { RecurringTransactionsData } from './recurringTransactions.job';
import type { CleanupData } from './cleanup.job';
import { processBudgetAlerts } from './budgetAlerts.job';
import { processRecurringTransactions } from './recurringTransactions.job';
import { processCleanup } from './cleanup.job';

export const jobQueue = redis ? new Queue('scheduledJobs', { connection: redis }) : null;

export const scheduleJobs = async (): Promise<void> => {
  if (!jobQueue) {
    logger.warn('Skipping job scheduling - Redis unavailable');
    return;
  }

  try {
    // Budget alerts: Daily at 9AM
    await jobQueue.add('budgetAlerts', {} as BudgetAlertsData, { 
      repeat: { cron: '0 9 * * *' },
      removeOnComplete: 1,
      removeOnFail: 3 
    });

    // Recurring transactions: 1st of every month at midnight
    await jobQueue.add('recurringTransactions', {} as RecurringTransactionsData, { 
      repeat: { cron: '0 0 1 * *' },
      removeOnComplete: 1,
      removeOnFail: 3 
    });

    // Cleanup: Weekly Sunday at midnight
    await jobQueue.add('cleanup', {} as CleanupData, { 
      repeat: { cron: '0 0 * * 0' },
      removeOnComplete: 1,
      removeOnFail: 3 
    });

    logger.info('All scheduled jobs configured successfully');
  } catch (error) {
    logger.error(error, 'Failed to schedule jobs');
  }
};
