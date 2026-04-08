import { apiRequest } from './client';
import type {
  CreateTransactionPayload,
  PaginatedTransactions,
  Transaction,
} from './types';

export const transactionService = {
  list: () =>
    apiRequest<PaginatedTransactions>('/api/transactions?limit=8', {
      method: 'GET',
    }),

  create: (payload: CreateTransactionPayload) =>
    apiRequest<Transaction>('/api/transactions', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
