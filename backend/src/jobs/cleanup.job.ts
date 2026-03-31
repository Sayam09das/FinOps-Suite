import { Job } from 'bullmq';
import prisma from '../config/db';
import { logger } from '../config/logger';
import { fileStorage } from '../infrastructure/storage/fileStorage'; // todo implement

export interface CleanupData {}

export async function processCleanup(job?: Job<CleanupData>): Promise<void> {
  logger.info({ jobId: job?.id }, 'Running cleanup job');

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // Delete old notifications (older than 30 days)
  const deletedNotifications = await prisma.notification.deleteMany({
    where: {
      createdAt: {
        lt: thirtyDaysAgo
      }
    }
  });

  // TODO: Delete old temp files
  // await fileStorage.cleanupOldFiles(thirtyDaysAgo);

  logger.info({ 
    deletedNotifications: deletedNotifications.count 
  }, 'Cleanup job completed');
}
