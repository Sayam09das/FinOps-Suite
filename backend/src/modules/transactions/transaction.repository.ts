import prisma from '../../config/db';
import type { CreateTransactionInput, Transaction } from './transaction.types';

export const createTransaction = async (data: CreateTransactionInput, userId: string): Promise<any> => {
  const createData: any = {
    ...data,
    userId,
  };

  // Omit undefined fields for Prisma compatibility (e.g., date/note optional)
  Object.keys(createData).forEach(key => {
    if (createData[key] === undefined || createData[key] === null) {
      delete createData[key];
    }
  });

  return prisma.transaction.create({
    data: createData,
  });
};

export const getTransactions = async (userId: string): Promise<any[]> => {
  return prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
  });
};

export const deleteTransaction = async (id: string, userId: string): Promise<any> => {
  const transaction = await prisma.transaction.findFirst({
    where: { 
      id,
      userId 
    }
  });
  if (!transaction) {
    throw new Error('Transaction not found or access denied');
  }
  return prisma.transaction.delete({
    where: { id }
  });
};
