import { Job } from 'bullmq';
import { prisma } from '../config/db';
import { logger } from '../config/logger';
import { sendEmail } from '../infrastructure/mail/mailer';

export interface BudgetAlertsData {}

export async function processBudgetAlerts(job?: Job<BudgetAlertsData>): Promise<void> {
  logger.info('Running budget alerts job', { jobId: job?.id });

  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const budgets = await prisma.budget.findMany({
    where: { 
      isActive: true 
    },
    include: {
      transactions: {
        where: {
          createdAt: {
            gte: startOfMonth
          }
        },
        select: {
          amount: true
        }
      },
      user: {
        select: {
          email: true,
          name: true
        }
      }
    }
  });

  for (const budget of budgets) {
    const monthlySpend: number = budget.transactions.reduce((sum: number, tx: { amount: number }) => sum + tx.amount, 0);
    if (monthlySpend > budget.limit) {
      await sendEmail({
        to: budget.user.email,
        subject: `Budget Alert: ${budget.name} exceeded`,
        html: `
          <h1>Budget Alert</h1>
          <p>Hi ${budget.user.name},</p>
          <p>Your '${budget.name}' budget of $${budget.limit} has been exceeded this month.</p>
          <p>Current spend: $${monthlySpend.toFixed(2)}</p>
        `
      });
      logger.info(`Budget alert sent for budget ${budget.id}`);
    }
  }

  logger.info('Budget alerts job completed');
}
