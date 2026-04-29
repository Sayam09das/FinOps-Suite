import prisma from "../../config/db";

export const getDashboardData = async (userId: string) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

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

    if (!categoryMap[t.category]) {
      categoryMap[t.category] = 0;
    }
    categoryMap[t.category] += amount;
  });

  const currentMonth = new Date().toISOString().slice(0, 7);

  const budgets = await prisma.budget.findMany({
    where: { userId, month: currentMonth },
  });

  const budgetMap: Record<string, { budget: number; spent: number; remaining: number; alert?: string }> = {};

  budgets.forEach((b) => {
    budgetMap[b.category] = {
      budget: b.amount,
      spent: 0,
      remaining: b.amount,
    };
  });

  transactions.forEach((t) => {
    if (t.type.toLowerCase() !== "expense") return;
    if (!budgetMap[t.category]) return;

    budgetMap[t.category].spent += Number(t.amount) || 0;
    budgetMap[t.category].remaining =
      budgetMap[t.category].budget - budgetMap[t.category].spent;

    if (budgetMap[t.category].spent > budgetMap[t.category].budget) {
      budgetMap[t.category].alert = "Budget exceeded 🚨";
    }
  });

  return {
    income,
    expense,
    balance: income - expense,
    recentTransactions: transactions.slice(0, 5),
    categoryAnalytics: categoryMap,
    budgets: budgetMap,
  };
};
