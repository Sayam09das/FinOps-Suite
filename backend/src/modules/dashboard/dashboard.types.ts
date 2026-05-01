import { Transaction, Budget } from '@prisma/client';

export interface DashboardData {
  income: number;
  expense: number;
  balance: number;
  netWorth: number;
  assets: number;
  liabilities: number;
  trend: number;
  recentTransactions: Transaction[];
  categoryAnalytics: Record<string, number>;
  budgets: Record<string, DashboardBudgetStatus>;
  savingsRate: number;
  weeklyData: WeeklyDataPoint[];
  accounts: AccountSummary[];
  recurringExpenses: RecurringExpenseItem[];
  alerts: AlertItem[];
  budgetSummary: BudgetSummaryItem[];
}

export interface NetWorthData {
  totalNetWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  changeAmount: number;
  changePercent: number;
  changeDirection: "up" | "down";
  currency: string;
  assets: NetWorthAsset[];
  liabilities: NetWorthLiability[];
  assetDistribution: AssetDistributionSlice[];
  trendSeries: TrendPoint[];
  insights: NetWorthInsight[];
  healthScore: number;
  projection: {
    futureValue: number;
    months: number;
    confidence: number;
  };
}

export interface NetWorthAsset {
  id: string;
  name: string;
  category: string;
  amount: number;
  percentage: number;
  color: string;
  change?: number;
}

export interface NetWorthLiability {
  id: string;
  name: string;
  category: string;
  amount: number;
  percentage: number;
  color: string;
  interestRate?: number;
  dueDate?: string;
  dueInDays?: number;
  change?: number;
}

export interface AssetDistributionSlice {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface TrendPoint {
  label: string;
  value: number;
  assets: number;
  liabilities: number;
}

export interface NetWorthInsight {
  id: string;
  title: string;
  detail: string;
  tone: "positive" | "warning" | "danger" | "neutral";
  metric?: string;
}

export interface WeeklyDataPoint {
  week: string;
  income: number;
  expense: number;
}

export interface DashboardBudgetStatus {
  budget: number;
  spent: number;
  remaining: number;
  alert?: string;
}

export interface AccountSummary {
  id: string;
  name: string;
  balance: number;
  type: string;
}

export interface RecurringExpenseItem {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
}

export interface AlertItem {
  id: string;
  message: string;
  type: 'warning' | 'error' | 'info';
  createdAt: string;
}

export interface BudgetSummaryItem {
  category: string;
  budget: number;
  actual: number;
  difference: number;
  status: 'over' | 'under' | 'ontrack';
}
