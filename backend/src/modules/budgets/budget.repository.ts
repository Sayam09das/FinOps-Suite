import prisma from '../../config/db';
import { Budget, BudgetStatus } from './budget.types';
import type { Transaction } from '../transactions/transaction.types'; // Assume exists

export const createBudget = async (data: any, userId: string): Promise<Budget> => {
  return prisma.budget.create({
    data: {
      ...data,
      userId,
    },
  });
};

export const getBudgetsByUser = async (userId: string): Promise<Budget[]> => {
  return prisma.budget.findMany({
    where: { userId },
  });
};

export const getBudgetsByUserAndMonth = async (userId: string, month: string): Promise<Budget[]> => {
  return prisma.budget.findMany({
    where: { 
      userId, 
      month 
    },
  });
};

export const getTransactionsByUserAndMonth = async (userId: string, month: string): Promise<Transaction[]> => {
  return prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: new Date(`${month}-01`),
        lte: new Date(`${month}-31`),
      },
    },
  });
};

