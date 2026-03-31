import prisma from '../../config/db';
import { createNotification } from './notification.service';
import { NotificationType } from './notification.types';
import { logger } from '../../config/logger';

let workerInterval: NodeJS.Timeout | null = null;

export const startNotificationWorker = () => {
  if (workerInterval) return; // Already running

  // 🕐 Run every 5 minutes
  workerInterval = setInterval(async () => {
    logger.info('🔄 Running notification worker...');
    const currentMonth = new Date().toISOString().slice(0, 7);

    // 1. Check budget exceeded
    const budgets = await prisma.budget.findMany({
      where: { month: currentMonth },
    });

    for (const budget of budgets) {
      const spent = await prisma.transaction.aggregate({
        where: {
          userId: budget.userId,
          category: budget.category,
          type: 'expense',
          date: { gte: new Date(`${currentMonth}-01`) },
        },
        _sum: { amount: true },
      });

      const totalSpent = spent._sum.amount || 0;

      if (totalSpent > budget.amount) {
        // Avoid duplicates - check if recent notification exists
        const recentNotif = await prisma.notification.findFirst({
          where: {
            userId: budget.userId,
            type: 'budget_exceeded',
            title: `Budget exceeded for ${budget.category}`,
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        });

        if (!recentNotif || (Date.now() - recentNotif.createdAt.getTime()) > 24 * 60 * 60 * 1000) {
          await createNotification({
            userId: budget.userId,
            type: 'budget_exceeded',
            title: `Budget exceeded for ${budget.category}`,
            message: `You have spent $${totalSpent.toFixed(2)} vs $${budget.amount} budget (over by $${(totalSpent - budget.amount).toFixed(2)})`,
          });
        }
      }
    }

    // 2. Low balance alert (balance < $100 last month)
    // Simplified - implement based on analytics logic
    logger.info('✅ Notification worker complete');
  }, 5 * 60 * 1000); // 5 min

  logger.info('🚀 Notification worker started');
};

export const stopNotificationWorker = () => {
  if (workerInterval) {
    clearInterval(workerInterval);
    workerInterval = null;
    logger.info('🛑 Notification worker stopped');
  }
};
