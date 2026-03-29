export interface Budget {
  id: string;
  userId: string;
  category: string;
  amount: number;
  month: string; // YYYY-MM format
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BudgetStatus {
  [category: string]: {
    budget: number;
    spent: number;
    remaining: number;
  };
}

export interface CreateBudgetRequest {
  category: string;
  amount: number;
  month: string;
}

export interface BudgetStatusQuery {
  month?: string;
}

