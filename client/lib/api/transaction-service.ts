import { apiClient } from './client';
import { apiEndpoints } from './endpoints';
import type {
  CreateTransactionPayload,
  PaginatedTransactions,
  Transaction,
  UpdateTransactionPayload,
} from './types';

export const transactionService = {
  list: () => apiClient.get<PaginatedTransactions>(apiEndpoints.transactions.list),

  create: (payload: CreateTransactionPayload) =>
    apiClient.post<Transaction>(apiEndpoints.transactions.root, payload),

  update: (id: string, payload: UpdateTransactionPayload) =>
    apiClient.put<Transaction>(apiEndpoints.transactions.byId(id), payload),

  remove: (id: string) =>
    apiClient.delete<null>(apiEndpoints.transactions.byId(id)),
};
