import prisma from "../../config/db";

export const getDashboardData = async (userId: string) => {
  // 🔹 Get all transactions
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  let income = 0;
  let expense = 0;
  const categoryMap: any = {};

  transactions.forEach((t) => {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;

    if (!categoryMap[t.category]) {
      categoryMap[t.category] = 0;
    }
    categoryMap[t.category] += t.amount;
  });

  // 🔹 Get budgets (current month)
  const currentMonth = new Date().toISOString().slice(0, 7);

  const budgets = await prisma.budget.findMany({
    where: { userId, month: currentMonth },
  });

  // 🔹 Budget calculation
  const budgetMap: any = {};

  budgets.forEach((b) => {
    budgetMap[b.category] = {
      budget: b.amount,
      spent: 0,
      remaining: b.amount,
    };
  });

  transactions.forEach((t) => {
    if (!budgetMap[t.category]) return;

    budgetMap[t.category].spent += t.amount;
    budgetMap[t.category].remaining =
      budgetMap[t.category].budget - budgetMap[t.category].spent;

    // 🚨 Alert
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

