export interface CreateTransactionInput {
  amount: number;
  type: 'income' | 'expense';
  category: string;
  note?: string;
  date?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: string;
  category: string;
  note: string | null;
  date: Date;
  userId: string;
}
