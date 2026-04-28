export interface Holding {
  id: string
  name: string
  type: "stock" | "mutual-fund"
  investedAmount: number
  currentValue: number
  quantity: number
  buyPrice: number
  history: { date: string; value: number }[]
  color: string
}

export interface InvestmentSummaryData {
  totalInvested: number
  currentValue: number
  currency: string
}

export const demoInvestmentSummary: InvestmentSummaryData = {
  totalInvested: 350000,
  currentValue: 412500,
  currency: "INR",
}

export const demoHoldings: Holding[] = [
  {
    id: "1",
    name: "Reliance Industries",
    type: "stock",
    investedAmount: 100000,
    currentValue: 125000,
    quantity: 50,
    buyPrice: 2000,
    color: "#2563EB",
    history: [
      { date: "2025-01-01", value: 100000 },
      { date: "2025-02-01", value: 105000 },
      { date: "2025-03-01", value: 110000 },
      { date: "2025-04-01", value: 115000 },
      { date: "2025-05-01", value: 120000 },
      { date: "2025-06-01", value: 125000 },
    ],
  },
  {
    id: "2",
    name: "HDFC Bank",
    type: "stock",
    investedAmount: 80000,
    currentValue: 92000,
    quantity: 100,
    buyPrice: 800,
    color: "#10B981",
    history: [
      { date: "2025-01-01", value: 80000 },
      { date: "2025-02-01", value: 82000 },
      { date: "2025-03-01", value: 85000 },
      { date: "2025-04-01", value: 87000 },
      { date: "2025-05-01", value: 90000 },
      { date: "2025-06-01", value: 92000 },
    ],
  },
  {
    id: "3",
    name: "SBI Bluechip Fund",
    type: "mutual-fund",
    investedAmount: 100000,
    currentValue: 110000,
    quantity: 1000,
    buyPrice: 100,
    color: "#F59E0B",
    history: [
      { date: "2025-01-01", value: 100000 },
      { date: "2025-02-01", value: 102000 },
      { date: "2025-03-01", value: 104000 },
      { date: "2025-04-01", value: 106000 },
      { date: "2025-05-01", value: 108000 },
      { date: "2025-06-01", value: 110000 },
    ],
  },
  {
    id: "4",
    name: "Tata Motors",
    type: "stock",
    investedAmount: 70000,
    currentValue: 85500,
    quantity: 200,
    buyPrice: 350,
    color: "#8B5CF6",
    history: [
      { date: "2025-01-01", value: 70000 },
      { date: "2025-02-01", value: 73000 },
      { date: "2025-03-01", value: 76000 },
      { date: "2025-04-01", value: 79000 },
      { date: "2025-05-01", value: 82000 },
      { date: "2025-06-01", value: 85500 },
    ],
  },
]

export const portfolioHistory = [
  { date: "2025-01-01", value: 350000 },
  { date: "2025-02-01", value: 362000 },
  { date: "2025-03-01", value: 375000 },
  { date: "2025-04-01", value: 387000 },
  { date: "2025-05-01", value: 400000 },
  { date: "2025-06-01", value: 412500 },
]
