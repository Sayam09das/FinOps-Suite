import prisma from "../../config/db";
import { Transaction, Budget } from "@prisma/client";
import { DashboardData, WeeklyDataPoint, AlertItem, BudgetSummaryItem, DashboardBudgetStatus } from "./dashboard.types";

export const getDashboardData = async (userId: string): Promise<DashboardData> => {
  // Get all transactions for the user
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  // Calculate income and expense from transactions
  let income = 0;
  let expense = 0;
  const categoryMap: Record<string, number> = {};

  transactions.forEach((t) => {
    const amount = Number(t.amount) || 0;
    const type = t.type.toLowerCase();

    if (type === "income") {
      income += amount;
    } else {
      expense += amount;
    }

    // Count expenses by category for expense breakdown
    if (type === "expense") {
      if (!categoryMap[t.category]) {
        categoryMap[t.category] = 0;
      }
      categoryMap[t.category] += amount;
    }
  });

  // Get current month's budgets
  const currentMonth = new Date().toISOString().slice(0, 7);

  const budgets = await prisma.budget.findMany({
    where: { userId, month: currentMonth },
  });

  const budgetMap: Record<string, DashboardBudgetStatus> = {};

  // Initialize budget map with budget amounts
  budgets.forEach((b) => {
    budgetMap[b.category] = {
      budget: Number(b.amount),
      spent: 0,
      remaining: Number(b.amount),
    };
  });

  // Calculate spent amounts from transactions
  transactions.forEach((t) => {
    if (t.type.toLowerCase() !== "expense") return;
    if (!budgetMap[t.category]) return;

    budgetMap[t.category].spent += Number(t.amount) || 0;
    budgetMap[t.category].remaining =
      budgetMap[t.category].budget - budgetMap[t.category].spent;

    if (budgetMap[t.category].spent > budgetMap[t.category].budget) {
      budgetMap[t.category].alert = "Budget exceeded";
    }
  });

  // Generate alerts based on budget status
  const alerts: AlertItem[] = [];
  
  Object.entries(budgetMap).forEach(([category, status]) => {
    if (status.alert) {
      alerts.push({
        id: `budget-${category}`,
        message: `Overspending on ${category} (${Math.round((status.spent / status.budget) * 100)}% budget)`,
        type: "warning",
        createdAt: new Date().toISOString(),
      });
    }
  });

  // Generate budget summary for SummaryTable
  const budgetSummary: BudgetSummaryItem[] = Object.entries(budgetMap).map(([category, status]) => ({
    category,
    budget: status.budget,
    actual: status.spent,
    difference: status.budget - status.spent,
    status: status.spent > status.budget ? "over" : status.spent < status.budget ? "under" : "ontrack",
  }));

  const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;

  // Calculate weekly data for the chart (last 4 weeks)
  const weeklyData = calculateWeeklyData(transactions);

  // Calculate trend (comparing to previous month)
  const previousMonthTransactions = transactions.filter((t) => {
    const txDate = new Date(t.createdAt);
    const prevMonth = new Date();
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    return txDate.getMonth() === prevMonth.getMonth();
  });

  let previousIncome = 0;
  previousMonthTransactions.forEach((t) => {
    if (t.type.toLowerCase() === "income") {
      previousIncome += Number(t.amount) || 0;
    }
  });

  const trend = previousIncome > 0 
    ? ((income - previousIncome) / previousIncome) * 100 
    : income > 0 ? 100 : 0;

// Use calculated totals from actual transactions
  const assets = income;
  const liabilities = expense;
  const netWorth = income - expense;

  // Account model not available in schema yet - derive accounts from transaction totals
  // Placeholder: empty array if no transactions, otherwise show derived data from transactions
  // TODO: Add Account model to schema and query actual accounts
  const accountSummaries = income > 0 || expense > 0 
    ? [{ id: "derived", name: "Total Assets", balance: income, type: "bank" }]
    : [];

  // RecurringTransaction model not available in schema yet
  // Placeholder: empty array since model doesn't exist
  // TODO: Add RecurringTransaction model to schema and query actual recurring expenses
  const recurringExpenseItems: { id: string; name: string; amount: number; dueDate: string; category: string }[] = [];

  return {
    income,
    expense,
    balance: income - expense,
    netWorth,
    assets,
    liabilities,
    trend,
    recentTransactions: transactions.slice(0, 5),
    categoryAnalytics: categoryMap,
    budgets: budgetMap,
    savingsRate,
    weeklyData,
    accounts: accountSummaries,
    recurringExpenses: recurringExpenseItems,
    alerts,
    budgetSummary,
  };
};

// Calculate weekly data points for the chart
function calculateWeeklyData(transactions: Transaction[]): WeeklyDataPoint[] {
  const weeks: WeeklyDataPoint[] = [];
  const now = new Date();

  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - (i * 7));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const weekTransactions = transactions.filter((t) => {
      const txDate = new Date(t.createdAt);
      return txDate >= weekStart && txDate < weekEnd;
    });

    const weekIncome = weekTransactions
      .filter((t) => t.type.toLowerCase() === "income")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const weekExpense = weekTransactions
      .filter((t) => t.type.toLowerCase() === "expense")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    weeks.push({
      week: `W${4 - i}`,
      income: weekIncome,
      expense: weekExpense,
    });
  }

  return weeks;
}
