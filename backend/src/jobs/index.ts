import { Job, Queue, Worker } from 'bullmq';
import { logger } from '../config/logger';
import redis, { ensureRedisConnection } from '../infrastructure/cache/redis';
import type { BudgetAlertsData } from './budgetAlerts.job';
import type { RecurringTransactionsData } from './recurringTransactions.job';
import type { CleanupData } from './cleanup.job';
import { processBudgetAlerts } from './budgetAlerts.job';
import { processRecurringTransactions } from './recurringTransactions.job';
import { processCleanup } from './cleanup.job';

let jobQueue: Queue | null = null;
let jobWorker: Worker | null = null;

const getJobQueue = async (): Promise<Queue | null> => {
  const redisReady = await ensureRedisConnection();
  if (!redisReady) {
    return null;
  }

  if (!jobQueue) {
    jobQueue = new Queue('scheduledJobs', { connection: redis });
  }

  return jobQueue;
};

const runScheduledJob = async (
  job: Job<BudgetAlertsData | RecurringTransactionsData | CleanupData>
): Promise<void> => {
  switch (job.name) {
    case 'budgetAlerts':
      await processBudgetAlerts(job as Job<BudgetAlertsData>);
      return;
    case 'recurringTransactions':
      await processRecurringTransactions(job as Job<RecurringTransactionsData>);
      return;
    case 'cleanup':
      await processCleanup(job as Job<CleanupData>);
      return;
    default:
      logger.warn({ jobName: job.name, jobId: job.id }, 'Unknown scheduled job received');
  }
};

export const startJobWorker = async (): Promise<Worker | null> => {
  const redisReady = await ensureRedisConnection();
  if (!redisReady) {
    logger.warn('Skipping scheduled job worker - Redis unavailable');
    return null;
  }

  if (jobWorker) {
    return jobWorker;
  }

  jobWorker = new Worker('scheduledJobs', runScheduledJob, {
    connection: redis,
    concurrency: 3,
  });

  jobWorker.on('completed', (job) => {
    logger.info({ jobId: job.id, jobName: job.name }, 'Scheduled job completed');
  });

  jobWorker.on('failed', (job, error) => {
    logger.error({ jobId: job?.id, jobName: job?.name, error }, 'Scheduled job failed');
  });

  jobWorker.on('closed', () => {
    jobWorker = null;
  });

  logger.info('Scheduled job worker started');
  return jobWorker;
};

export const stopJobWorker = async (): Promise<void> => {
  if (!jobWorker) {
    return;
  }

  await jobWorker.close();
  jobWorker = null;
  logger.info('Scheduled job worker stopped');
};

export const scheduleJobs = async (): Promise<void> => {
  const queue = await getJobQueue();
  if (!queue) {
    logger.warn('Skipping job scheduling - Redis unavailable');
    return;
  }

  try {
    await startJobWorker();

    // Budget alerts: Daily at 9AM
    await queue.add('budgetAlerts', {} as BudgetAlertsData, {
      repeat: { pattern: '0 9 * * *' },
      removeOnComplete: 1,
      removeOnFail: 3
    });

    // Recurring transactions: 1st of every month at midnight
    await queue.add('recurringTransactions', {} as RecurringTransactionsData, {
      repeat: { pattern: '0 0 1 * *' },
      removeOnComplete: 1,
      removeOnFail: 3
    });

    // Cleanup: Weekly Sunday at midnight
    await queue.add('cleanup', {} as CleanupData, {
      repeat: { pattern: '0 0 * * 0' },
      removeOnComplete: 1,
      removeOnFail: 3
    });

    logger.info('All scheduled jobs configured successfully');
  } catch (error: unknown) {
    logger.error({ error }, 'Failed to schedule jobs');
  }
};
