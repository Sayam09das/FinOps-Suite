import prisma from "../../config/db"
import { AppError } from "../../common/errors"
import type {
  CreateDebtDTO,
  CreateInvestmentDTO,
  CreateSavingsGoalDTO,
  RecordDebtPaymentDTO,
} from "./goals.types"

const DEFAULT_SAVINGS_COLOR = "#3B82F6"
const DEFAULT_SAVINGS_ICON = "Shield"
const DEFAULT_DEBT_COLOR = "#F59E0B"
const DEFAULT_INVESTMENT_COLOR = "#2563EB"
const DEFAULT_CURRENCY = "INR"

const mapSavingsGoal = (goal: any) => ({
  id: goal.id,
  name: goal.name,
  targetAmount: goal.targetAmount,
  currentAmount: goal.currentAmount,
  deadline: goal.deadline.toISOString(),
  linkedAccount: goal.linkedAccount,
  color: goal.color,
  icon: goal.icon,
  currency: goal.currency,
  contributions: (goal.contributions || []).map((contribution: any) => ({
    id: contribution.id,
    date: contribution.date.toISOString(),
    amount: contribution.amount,
  })),
})

const mapDebt = (debt: any) => ({
  id: debt.id,
  name: debt.name,
  type: debt.type,
  totalAmount: debt.totalAmount,
  remainingBalance: debt.remainingBalance,
  interestRate: debt.interestRate,
  emi: debt.emi,
  color: debt.color,
  currency: debt.currency,
  payments: (debt.payments || []).map((payment: any) => ({
    id: payment.id,
    date: payment.date.toISOString(),
    amount: payment.amount,
    type: payment.type,
  })),
})

const mapInvestment = (investment: any) => ({
  id: investment.id,
  name: investment.name,
  type: investment.type,
  investedAmount: investment.investedAmount,
  currentValue: investment.currentValue,
  quantity: investment.quantity,
  buyPrice: investment.buyPrice,
  color: investment.color,
  currency: investment.currency,
  history: (investment.history || []).map((entry: any) => ({
    id: entry.id,
    date: entry.date.toISOString(),
    value: entry.value,
  })),
})

const buildPortfolioHistory = (investments: ReturnType<typeof mapInvestment>[]) => {
  const grouped = new Map<string, number>()

  investments.forEach((investment) => {
    investment.history.forEach((entry: { date: string; value: number }) => {
      const month = new Date(entry.date).toISOString().slice(0, 10)
      grouped.set(month, (grouped.get(month) || 0) + entry.value)
    })
  })

  return [...grouped.entries()]
    .sort((left, right) => left[0].localeCompare(right[0]))
    .map(([date, value]) => ({ date, value }))
}

export const goalsRepository = {
  async getSavingsDashboard(userId: string) {
    const goals = await prisma.savingsGoal.findMany({
      where: { userId },
      include: {
        contributions: {
          orderBy: { date: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const mappedGoals = goals.map(mapSavingsGoal)
    const totalSaved = mappedGoals.reduce((sum, goal) => sum + goal.currentAmount, 0)
    const totalTarget = mappedGoals.reduce((sum, goal) => sum + goal.targetAmount, 0)

    return {
      summary: {
        totalGoals: mappedGoals.length,
        totalSaved,
        totalTarget,
        currency: DEFAULT_CURRENCY,
      },
      goals: mappedGoals,
    }
  },

  async createSavingsGoal(userId: string, data: CreateSavingsGoalDTO) {
    const currentAmount = Number(data.currentAmount || 0)
    const goal = await prisma.savingsGoal.create({
      data: {
        userId,
        name: data.name,
        targetAmount: Number(data.targetAmount),
        currentAmount,
        deadline: new Date(data.deadline),
        linkedAccount: data.linkedAccount,
        color: data.color || DEFAULT_SAVINGS_COLOR,
        icon: data.icon || DEFAULT_SAVINGS_ICON,
        currency: data.currency || DEFAULT_CURRENCY,
        contributions: currentAmount > 0 ? {
          create: [
            {
              amount: currentAmount,
              date: new Date(),
            },
          ],
        } : undefined,
      },
      include: {
        contributions: {
          orderBy: { date: "asc" },
        },
      },
    })

    return mapSavingsGoal(goal)
  },

  async getDebtDashboard(userId: string) {
    const debts = await prisma.debt.findMany({
      where: { userId },
      include: {
        payments: {
          orderBy: { date: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const mappedDebts = debts.map(mapDebt)
    const totalDebt = mappedDebts.reduce((sum, debt) => sum + debt.totalAmount, 0)
    const remaining = mappedDebts.reduce((sum, debt) => sum + debt.remainingBalance, 0)
    const totalPaid = totalDebt - remaining

    return {
      summary: {
        totalDebt,
        totalPaid,
        remaining,
        currency: DEFAULT_CURRENCY,
      },
      debts: mappedDebts,
    }
  },

  async createDebt(userId: string, data: CreateDebtDTO) {
    const debt = await prisma.debt.create({
      data: {
        userId,
        name: data.name,
        type: data.type,
        totalAmount: Number(data.totalAmount),
        remainingBalance: Number(data.remainingBalance),
        interestRate: Number(data.interestRate),
        emi: Number(data.emi),
        color: data.color || DEFAULT_DEBT_COLOR,
        currency: data.currency || DEFAULT_CURRENCY,
      },
      include: {
        payments: {
          orderBy: { date: "asc" },
        },
      },
    })

    return mapDebt(debt)
  },

  async recordDebtPayment(userId: string, debtId: string, data: RecordDebtPaymentDTO) {
    const existingDebt = await prisma.debt.findFirst({
      where: { id: debtId, userId },
    })

    if (!existingDebt) {
      throw new AppError("NOT_FOUND", 404, "Debt not found")
    }

    const amount = Number(data.amount)
    const nextBalance = Math.max(0, existingDebt.remainingBalance - amount)

    const [updatedDebt] = await prisma.$transaction([
      prisma.debt.update({
        where: { id: debtId },
        data: {
          remainingBalance: nextBalance,
          payments: {
            create: {
              amount,
              type: data.type || "regular",
              date: data.date ? new Date(data.date) : new Date(),
            },
          },
        },
        include: {
          payments: {
            orderBy: { date: "asc" },
          },
        },
      }),
    ])

    return mapDebt(updatedDebt)
  },

  async getInvestmentDashboard(userId: string) {
    const investments = await prisma.investment.findMany({
      where: { userId },
      include: {
        history: {
          orderBy: { date: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const mappedInvestments = investments.map(mapInvestment)
    const totalInvested = mappedInvestments.reduce((sum, holding) => sum + holding.investedAmount, 0)
    const currentValue = mappedInvestments.reduce((sum, holding) => sum + holding.currentValue, 0)

    return {
      summary: {
        totalInvested,
        currentValue,
        currency: DEFAULT_CURRENCY,
      },
      holdings: mappedInvestments,
      portfolioHistory: buildPortfolioHistory(mappedInvestments),
    }
  },

  async createInvestment(userId: string, data: CreateInvestmentDTO) {
    const investment = await prisma.investment.create({
      data: {
        userId,
        name: data.name,
        type: data.type,
        investedAmount: Number(data.investedAmount),
        currentValue: Number(data.currentValue),
        quantity: Number(data.quantity),
        buyPrice: Number(data.buyPrice),
        color: data.color || DEFAULT_INVESTMENT_COLOR,
        currency: data.currency || DEFAULT_CURRENCY,
        history: {
          create: {
            value: Number(data.currentValue),
            date: new Date(),
          },
        },
      },
      include: {
        history: {
          orderBy: { date: "asc" },
        },
      },
    })

    return mapInvestment(investment)
  },
}

export default goalsRepository
