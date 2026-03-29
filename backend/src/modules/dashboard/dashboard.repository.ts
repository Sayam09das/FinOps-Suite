import prisma from "../../config/db";
import { DashboardData } from "./dashboard.types";
import { Transaction } from "@prisma/client";

export const getDashboardDataRepo = async (userId: string): Promise<DashboardData> => {
  const transactions: Transaction[] = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  let income = 0;
  let expense = 0;
  const categoryMap: Record<string, number> = {};

  transactions.forEach((t) => {
    if (t.type === "income") {
      income += t.amount;
    } else {
      expense += t.amount;
    }

    categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
  });

  return {
    income,
    expense,
    balance: income - expense,
    recentTransactions: transactions.slice(0, 5),
    categoryAnalytics: categoryMap,
  };
};
