import {
  createTransaction as createRepo,
  getTransactions as getRepo,
  deleteTransaction as deleteRepo,
} from './transaction.repository';
import type { CreateTransactionInput } from './transaction.types';
import type { Transaction } from './transaction.types';
import prisma from "../../config/db";
import { io } from "../../app/server";

// Basic CRUD (repo-backed)
export const createTransaction = async (data: CreateTransactionInput, userId: string): Promise<any> => {
  const transaction = await createRepo(data, userId);

  // 🔥 Budget check
  const currentMonth = new Date().toISOString().slice(0, 7);

  const budget = await prisma.budget.findFirst({
    where: {
      userId,
      category: data.category,
      month: currentMonth,
    },
  });

  if (budget) {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        category: data.category,
      },
    });

    const totalSpent = transactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    // ⚠️ Near limit
    if (totalSpent >= budget.amount * 0.8) {
      io.emit("alert", {
        type: "warning",
        message: `⚠️ Near budget limit for ${data.category}`,
      });
    }

    // 🚨 Exceeded
    if (totalSpent > budget.amount) {
      io.emit("alert", {
        type: "danger",
        message: `🚨 Budget exceeded for ${data.category}`,
      });
    }
  }

  return transaction;
};

export const getTransactionsBasic = async (userId: string): Promise<any[]> => {
  return getRepo(userId);
};

export const deleteTransaction = async (id: string, userId: string): Promise<any> => {
  return deleteRepo(id, userId);
};

// 🔍 Get with filters + pagination
export const getTransactions = async (userId: string, query: any) => {
  const { type, category, startDate, endDate, page = 1, limit = 10 } = query;

  const filters: any = { userId };

  if (type) filters.type = type;
  if (category) filters.category = category;

  if (startDate && endDate) {
    filters.date = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.transaction.findMany({
      where: filters,
      orderBy: { date: "desc" },
      skip: Number(skip),
      take: Number(limit),
    }),
    prisma.transaction.count({ where: filters }),
  ]);

  return {
    data,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  };
};

// ✏️ Update
export const updateTransaction = async (
  id: string,
  userId: string,
  data: any
) => {
  // Security: check ownership
  const tx = await prisma.transaction.findFirst({ where: { id, userId } });
  if (!tx) throw new Error('Not found');
  return prisma.transaction.update({
    where: { id },
    data,
  });
};

// 📊 Monthly summary
export const getMonthlySummary = async (userId: string) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
  });

  let income = 0;
  let expense = 0;

  transactions.forEach((t: any) => {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  return {
    income,
    expense,
    balance: income - expense,
  };
};

// 📊 Category analytics
export const getCategoryAnalytics = async (userId: string) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
  });

  const categoryMap: any = {};

  transactions.forEach((t: any) => {
    if (!categoryMap[t.category]) {
      categoryMap[t.category] = 0;
    }
    categoryMap[t.category] += t.amount;
  });

  return categoryMap;
};
