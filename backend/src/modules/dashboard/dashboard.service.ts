import prisma from "../../config/db";
import { Transaction, Budget } from "@prisma/client";
import { DashboardData, WeeklyDataPoint, AlertItem, BudgetSummaryItem, DashboardBudgetStatus, NetWorthData } from "./dashboard.types";

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

// Net Worth data calculation
export const getNetWorthData = async (userId: string): Promise<NetWorthData> => {
  // Get all transactions for the user
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  // Calculate total assets (income) and liabilities (expenses)
  let totalAssets = 0;
  let totalLiabilities = 0;
  const categoryIncome: Record<string, number> = {};
  const categoryExpense: Record<string, number> = {};

  transactions.forEach((t) => {
    const amount = Number(t.amount) || 0;
    const type = t.type.toLowerCase();

    if (type === "income") {
      totalAssets += amount;
      if (!categoryIncome[t.category]) {
        categoryIncome[t.category] = 0;
      }
      categoryIncome[t.category] += amount;
    } else if (type === "expense") {
      totalLiabilities += amount;
      if (!categoryExpense[t.category]) {
        categoryExpense[t.category] = 0;
      }
      categoryExpense[t.category] += amount;
    }
  });

  const totalNetWorth = totalAssets - totalLiabilities;

  // Calculate change from previous month
  const now = new Date();
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  let previousAssets = 0;
  let previousLiabilities = 0;
  
  transactions.forEach((t) => {
    const txDate = new Date(t.createdAt);
    if (txDate < oneMonthAgo) {
      const amount = Number(t.amount) || 0;
      if (t.type.toLowerCase() === "income") {
        previousAssets += amount;
      } else {
        previousLiabilities += amount;
      }
    }
  });

  const previousNetWorth = previousAssets - previousLiabilities;
  const changeAmount = totalNetWorth - previousNetWorth;
  const changePercent = previousNetWorth !== 0 
    ? ((totalNetWorth - previousNetWorth) / Math.abs(previousNetWorth)) * 100 
    : totalNetWorth > 0 ? 100 : 0;

  // Generate assets list grouped by category
  const assetsList = Object.entries(categoryIncome).map(([category, amount], index) => {
    const colors = ["#2f7d67", "#5687cc", "#d0a24d", "#8d6ad8", "#4f9e96"];
    return {
      id: `asset-${index}`,
      name: category.charAt(0).toUpperCase() + category.slice(1),
      category,
      amount,
      percentage: totalAssets > 0 ? (amount / totalAssets) * 100 : 0,
      color: colors[index % colors.length],
      change: Math.random() * 10 - 2, // Simulated change for demo
    };
  });

  // Generate liabilities list grouped by category
  const liabilitiesList = Object.entries(categoryExpense).map(([category, amount], index) => {
    const colors = ["#d27768", "#8d6ad8", "#d0a24d"];
    return {
      id: `liability-${index}`,
      name: category.charAt(0).toUpperCase() + category.slice(1),
      category,
      amount,
      percentage: totalLiabilities > 0 ? (amount / totalLiabilities) * 100 : 0,
      color: colors[index % colors.length],
      interestRate: 12.5 + Math.random() * 10,
      dueInDays: Math.floor(Math.random() * 30),
      change: -(Math.random() * 5),
    };
  });

  // Generate asset distribution
  const assetDistribution = assetsList.map((asset, index) => {
    const colors = ["#2f7d67", "#5687cc", "#d0a24d", "#8d6ad8", "#4f9e96"];
    return {
      name: asset.name,
      value: asset.amount,
      percentage: asset.percentage,
      color: colors[index % colors.length],
    };
  });

  // Generate trend series (last 6 months)
  const trendSeries: { label: string; value: number; assets: number; liabilities: number }[] = [];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  
  for (let i = 0; i < 6; i++) {
    const progress = i / 5;
    const assets = totalAssets * progress + totalAssets * 0.2;
    const liabilities = totalLiabilities * progress + totalLiabilities * 0.1;
    trendSeries.push({
      label: months[i],
      value: Math.round(assets - liabilities),
      assets: Math.round(assets),
      liabilities: Math.round(liabilities),
    });
  }

  // Generate insights
  const insights = [
    {
      id: "insight-1",
      title: changeAmount >= 0 ? "Income exceeds expenses" : "Expenses exceed income",
      detail: changeAmount >= 0 
        ? "Your income is greater than expenses this month. Great job!" 
        : "Consider reducing expenses to improve your net worth.",
      tone: changeAmount >= 0 ? "positive" as const : "warning" as const,
      metric: `${Math.abs(changePercent).toFixed(1)}%`,
    },
    {
      id: "insight-2",
      title: "Net worth " + (changeAmount >= 0 ? "increased" : "decreased"),
      detail: `Your net worth ${changeAmount >= 0 ? "grew" : "declined"} by ₹${Math.abs(changeAmount).toLocaleString()} this month.`,
      tone: "neutral" as const,
      metric: `₹${Math.abs(changeAmount).toLocaleString()}`,
    },
  ];

  // Calculate health score (0-100)
  const assetLiabilityRatio = totalLiabilities > 0 ? totalAssets / totalLiabilities : 10;
  const healthScore = Math.min(
    50 + Math.min(assetLiabilityRatio * 10, 30) + (changeAmount >= 0 ? 20 : 0),
    98
  );

  // Future projection (6 months)
  const monthlyGrowth = changeAmount;
  const futureValue = totalNetWorth + monthlyGrowth * 6;

  return {
    totalNetWorth,
    totalAssets,
    totalLiabilities,
    changeAmount: Math.round(changeAmount),
    changePercent: Math.round(changePercent * 10) / 10,
    changeDirection: changeAmount >= 0 ? "up" as const : "down" as const,
    currency: "INR",
    assets: assetsList,
    liabilities: liabilitiesList,
    assetDistribution,
    trendSeries,
    insights,
    healthScore: Math.round(healthScore),
    projection: {
      futureValue: Math.round(futureValue),
      months: 6,
      confidence: 75,
    },
  };
};
