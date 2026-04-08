export type UserRole = 'USER' | 'ADMIN';

export type OAuthProvider = 'google' | 'apple' | 'facebook';

export type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
  meta?: unknown;
};

export type AuthUser = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  isOAuth: boolean;
  provider: OAuthProvider | null;
  createdAt: string;
};

export type AuthResponseData = AuthUser & {
  user?: AuthUser;
  accessToken: string;
  refreshToken: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name?: string;
  email: string;
  password: string;
};

export type OAuthExchangePayload = {
  provider?: OAuthProvider;
};

export type CurrentUser = {
  id: string;
  name?: string | null;
  email: string;
  role: UserRole;
  isOAuth?: boolean;
  provider?: OAuthProvider | null;
  createdAt: string;
};

export type TransactionType = 'income' | 'expense';

export type Transaction = {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  note: string | null;
  createdAt: string;
  date: string;
  userId: string;
};

export type BudgetSnapshot = {
  budget: number;
  spent: number;
  remaining: number;
  alert?: string;
};

export type DashboardData = {
  income: number;
  expense: number;
  balance: number;
  recentTransactions: Transaction[];
  categoryAnalytics: Record<string, number>;
  budgets?: Record<string, BudgetSnapshot>;
};

export type PaginatedTransactions = {
  data: Transaction[];
  total: number;
  page: number;
  totalPages: number;
};

export type CreateTransactionPayload = {
  amount: number;
  type: TransactionType;
  category: string;
  note?: string;
  createdAt?: string;
  date?: string;
};

export const extractAuthUser = (payload: AuthResponseData): AuthUser => {
  const candidate = payload.user ?? payload;

  return {
    id: candidate.id,
    name: candidate.name ?? null,
    email: candidate.email,
    role: candidate.role,
    isOAuth: candidate.isOAuth ?? false,
    provider: candidate.provider ?? null,
    createdAt: candidate.createdAt,
  };
};
