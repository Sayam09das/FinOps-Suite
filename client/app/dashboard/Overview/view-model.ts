import {
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  Landmark,
  PiggyBank,
  ShieldAlert,
  Sparkles,
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

const emptyCashFlowSeries = (): Record<ChartRange, CashFlowPoint[]> => ({
  Weekly: [],
  Monthly: [],
  Yearly: [],
});

const addTransactionToPoint = (point: CashFlowPoint, transaction: Transaction) => {
  const amount = Number(transaction.amount) || 0;

  if (transaction.type === "income") {
    point.income += amount;
  } else {
    point.expense += amount;
  }

  point.cashFlow = point.income - point.expense;
};

const buildCashFlowSeries = (transactions: Transaction[]): Record<ChartRange, CashFlowPoint[]> => {
  if (transactions.length === 0) return emptyCashFlowSeries();

  const now = new Date();
  const weekStart = new Date(now);
  const mondayOffset = (weekStart.getDay() + 6) % 7;
  weekStart.setDate(weekStart.getDate() - mondayOffset);
  weekStart.setHours(0, 0, 0, 0);

  const weekly = weekdayLabels.map((label) => ({ label, income: 0, expense: 0, cashFlow: 0 }));

  const monthKeys = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      point: {
        label: getMonthName(date.getMonth(), "short"),
        income: 0,
        expense: 0,
        cashFlow: 0,
      },
    };
  });

  const yearKeys = Array.from({ length: 5 }, (_, index) => {
    const year = now.getFullYear() - (4 - index);
    return {
      key: `${year}`,
      point: {
        label: `${year}`,
        income: 0,
        expense: 0,
        cashFlow: 0,
      },
    };
  });

  const monthlyMap = new Map(monthKeys.map(({ key, point }) => [key, point]));
  const yearlyMap = new Map(yearKeys.map(({ key, point }) => [key, point]));

  transactions.forEach((transaction) => {
    const date = toDate(transaction.date || transaction.createdAt);

    if (date >= weekStart) {
      const dayIndex = (date.getDay() + 6) % 7;
      addTransactionToPoint(weekly[dayIndex], transaction);
    }

    addTransactionToPoint(
      monthlyMap.get(`${date.getFullYear()}-${date.getMonth()}`) || { label: "", income: 0, expense: 0, cashFlow: 0 },
      transaction,
    );

    addTransactionToPoint(
      yearlyMap.get(`${date.getFullYear()}`) || { label: "", income: 0, expense: 0, cashFlow: 0 },
      transaction,
    );
  });

  return {
    Weekly: weekly,
    Monthly: monthKeys.map(({ point }) => point),
    Yearly: yearKeys.map(({ point }) => point),
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

  const previousMonthTransactions = normalizedTransactions.filter((transaction) => {
    const date = toDate(transaction.date);
    const previousMonth = new Date();
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    return date.getMonth() === previousMonth.getMonth() && date.getFullYear() === previousMonth.getFullYear();
  });
  const previousMonthIncome = sum(previousMonthTransactions.filter((transaction) => transaction.type === "income").map((transaction) => transaction.amount));
  const previousMonthExpense = sum(previousMonthTransactions.filter((transaction) => transaction.type === "expense").map((transaction) => transaction.amount));

  const monthlyIncome = sum(incomeTransactions.map((transaction) => transaction.amount));
  const monthlyExpense = sum(expenseTransactions.map((transaction) => transaction.amount));
  const totalBalance = overview?.balance ?? monthlyIncome - monthlyExpense;
  const monthlySavings = monthlyIncome - monthlyExpense;
  const previousSavings = previousMonthIncome - previousMonthExpense;

  const budgetEntries = Object.entries(budgetStatus).map(([name, entry]) => ({
    name,
    ...entry,
  }));

  const activeBudgets = budgetEntries
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
      delta: 0,
      tone: totalBalance >= 0 ? "positive" : "danger",
      format: "currency",
      icon: Landmark,
    },
    {
      title: "Income",
      value: monthlyIncome,
      helper: "This month",
      delta: calculateDelta(monthlyIncome, previousMonthIncome),
      tone: "positive",
      format: "currency",
      icon: ArrowUpCircle,
    },
    {
      title: "Expenses",
      value: monthlyExpense,
      helper: "This month",
      delta: calculateDelta(monthlyExpense, previousMonthExpense),
      tone: "warning",
      format: "currency",
      icon: ArrowDownCircle,
    },
    {
      title: "Savings",
      value: monthlySavings,
      helper: "Available this month",
      delta: calculateDelta(monthlySavings, previousSavings),
      tone: monthlySavings >= 0 ? "positive" : "danger",
      format: "currency",
      icon: PiggyBank,
    },
    {
      title: "Budget Left",
      value: totalBudgetLeft,
      helper: "Remaining spending room",
      delta: 0,
      tone: totalBudgetLeft >= 0 ? "positive" : "danger",
      format: "currency",
      icon: Wallet,
    },
    {
      title: "Cash Flow",
      value: cashFlow,
      helper: "Income minus expense",
      delta: calculateDelta(cashFlow, previousSavings),
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
      : {};

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

  const goals: GoalItem[] = [];
  const accounts: AccountItem[] = [];

  const topCategory = categoryBreakdown[0];
  const mostAtRiskBudget = activeBudgets[0];

  const insights: InsightItem[] = [
    ...(topCategory ? [{
      title: topCategory ? `${topCategory.name} is running hot` : "Spending insights are warming up",
      detail: `You spent ${Math.round(topCategory.percentage)}% of tracked outflow in ${topCategory.name}.`,
      helper: "Spending signal",
      tone: "warning" as const,
      icon: Sparkles,
    }] : []),
    ...(monthlySavings !== 0 || monthlyIncome !== 0 || monthlyExpense !== 0 ? [{
      title: monthlySavings >= 0 ? "Positive cash flow this month" : "Expenses are above income",
      detail: `Income is ${monthlyIncome.toLocaleString()} and expenses are ${monthlyExpense.toLocaleString()} for the current month.`,
      helper: "Cash flow",
      tone: monthlySavings >= 0 ? "positive" as const : "danger" as const,
      icon: monthlySavings >= 0 ? Sparkles : ShieldAlert,
    }] : []),
    ...(mostAtRiskBudget ? [{
      title: mostAtRiskBudget.utilization >= 1 ? `${mostAtRiskBudget.name} exceeded budget` : `${mostAtRiskBudget.name} needs attention`,
      detail: `${Math.round(mostAtRiskBudget.utilization * 100)}% of budget consumed in ${mostAtRiskBudget.name}.`,
      helper: "Control alert",
      tone: mostAtRiskBudget.utilization >= 1 ? "danger" as const : "warning" as const,
      icon: mostAtRiskBudget.utilization >= 1 ? ShieldAlert : AlertTriangle,
    }] : []),
  ];

  const alerts: AlertItem[] = [
    ...(activeBudgets.filter((item) => item.utilization >= 1).slice(0, 1).map((item) => ({
      title: `${item.name} budget exceeded`,
      detail: `${item.name} is ${Math.round(item.utilization * 100)}% used for the active cycle.`,
      time: "Just now",
      tone: "danger" as const,
      icon: AlertTriangle,
    }))),
  ];

  return {
    summaryMetrics,
    cashFlowSeries: buildCashFlowSeries(normalizedTransactions),
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
