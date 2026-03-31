import { Worker, Job } from 'bullmq';
import redis, { ensureRedisConnection } from '../cache/redis';
import { logger } from '../../config/logger';
import type { CreateNotificationInput } from '../../modules/notifications/notification.types';

let notificationWorker: Worker | null = null;

const sendNotification = async (job: Job) => {
  const { userId, type, title, message } = job.data as CreateNotificationInput;
  
  logger.info({ userId, type, title }, 'Processing notification job');
  
  try {
    // Simulate notification sending (email/push/socket in real impl)
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2s delay
    
    logger.info({ userId, jobId: job.id }, `Notification sent: ${title}`);
    
    // TODO: Save to DB using prisma.notification.create()
    
    return { success: true, sentAt: new Date().toISOString() };
  } catch (error) {
    logger.error({ jobId: job.id, error }, 'Notification job failed');
    throw error;
  }
};

// Start worker
export const startNotificationWorker = async (): Promise<Worker | null> => {
  if (notificationWorker) {
    return notificationWorker;
  }

  const redisReady = await ensureRedisConnection();
  if (!redisReady) {
    logger.warn('Notification queue worker skipped because Redis is unavailable');
    return null;
  }

  notificationWorker = new Worker('notificationQueue', sendNotification, {
    connection: redis,
    concurrency: 5,
  });
  
  notificationWorker.on('completed', (job) => {
    logger.info({ jobId: job.id }, 'Notification job completed');
  });
  
  notificationWorker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, err }, 'Notification job failed');
  });

  notificationWorker.on('closed', () => {
    notificationWorker = null;
  });
  
  logger.info('🟢 Notification queue worker started');
  
  return notificationWorker;
};

export const stopNotificationWorker = async (): Promise<void> => {
  if (!notificationWorker) {
    return;
  }

  await notificationWorker.close();
  notificationWorker = null;
  logger.info('🛑 Notification queue worker stopped');
};
