import prisma from "../../config/db";
import { DashboardData, WeeklyDataPoint, AccountSummary, RecurringExpenseItem, AlertItem, BudgetSummaryItem, DashboardBudgetStatus } from "./dashboard.types";
import { Transaction, Budget } from "@prisma/client";

export const getDashboardDataRepo = async (userId: string, dateRange?: string): Promise<DashboardData> => {
  // Calculate date filter based on dateRange
  const now = new Date();
  let startDate = new Date();
  
  switch (dateRange) {
    case 'thisMonth':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'lastMonth':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      break;
    case 'last3Months':
      startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      break;
    case 'ytd':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  // Fetch all transactions for the user
  const transactions: Transaction[] = await prisma.transaction.findMany({
    where: { 
      userId,
      createdAt: { gte: startDate }
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate income, expense, and category analytics
  let income = 0;
  let expense = 0;
  const categoryMap: Record<string, number> = {};

  transactions.forEach((t) => {
    if (t.type === "income") {
      income += Number(t.amount);
    } else {
      expense += Number(t.amount);
    }

    categoryMap[t.category] = (categoryMap[t.category] || 0) + Number(t.amount);
  });

  const balance = income - expense;

  // Calculate net worth (assets - liabilities)
  // For simplicity, using balance as net worth; in production you'd query assets/liabilities tables
  const netWorth = balance;
  const assets = income > 0 ? income : 0;
  const liabilities = expense > 0 ? expense : 0;
  const trend = income > 0 ? ((income - expense) / income) * 100 : 0;

  // Calculate savings rate
  const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;

  // Generate weekly data
  const weeklyData: WeeklyDataPoint[] = generateWeeklyData(transactions);

  // Generate accounts from transaction totals (in production, you'd have Account model)
  const accounts: AccountSummary[] = [
    { id: '1', name: 'Savings', balance: income, type: 'bank' },
    { id: '2', name: 'Checking', balance: balance, type: 'bank' }
  ];

  // Empty recurring expenses (would come from RecurringTransaction model)
  const recurringExpenses: RecurringExpenseItem[] = [];

  // Generate alerts based on data
  const alerts: AlertItem[] = generateAlerts(income, expense, savingsRate);

  // Fetch budgets
  const budgets: Budget[] = await prisma.budget.findMany({
    where: { userId }
  });
  
  const budgetSummaryRecord: Record<string, DashboardBudgetStatus> = {};
  budgets.forEach(b => {
    budgetSummaryRecord[b.category] = {
      budget: Number(b.amount),
      spent: 0,
      remaining: Number(b.amount)
    };
  });

  const budgetSummary: BudgetSummaryItem[] = Object.entries(budgetSummaryRecord).map(([category, status]) => ({
    category,
    budget: status.budget,
    actual: status.spent,
    difference: status.remaining,
    status: status.spent > status.budget ? 'over' : 'under'
  }));

  return {
    income,
    expense,
    balance,
    netWorth,
    assets,
    liabilities,
    trend,
    recentTransactions: transactions.slice(0, 5),
    categoryAnalytics: categoryMap,
    budgets: budgetSummaryRecord,
    savingsRate,
    weeklyData,
    accounts,
    recurringExpenses,
    alerts,
    budgetSummary
  };
};

// Helper functions
function generateWeeklyData(transactions: Transaction[]): WeeklyDataPoint[] {
  const weeks: Record<string, { income: number; expense: number }> = {};
  
  transactions.forEach(t => {
    const weekStart = getWeekStart(new Date(t.createdAt));
    const weekKey = weekStart.toISOString();
    
    if (!weeks[weekKey]) {
      weeks[weekKey] = { income: 0, expense: 0 };
    }
    
    if (t.type === 'income') {
      weeks[weekKey].income += Number(t.amount);
    } else {
      weeks[weekKey].expense += Number(t.amount);
    }
  });

  return Object.entries(weeks)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .slice(-8)
    .map(([week, data]) => ({
      week: new Date(week).toLocaleDateString('en-US', { month: 'short' }),
      income: data.income,
      expense: data.expense
    }));
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

function generateAlerts(income: number, expense: number, savingsRate: number): AlertItem[] {
  const alerts: AlertItem[] = [];
  
  if (expense > income) {
    alerts.push({
      id: '1',
      message: 'You have spent more than you earned this month',
      type: 'error',
      createdAt: new Date().toISOString()
    });
  }
  
  if (savingsRate < 10) {
    alerts.push({
      id: '2', 
      message: 'Your savings rate is below 10%. Consider reducing expenses.',
      type: 'warning',
      createdAt: new Date().toISOString()
    });
  }
  
  return alerts;
}
