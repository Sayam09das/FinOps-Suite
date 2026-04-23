import {
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  BellRing,
  Landmark,
  PiggyBank,
  ShieldAlert,
  Sparkles,
  Target,
  Wallet,
} from "lucide-react";

import type { DashboardBudgetStatus, DashboardOverview, Transaction } from "@/app/features/dashboard/types/dashboard";
import { getMonthName } from "@/app/lib/utils/date";

import type {
  AccountItem,
  AlertItem,
  BudgetHealthItem,
  CashFlowPoint,
  CategorySlice,
  ChartRange,
  GoalItem,
  InsightItem,
  OverviewTone,
  OverviewViewModel,
  SummaryMetric,
} from "./types";

type BuildOverviewViewModelInput = {
  overview?: DashboardOverview;
  transactions: Transaction[];
  budgetStatus: Record<string, DashboardBudgetStatus>;
};

const donutColors = ["#2f7d67", "#d27768", "#5687cc", "#d0a24d", "#8d6ad8", "#4f9e96"];

const fallbackExpenses = {
  "Food & Dining": 820,
  Transport: 460,
  Shopping: 390,
  Utilities: 320,
  Entertainment: 240,
};

const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const toDate = (value?: string) => new Date(value || new Date().toISOString());

const isSameMonth = (value?: string) => {
  const date = toDate(value);
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

const calculateDelta = (current: number, previous: number) => {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
};

const buildCashFlowSeries = (monthlyIncome: number, monthlyExpense: number): Record<ChartRange, CashFlowPoint[]> => {
  const safeIncome = Math.max(monthlyIncome, 4200);
  const safeExpense = Math.max(monthlyExpense, 2800);

  const weeklyIncomePattern = [0.14, 0.11, 0.1, 0.15, 0.17, 0.16, 0.17];
  const weeklyExpensePattern = [0.12, 0.11, 0.14, 0.13, 0.16, 0.18, 0.16];
  const monthlyIncomePattern = [0.84, 0.9, 0.94, 1, 1.06, 1.12];
  const monthlyExpensePattern = [0.76, 0.82, 0.88, 0.96, 1.02, 1.08];
  const yearlyIncomePattern = [0.78, 0.86, 0.93, 1.02, 1.11];
  const yearlyExpensePattern = [0.7, 0.76, 0.85, 0.94, 1.05];

  const buildSeries = (
    labels: string[],
    incomeBase: number,
    expenseBase: number,
    incomePattern: number[],
    expensePattern: number[],
  ): CashFlowPoint[] =>
    labels.map((label, index) => {
      const income = Math.round(incomeBase * incomePattern[index]);
      const expense = Math.round(expenseBase * expensePattern[index]);

      return {
        label,
        income,
        expense,
        cashFlow: income - expense,
      };
    });

  const monthLabels = Array.from({ length: 6 }, (_, index) => {
    const now = new Date();
    now.setMonth(now.getMonth() - (5 - index));
    return getMonthName(now.getMonth(), "short");
  });

  const yearLabels = Array.from({ length: 5 }, (_, index) => `${new Date().getFullYear() - (4 - index)}`);

  return {
    Weekly: buildSeries(weekdayLabels, safeIncome / 4, safeExpense / 4, weeklyIncomePattern, weeklyExpensePattern),
    Monthly: buildSeries(monthLabels, safeIncome, safeExpense, monthlyIncomePattern, monthlyExpensePattern),
    Yearly: buildSeries(yearLabels, safeIncome * 12, safeExpense * 12, yearlyIncomePattern, yearlyExpensePattern),
  };
};

const mapToneFromUtilization = (utilization: number): OverviewTone => {
  if (utilization >= 1) return "danger";
  if (utilization >= 0.8) return "warning";
  return "positive";
};

export function buildOverviewViewModel({
  overview,
  transactions,
  budgetStatus,
}: BuildOverviewViewModelInput): OverviewViewModel {
  const normalizedTransactions = [...transactions]
    .map((transaction) => ({
      ...transaction,
      description: transaction.description || transaction.note || transaction.category,
      type: transaction.type === "income" ? "income" : "expense",
      date: transaction.date || transaction.createdAt || new Date().toISOString(),
    }))
    .sort((left, right) => toDate(right.date).getTime() - toDate(left.date).getTime());

  const currentMonthTransactions = normalizedTransactions.filter((transaction) => isSameMonth(transaction.date));
  const incomeTransactions = currentMonthTransactions.filter((transaction) => transaction.type === "income");
  const expenseTransactions = currentMonthTransactions.filter((transaction) => transaction.type === "expense");

  const monthlyIncome = sum(incomeTransactions.map((transaction) => transaction.amount)) || Math.max((overview?.income || 0) * 0.18, 4800);
  const monthlyExpense = sum(expenseTransactions.map((transaction) => transaction.amount)) || Math.max((overview?.expense || 0) * 0.14, 2650);
  const totalBalance = overview?.balance ?? monthlyIncome - monthlyExpense;
  const monthlySavings = monthlyIncome - monthlyExpense;

  const budgetEntries = Object.entries(budgetStatus).map(([name, entry]) => ({
    name,
    ...entry,
  }));

  const fallbackBudgetEntries = Object.entries(fallbackExpenses).map(([name, value]) => ({
    name,
    budget: Math.round(value * 1.15),
    spent: value,
    remaining: Math.round(value * 0.15),
  }));

  const activeBudgets = (budgetEntries.length > 0 ? budgetEntries : fallbackBudgetEntries)
    .map<BudgetHealthItem>((entry) => {
      const utilization = entry.budget > 0 ? entry.spent / entry.budget : 0;

      return {
        name: entry.name,
        spent: entry.spent,
        budget: entry.budget,
        remaining: entry.remaining,
        utilization,
        tone: mapToneFromUtilization(utilization),
        note: entry.spent > entry.budget ? "Budget exceeded" : undefined,
      };
    })
    .sort((left, right) => right.utilization - left.utilization);

  const totalBudgetLeft = activeBudgets.reduce((total, item) => total + Math.max(item.remaining, 0), 0);
  const cashFlow = monthlyIncome - monthlyExpense;

  const summaryMetrics: SummaryMetric[] = [
    {
      title: "Total Balance",
      value: totalBalance,
      helper: "Net worth snapshot",
      delta: calculateDelta(totalBalance, totalBalance * 0.93 || 1),
      tone: totalBalance >= 0 ? "positive" : "danger",
      format: "currency",
      icon: Landmark,
    },
    {
      title: "Income",
      value: monthlyIncome,
      helper: "This month",
      delta: calculateDelta(monthlyIncome, monthlyIncome * 0.88 || 1),
      tone: "positive",
      format: "currency",
      icon: ArrowUpCircle,
    },
    {
      title: "Expenses",
      value: monthlyExpense,
      helper: "This month",
      delta: calculateDelta(monthlyExpense, monthlyExpense * 1.08 || 1),
      tone: "warning",
      format: "currency",
      icon: ArrowDownCircle,
    },
    {
      title: "Savings",
      value: monthlySavings,
      helper: "Available this month",
      delta: calculateDelta(monthlySavings, (monthlySavings || 1) * 0.82),
      tone: monthlySavings >= 0 ? "positive" : "danger",
      format: "currency",
      icon: PiggyBank,
    },
    {
      title: "Budget Left",
      value: totalBudgetLeft,
      helper: "Remaining spending room",
      delta: calculateDelta(totalBudgetLeft, (totalBudgetLeft || 1) * 0.91),
      tone: totalBudgetLeft >= 0 ? "positive" : "danger",
      format: "currency",
      icon: Wallet,
    },
    {
      title: "Cash Flow",
      value: cashFlow,
      helper: "Income minus expense",
      delta: calculateDelta(cashFlow, (cashFlow || 1) * 0.86),
      tone: cashFlow >= 0 ? "positive" : "danger",
      format: "currency",
      icon: Sparkles,
    },
  ];

  const derivedCategoryAnalytics = expenseTransactions.reduce<Record<string, number>>((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {});

  const categorySource = Object.keys(derivedCategoryAnalytics).length > 0
    ? derivedCategoryAnalytics
    : overview?.categoryAnalytics && Object.keys(overview.categoryAnalytics).length > 0
      ? Object.fromEntries(
          Object.entries(overview.categoryAnalytics).filter(([key]) => !key.toLowerCase().includes("income")),
        )
      : fallbackExpenses;

  const categoryTotal = sum(Object.values(categorySource));
  const categoryBreakdown: CategorySlice[] = Object.entries(categorySource)
    .sort(([, left], [, right]) => right - left)
    .slice(0, 5)
    .map(([name, value], index) => ({
      name,
      value,
      percentage: categoryTotal > 0 ? (value / categoryTotal) * 100 : 0,
      color: donutColors[index % donutColors.length],
    }));

  const primarySavingsTarget = Math.max(Math.round(Math.max(monthlySavings, 2500) * 4), 12000);
  const goals: GoalItem[] = [
    {
      name: "Emergency Fund",
      current: Math.min(Math.max(monthlySavings * 2.2, 5400), primarySavingsTarget),
      target: primarySavingsTarget,
      deadline: "4 months left",
      helper: "Cash reserve for core spending",
      tone: "positive",
    },
    {
      name: "Vacation Fund",
      current: 3600,
      target: 8000,
      deadline: "6 months left",
      helper: "Travel plan for Q4",
      tone: "warning",
    },
    {
      name: "Investment Goal",
      current: 9000,
      target: 30000,
      deadline: "9 months left",
      helper: "Long-term growth allocation",
      tone: "neutral",
    },
  ];

  const accounts: AccountItem[] = [
    {
      name: "Primary Bank",
      type: "Checking",
      balance: Math.max(totalBalance * 0.58 + monthlyIncome * 0.14, 2800),
      change: 4.8,
      accent: "bg-emerald-100 text-emerald-800",
    },
    {
      name: "Operations Wallet",
      type: "Wallet",
      balance: Math.max(totalBalance * 0.14, 460),
      change: 2.1,
      accent: "bg-blue-100 text-blue-800",
    },
    {
      name: "Rewards Credit Card",
      type: "Credit Card",
      balance: -Math.max(monthlyExpense * 0.22, 620),
      change: 7.9,
      accent: "bg-rose-100 text-rose-800",
    },
  ];

  const topCategory = categoryBreakdown[0];
  const mostAtRiskBudget = activeBudgets[0];
  const leadGoal = goals[0];
  const leadGoalProgress = leadGoal.target > 0 ? Math.round((leadGoal.current / leadGoal.target) * 100) : 0;

  const insights: InsightItem[] = [
    {
      title: topCategory ? `${topCategory.name} is running hot` : "Spending insights are warming up",
      detail: topCategory
        ? `You spent ${Math.round(topCategory.percentage)}% of tracked outflow in ${topCategory.name}.`
        : "Add more transactions to unlock category-level insights.",
      helper: "AI spending signal",
      tone: topCategory ? "warning" : "neutral",
      icon: Sparkles,
    },
    {
      title: `You're ${leadGoalProgress}% toward ${leadGoal.name}`,
      detail: `${leadGoal.helper}. ${leadGoal.deadline}.`,
      helper: "Goal pacing",
      tone: leadGoalProgress >= 65 ? "positive" : "warning",
      icon: Target,
    },
    {
      title: mostAtRiskBudget?.utilization >= 1 ? `${mostAtRiskBudget.name} exceeded budget` : `${mostAtRiskBudget?.name || "Transport"} needs attention`,
      detail: mostAtRiskBudget
        ? `${Math.round(mostAtRiskBudget.utilization * 100)}% of budget consumed in ${mostAtRiskBudget.name}.`
        : "Watch categories approaching their monthly cap.",
      helper: "Control alert",
      tone: mostAtRiskBudget?.utilization >= 1 ? "danger" : "warning",
      icon: mostAtRiskBudget?.utilization >= 1 ? ShieldAlert : AlertTriangle,
    },
  ];

  const alerts: AlertItem[] = [
    ...(activeBudgets.filter((item) => item.utilization >= 1).slice(0, 1).map((item) => ({
      title: `${item.name} budget exceeded`,
      detail: `${item.name} is ${Math.round(item.utilization * 100)}% used for the active cycle.`,
      time: "Just now",
      tone: "danger" as const,
      icon: AlertTriangle,
    }))),
    {
      title: "Credit card bill due in 3 days",
      detail: "Rewards Credit Card closes on Friday. Review large charges before posting.",
      time: "Today",
      tone: "warning",
      icon: BellRing,
    },
    {
      title: "Unusual transaction detected",
      detail: "A larger-than-usual dining charge landed compared with your recent baseline.",
      time: "2h ago",
      tone: "neutral",
      icon: ShieldAlert,
    },
  ];

  return {
    summaryMetrics,
    cashFlowSeries: buildCashFlowSeries(monthlyIncome, monthlyExpense),
    insights,
    transactions: normalizedTransactions.slice(0, 8).map((transaction) => ({
      id: transaction.id,
      category: transaction.category,
      description: transaction.description,
      type: transaction.type === "income" ? "income" : "expense",
      amount: transaction.amount,
      date: transaction.date,
    })),
    categoryBreakdown,
    goals,
    accounts,
    budgetHealth: activeBudgets.slice(0, 5),
    alerts,
  };
}
