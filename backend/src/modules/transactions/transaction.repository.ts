import prisma from '../../config/db';
import type { CreateTransactionInput, Transaction } from './transaction.types';

export const createTransaction = async (data: CreateTransactionInput, userId: string): Promise<any> => {
  const timestamp = data.createdAt ?? data.date;
  const createData: any = {
    amount: data.amount,
    type: data.type,
    category: data.category,
    note: data.note,
    date: timestamp ? new Date(timestamp) : undefined,
    createdAt: timestamp ? new Date(timestamp) : undefined,
    userId,
  };

  // Omit undefined fields for Prisma compatibility.
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
    orderBy: { createdAt: 'desc' },
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
