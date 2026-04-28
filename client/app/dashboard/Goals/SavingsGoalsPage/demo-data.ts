export interface Contribution {
  date: string
  amount: number
}

export interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
  linkedAccount: string
  color: string
  icon: string
  contributions: Contribution[]
}

export interface SavingsSummaryData {
  totalGoals: number
  totalSaved: number
  totalTarget: number
  currency: string
}

export const demoSavingsSummary: SavingsSummaryData = {
  totalGoals: 4,
  totalSaved: 285000,
  totalTarget: 450000,
  currency: "INR",
}

export const demoSavingsGoals: SavingsGoal[] = [
  {
    id: "1",
    name: "Emergency Fund",
    targetAmount: 150000,
    currentAmount: 120000,
    deadline: "2025-12-31",
    linkedAccount: "Savings Account",
    color: "#10B981",
    icon: "Shield",
    contributions: [
      { date: "2025-01-15", amount: 10000 },
      { date: "2025-02-15", amount: 10000 },
      { date: "2025-03-15", amount: 10000 },
      { date: "2025-04-15", amount: 10000 },
      { date: "2025-05-15", amount: 10000 },
      { date: "2025-06-15", amount: 10000 },
    ],
  },
  {
    id: "2",
    name: "Vacation",
    targetAmount: 80000,
    currentAmount: 45000,
    deadline: "2025-09-30",
    linkedAccount: "Wallet",
    color: "#3B82F6",
    icon: "Plane",
    contributions: [
      { date: "2025-01-20", amount: 8000 },
      { date: "2025-02-20", amount: 8000 },
      { date: "2025-03-20", amount: 8000 },
      { date: "2025-04-20", amount: 8000 },
      { date: "2025-05-20", amount: 6500 },
    ],
  },
  {
    id: "3",
    name: "New Car",
    targetAmount: 500000,
    currentAmount: 80000,
    deadline: "2026-06-30",
    linkedAccount: "Savings Account",
    color: "#F59E0B",
    icon: "Car",
    contributions: [
      { date: "2025-01-10", amount: 15000 },
      { date: "2025-02-10", amount: 15000 },
      { date: "2025-03-10", amount: 15000 },
      { date: "2025-04-10", amount: 15000 },
      { date: "2025-05-10", amount: 10000 },
    ],
  },
  {
    id: "4",
    name: "Home Down Payment",
    targetAmount: 1000000,
    currentAmount: 40000,
    deadline: "2027-03-31",
    linkedAccount: "Fixed Deposit",
    color: "#8B5CF6",
    icon: "Home",
    contributions: [
      { date: "2025-01-05", amount: 10000 },
      { date: "2025-02-05", amount: 10000 },
      { date: "2025-03-05", amount: 10000 },
      { date: "2025-04-05", amount: 10000 },
    ],
  },
]

export const accountOptions = [
  { value: "savings", label: "Savings Account" },
  { value: "wallet", label: "Wallet" },
  { value: "fd", label: "Fixed Deposit" },
  { value: "checking", label: "Checking Account" },
]
