import { apiRequest } from './client';
import type {
  CreateTransactionPayload,
  PaginatedTransactions,
  Transaction,
} from './types';

export const transactionService = {
  list: (token: string) =>
    apiRequest<PaginatedTransactions>('/api/transactions?limit=8', {
      token,
      method: 'GET',
    }),

  create: (token: string, payload: CreateTransactionPayload) =>
    apiRequest<Transaction>('/api/transactions', {
      token,
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
