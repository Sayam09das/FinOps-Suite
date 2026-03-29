import { Transaction } from '@prisma/client';

export interface DashboardData {
  income: number;
  expense: number;
  balance: number;
  recentTransactions: Transaction[];
  categoryAnalytics: Record<string, number>;
}
