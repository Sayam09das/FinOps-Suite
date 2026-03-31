import { Queue } from 'bullmq';
import redis, { ensureRedisConnection } from '../cache/redis';
import { logger } from '../../config/logger';

let notificationQueue: Queue | null = null;

const getNotificationQueue = async (): Promise<Queue | null> => {
  const redisReady = await ensureRedisConnection();
  if (!redisReady) {
    return null;
  }

  if (!notificationQueue) {
    notificationQueue = new Queue('notificationQueue', {
      connection: redis,
      defaultJobOptions: {
        removeOnComplete: 10,
        removeOnFail: 50,
      },
    });
  }

  return notificationQueue;
};

export const addNotificationJob = async (data: unknown) => {
  try {
    const queue = await getNotificationQueue();
    if (!queue) {
      logger.warn('Skipping notification job because Redis is unavailable');
      return null;
    }

    const job = await queue.add('sendNotification', data);
    logger.info({ jobId: job.id }, 'Notification job added to queue');
    return job;
  } catch (error: unknown) {
    logger.error({ error }, 'Failed to add notification job');
    throw error;
  }
};
