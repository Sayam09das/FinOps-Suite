import prisma from "../../config/db";
import redis from "../../infrastructure/cache/redis";

export const getDashboardData = async (userId: string) => {
  const cacheKey = `dashboard:${userId}`;

  // 🔥 1. Check cache
  let cached;
  try {
    cached = await redis.get(cacheKey);
    if (cached) {
      console.log("⚡ Serving from Redis");
      return JSON.parse(cached);
    }
  } catch (cacheError) {
    console.log("Redis unavailable, skipping cache");
  }

  console.log("🐢 Fetching from DB");

  // 🔹 DB logic
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

  const currentMonth = new Date().toISOString().slice(0, 7);

  const budgets = await prisma.budget.findMany({
    where: { userId, month: currentMonth },
  });

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

    if (budgetMap[t.category].spent > budgetMap[t.category].budget) {
      budgetMap[t.category].alert = "Budget exceeded 🚨";
    }
  });

  const result = {
    income,
    expense,
    balance: income - expense,
    recentTransactions: transactions.slice(0, 5),
    categoryAnalytics: categoryMap,
    budgets: budgetMap,
  };

  // 🔥 2. Store in cache (TTL = 60 sec)
  try {
    await redis.set(cacheKey, JSON.stringify(result), "EX", 60);
  } catch (cacheError) {
    console.log("Redis unavailable, skipping cache set");
  }

  return result;
};

