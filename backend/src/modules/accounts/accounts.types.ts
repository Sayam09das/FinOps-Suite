export interface Account {
  id: string;
  userId: string;
  name: string;
  type: "bank" | "cash" | "investment" | "credit_card" | "wallet" | "other";
  balance: number;
  currency: string;
  institution?: string;
  accountNumber?: string;
  isActive: boolean;
  asOfDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccountsResponse {
  accounts: Account[];
  totalBalance: number;
  totalAccounts: number;
  byType: Record<string, number>;
}

export interface AccountBalanceResponse {
  totalBalance: number;
  accounts: {
    id: string;
    name: string;
    balance: number;
  }[];
}

export interface AccountActivityResponse {
  transactions: {
    id: string;
    accountId: string;
    accountName: string;
    type: " debit" | "credit";
    amount: number;
    description: string;
    date: string;
  }[];
}

export interface CreateAccountDTO {
  name: string;
  type: "bank" | "cash" | "investment" | "credit_card" | "wallet" | "other";
  balance?: number;
  currency?: string;
  institution?: string;
  accountNumber?: string;
}

export interface UpdateAccountDTO {
  name?: string;
  type?: "bank" | "cash" | "investment" | "credit_card" | "wallet" | "other";
  balance?: number;
  currency?: string;
  institution?: string;
  accountNumber?: string;
  isActive?: boolean;
}
