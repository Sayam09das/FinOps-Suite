import type { LucideIcon } from "lucide-react"

// ─── Bank Accounts ───
export type AccountType = "Savings" | "Current" | "Fixed Deposit" | "Recurring Deposit"
export type AccountStatus = "active" | "inactive"

export interface BankAccount {
  id: string
  bankName: string
  accountType: AccountType
  accountNumber: string
  balance: number
  currency: string
  status: AccountStatus
  lastUpdated: string
  notes?: string
  history: BalanceHistoryPoint[]
}

export interface BalanceHistoryPoint {
  date: string
  balance: number
}

// ─── Wallets ───
export type WalletType = "cash" | "digital" | "gift_card"

export interface Wallet {
  id: string
  name: string
  type: WalletType
  balance: number
  currency: string
  lastUpdated: string
  notes?: string
}

// ─── Credit Cards ───
export interface CreditCard {
  id: string
  cardName: string
  bankName: string
  cardNumberLast4: string
  limit: number
  used: number
  currency: string
  dueDate: string
  minimumDue: number
  lastPaymentDate?: string
  lastPaymentAmount?: number
  status: "active" | "blocked" | "expired"
}

// ─── Transfers ───
export interface AccountTransfer {
  id: string
  fromAccountId: string
  fromAccountName: string
  fromAccountType: "bank" | "wallet"
  toAccountId: string
  toAccountName: string
  toAccountType: "bank" | "wallet"
  amount: number
  currency: string
  date: string
  notes?: string
  fee?: number
  status: "completed" | "pending" | "failed"
}

// ─── Activity / Transactions ───
export interface AccountActivity {
  id: string
  date: string
  description: string
  amount: number
  type: "credit" | "debit"
  category: string
}

// ─── Shared ───
export interface SelectOption {
  label: string
  value: string
  icon?: LucideIcon
  meta?: string
}

