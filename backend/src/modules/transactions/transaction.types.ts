export interface CreateTransactionInput {
  amount: number;
  type: 'income' | 'expense';
  category: string;
  note?: string;
  date?: string;
  createdAt?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: string;
  category: string;
  note: string | null;
  createdAt: Date;
  date: Date;
  userId: string;
}
