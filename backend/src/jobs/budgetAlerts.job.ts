import { Job } from 'bullmq';
import prisma from '../config/db';
import { logger } from '../config/logger';
import { sendEmail } from '../infrastructure/mail/mailer';

export interface BudgetAlertsData {}

export async function processBudgetAlerts(job?: Job<BudgetAlertsData>): Promise<void> {
  logger.info({ jobId: job?.id }, 'Running budget alerts job');

  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const currentMonth = startOfMonth.toISOString().slice(0, 7);

  const budgets = await prisma.budget.findMany({
    where: {
      month: currentMonth,
    },
  });

  for (const budget of budgets) {
    const [user, spent] = await Promise.all([
      prisma.user.findUnique({
        where: { id: budget.userId },
        select: { email: true },
      }),
      prisma.transaction.aggregate({
        where: {
          userId: budget.userId,
          category: budget.category,
          type: 'expense',
          date: {
            gte: startOfMonth,
          },
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    const monthlySpend = spent._sum.amount ?? 0;

    if (user && monthlySpend > budget.amount) {
      await sendEmail({
        to: user.email,
        subject: `Budget Alert: ${budget.category} exceeded`,
        html: `
          <h1>Budget Alert</h1>
          <p>Your '${budget.category}' budget of $${budget.amount} has been exceeded this month.</p>
          <p>Current spend: $${monthlySpend.toFixed(2)}</p>
        `
      });
      logger.info({ budgetId: budget.id }, 'Budget alert sent');
    }
  }

  logger.info('Budget alerts job completed');
}
