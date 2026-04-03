export type AppUserRole = 'USER' | 'ADMIN';
export type TransactionType = 'income' | 'expense';

export interface CurrentUser {
  id: string;
  clerkId: string;
  email: string;
  role: AppUserRole;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  category: string;
  note: string | null;
  date: string;
  createdAt: string;
}

export interface DashboardData {
  income: number;
  expense: number;
  balance: number;
  recentTransactions: Transaction[];
  categoryAnalytics: Record<string, number>;
  budgets?: Record<
    string,
    {
      budget: number;
      spent: number;
      remaining: number;
      alert?: string;
    }
  >;
}

export interface PaginatedTransactions {
  data: Transaction[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateTransactionPayload {
  amount: number;
  type: TransactionType;
  category: string;
  note?: string;
  createdAt?: string;
}
