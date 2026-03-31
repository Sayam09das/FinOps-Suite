import { Job } from 'bullmq';
import { readdir, stat, unlink } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import prisma from '../config/db';
import { logger } from '../config/logger';

export interface CleanupData {}

async function deleteOldTempFiles(directory: string, cutoffTime: number): Promise<number> {
  try {
    const entries = await readdir(directory, { withFileTypes: true });

    const results = await Promise.allSettled(
      entries.map(async (entry) => {
        const entryPath = join(directory, entry.name);

        if (entry.isDirectory()) {
          return deleteOldTempFiles(entryPath, cutoffTime);
        }

        if (!entry.isFile()) {
          return 0;
        }

        const { mtimeMs } = await stat(entryPath);

        if (mtimeMs >= cutoffTime) {
          return 0;
        }

        await unlink(entryPath);
        return 1;
      })
    );

    return results.reduce((count, result) => {
      if (result.status === 'fulfilled') {
        return count + result.value;
      }

      logger.warn({ error: result.reason, directory }, 'Failed to delete temp file');
      return count;
    }, 0);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      logger.warn({ error, directory }, 'Failed to scan temp directory');
    }

    return 0;
  }
}

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

  const deletedTempFiles = (
    await Promise.all([
      deleteOldTempFiles(resolve(__dirname, '..', '..', 'tmp'), thirtyDaysAgo.getTime()),
      deleteOldTempFiles(resolve(__dirname, '..', '..', 'temp'), thirtyDaysAgo.getTime()),
    ])
  ).reduce((total, count) => total + count, 0);

  logger.info({ 
    deletedNotifications: deletedNotifications.count,
    deletedTempFiles,
  }, 'Cleanup job completed');
}
