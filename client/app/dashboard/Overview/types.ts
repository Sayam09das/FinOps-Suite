import type { LucideIcon } from "lucide-react";

export type OverviewTone = "positive" | "warning" | "danger" | "neutral";
export type OverviewValueFormat = "currency" | "number" | "percent";
export type ChartRange = "Weekly" | "Monthly" | "Yearly";

export interface SummaryMetric {
  title: string;
  value: number;
  helper: string;
  delta: number;
  tone: OverviewTone;
  format: OverviewValueFormat;
  icon: LucideIcon;
}

export interface CashFlowPoint {
  label: string;
  income: number;
  expense: number;
  cashFlow: number;
}

export interface InsightItem {
  title: string;
  detail: string;
  helper: string;
  tone: OverviewTone;
  icon: LucideIcon;
}

export interface CategorySlice {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface GoalItem {
  name: string;
  current: number;
  target: number;
  deadline: string;
  helper: string;
  tone: OverviewTone;
}

export interface AccountItem {
  name: string;
  type: string;
  balance: number;
  change: number;
  accent: string;
}

export interface BudgetHealthItem {
  name: string;
  spent: number;
  budget: number;
  remaining: number;
  utilization: number;
  tone: OverviewTone;
  note?: string;
}

export interface AlertItem {
  title: string;
  detail: string;
  time: string;
  tone: OverviewTone;
  icon: LucideIcon;
}

export interface OverviewViewModel {
  summaryMetrics: SummaryMetric[];
  cashFlowSeries: Record<ChartRange, CashFlowPoint[]>;
  insights: InsightItem[];
  transactions: Array<{
    id: string;
    category: string;
    description: string;
    type: "income" | "expense";
    amount: number;
    date: string;
  }>;
  categoryBreakdown: CategorySlice[];
  goals: GoalItem[];
  accounts: AccountItem[];
  budgetHealth: BudgetHealthItem[];
  alerts: AlertItem[];
}
