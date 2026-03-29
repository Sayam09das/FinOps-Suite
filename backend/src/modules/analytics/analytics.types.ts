import { Transaction } from '@prisma/client';

export interface AnalyticsOverview {
  period: string; // e.g. "2024-01"
  income: number;
  expense: number;
  balance: number;
  categories: Record<string, { spent: number; percentage: number }>;
}

export interface AnalyticsTrend {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export interface BudgetCompliance {
  category: string;
  budgeted: number;
  spent: number;
  compliance: number; // percentage
  status: 'OK' | 'WARNING' | 'EXCEEDED';
}

export interface AnalyticsForecast {
  nextMonthIncome: number;
  nextMonthExpense: number;
  projectedBalance: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface AnalyticsData {
  overview: AnalyticsOverview;
  trends: AnalyticsTrend[];
  budgetCompliance: BudgetCompliance[];
  forecast: AnalyticsForecast;
  topCategories: string[];
}
