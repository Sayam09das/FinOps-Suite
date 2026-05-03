import { Request, Response } from "express"
import { asyncHandler } from "../../common/utils/asyncHandler"
import { ApiResponse } from "../../common/utils/apiResponse"
import goalsRepository from "./goals.repository"
import type {
  CreateDebtDTO,
  CreateInvestmentDTO,
  CreateSavingsGoalDTO,
  RecordDebtPaymentDTO,
} from "./goals.types"

export const getSavingsGoals = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id
  const data = await goalsRepository.getSavingsDashboard(userId)
  ApiResponse.success(data, res)
})

export const createSavingsGoal = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id
  const goal = await goalsRepository.createSavingsGoal(userId, req.body as CreateSavingsGoalDTO)
  ApiResponse.success(goal, res, 201)
})

export const getDebts = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id
  const data = await goalsRepository.getDebtDashboard(userId)
  ApiResponse.success(data, res)
})

export const createDebt = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id
  const debt = await goalsRepository.createDebt(userId, req.body as CreateDebtDTO)
  ApiResponse.success(debt, res, 201)
})

export const recordDebtPayment = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id
  const debt = await goalsRepository.recordDebtPayment(userId, req.params.id as string, req.body as RecordDebtPaymentDTO)
  ApiResponse.success(debt, res)
})

export const getInvestments = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id
  const data = await goalsRepository.getInvestmentDashboard(userId)
  ApiResponse.success(data, res)
})

export const createInvestment = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id
  const investment = await goalsRepository.createInvestment(userId, req.body as CreateInvestmentDTO)
  ApiResponse.success(investment, res, 201)
})
