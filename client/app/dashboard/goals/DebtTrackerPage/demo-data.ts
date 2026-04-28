export interface PaymentRecord {
  date: string
  amount: number
  type: "regular" | "extra"
}

export interface Debt {
  id: string
  name: string
  type: "loan" | "credit-card"
  totalAmount: number
  remainingBalance: number
  interestRate: number
  emi: number
  color: string
  payments: PaymentRecord[]
}

export interface DebtSummaryData {
  totalDebt: number
  totalPaid: number
  remaining: number
  currency: string
}

export const demoDebtSummary: DebtSummaryData = {
  totalDebt: 1200000,
  totalPaid: 480000,
  remaining: 720000,
  currency: "INR",
}

export const demoDebts: Debt[] = [
  {
    id: "1",
    name: "Home Loan",
    type: "loan",
    totalAmount: 1000000,
    remainingBalance: 600000,
    interestRate: 8.5,
    emi: 25000,
    color: "#F59E0B",
    payments: [
      { date: "2025-01-05", amount: 25000, type: "regular" },
      { date: "2025-02-05", amount: 25000, type: "regular" },
      { date: "2025-03-05", amount: 25000, type: "regular" },
      { date: "2025-04-05", amount: 25000, type: "regular" },
      { date: "2025-05-05", amount: 25000, type: "regular" },
      { date: "2025-06-05", amount: 25000, type: "regular" },
    ],
  },
  {
    id: "2",
    name: "Personal Loan",
    type: "loan",
    totalAmount: 200000,
    remainingBalance: 120000,
    interestRate: 12.0,
    emi: 9000,
    color: "#EF4444",
    payments: [
      { date: "2025-01-10", amount: 9000, type: "regular" },
      { date: "2025-02-10", amount: 9000, type: "regular" },
      { date: "2025-03-10", amount: 9000, type: "regular" },
      { date: "2025-04-10", amount: 12000, type: "extra" },
      { date: "2025-05-10", amount: 9000, type: "regular" },
    ],
  },
  {
    id: "3",
    name: "Credit Card",
    type: "credit-card",
    totalAmount: 150000,
    remainingBalance: 75000,
    interestRate: 36.0,
    emi: 15000,
    color: "#8B5CF6",
    payments: [
      { date: "2025-01-15", amount: 15000, type: "regular" },
      { date: "2025-02-15", amount: 15000, type: "regular" },
      { date: "2025-03-15", amount: 15000, type: "regular" },
      { date: "2025-04-15", amount: 20000, type: "extra" },
      { date: "2025-05-15", amount: 15000, type: "regular" },
    ],
  },
]
