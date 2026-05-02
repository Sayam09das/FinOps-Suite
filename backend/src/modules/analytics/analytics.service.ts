import prisma from "../../config/db";
import redis, { ensureRedisConnection } from "../../infrastructure/cache/redis";
import type { AnalyticsData } from "./analytics.types";

export const getAnalyticsData = async (userId: string): Promise<AnalyticsData> => {
  const cacheKey = `analytics:${userId}`;

  // 🔥 1. Check cache first (5 min TTL for analytics)
  try {
    if (await ensureRedisConnection()) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log("⚡ Analytics from Redis");
        return JSON.parse(cached);
      }
    }
  } catch {
    // Skip cache when Redis is unavailable.
  }

  console.log("📊 Computing analytics from DB");

  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentYear = new Date().getFullYear();

  // 1. Current month overview
  const monthTransactions = await prisma.transaction.findMany({
    where: { userId, date: { gte: new Date(`${currentMonth}-01`) } },
  });

  let income = 0, expense = 0;
  const categorySpend: Record<string, number> = {};

  monthTransactions.forEach((t) => {
    if (t.type === "income") income += t.amount;
    else {
      expense += t.amount;
      categorySpend[t.category] = (categorySpend[t.category] || 0) + t.amount;
    }
  });

  const totalExpense = Object.values(categorySpend).reduce((sum, v) => sum + (v as number), 0);
  const categories = Object.entries(categorySpend).reduce((acc, [cat, spent]) => {
    acc[cat] = { spent: spent as number, percentage: totalExpense ? (spent as number) / totalExpense * 100 : 0 };
    return acc;
  }, {} as any);

  // 2. 6-month trends
  const trends: any[] = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = date.toISOString().slice(0, 7);
    const startDate = new Date(`${monthKey}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    const monthTx = await prisma.transaction.findMany({
      where: { userId, date: { gte: startDate, lt: endDate } },
    });
    let mIncome = 0, mExpense = 0;
    monthTx.forEach((t) => {
      if (t.type === "income") mIncome += t.amount;
      else mExpense += t.amount;
    });
    trends.push({ month: monthKey, income: mIncome, expense: mExpense, balance: mIncome - mExpense });
  }

  // 3. Budget compliance (current month)
  const budgets = await prisma.budget.findMany({ where: { userId, month: currentMonth } });
  const compliance: any[] = [];
  for (const b of budgets) {
    const spent = categorySpend[b.category] || 0;
    const pct = b.amount ? (spent / b.amount) * 100 : 0;
    let status: 'OK' | 'WARNING' | 'EXCEEDED' = 'OK';
    if (pct > 100) status = 'EXCEEDED';
    else if (pct > 80) status = 'WARNING';
    compliance.push({ category: b.category, budgeted: b.amount, spent, compliance: Math.round(pct * 10) / 10, status });
  }

  // 4. Simple forecast (avg last 3 months expense, assume income stable)
  const avgExpense = trends.slice(0, 3).reduce((sum, t) => sum + t.expense, 0) / 3;
  const avgIncome = trends.slice(0, 3).reduce((sum, t) => sum + t.income, 0) / 3;
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const trend = avgIncome > avgExpense * 1.1 ? 'UP' : avgIncome < avgExpense * 0.9 ? 'DOWN' : 'STABLE';

  const result: AnalyticsData = {
    overview: { period: currentMonth, income, expense, balance: income - expense, categories },
    trends,
    budgetCompliance: compliance,
    forecast: {
      nextMonthIncome: avgIncome,
      nextMonthExpense: avgExpense,
      projectedBalance: avgIncome - avgExpense,
      trend,
    },
    topCategories: Object.entries(categorySpend)
      .sort(([,a]: any, [,b]: any) => b - a)
      .slice(0, 5)
      .map(([cat]) => cat),
  };

  // 🔥 Cache for 5 min
  try {
    if (await ensureRedisConnection()) {
      await redis.set(cacheKey, JSON.stringify(result), "EX", 300);
    }
  } catch {
    // Skip cache writes when Redis is unavailable.
  }

  return result;
};
