import { Request, Response } from "express"
import { asyncHandler } from "../../common/utils/asyncHandler"
import { ApiResponse } from "../../common/utils/apiResponse"
import transfersRepository from "./transfers.repository"
import { AppError } from "../../common/errors"
import type { CreateTransferDTO, UpdateTransferDTO } from "./transfers.types"

export const getAllTransfers = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id
  const transfers = await transfersRepository.findAllByUserId(userId)
  ApiResponse.success(transfers, res)
})

export const getTransfer = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id
  const { id } = req.params
  
  const transfer = await transfersRepository.findById(id, userId)
  if (!transfer) {
    throw new AppError("NOT_FOUND", 404, "Transfer not found")
  }
  ApiResponse.success(transfer, res)
})

export const createTransfer = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id
  const transferData: CreateTransferDTO = req.body
  
  try {
    const transfer = await transfersRepository.create(userId, transferData)
    ApiResponse.success(transfer, res, 201)
  } catch (error: any) {
    if (error.message === "Account not found") {
      throw new AppError("NOT_FOUND", 404, "Account not found")
    }
    if (error.message === "Insufficient balance") {
      throw new AppError("BAD_REQUEST", 400, "Insufficient balance for this transfer")
    }
    throw error
  }
})

export const updateTransfer = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id
  const { id } = req.params
  const updateData: UpdateTransferDTO = req.body
  
  try {
    const transfer = await transfersRepository.update(id, userId, updateData)
    ApiResponse.success(transfer, res)
  } catch (error: any) {
    if (error.errorCode === "NOT_FOUND") {
      throw error
    }
    throw new AppError("NOT_FOUND", 404, "Transfer not found")
  }
})

export const deleteTransfer = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id
  const { id } = req.params
  
  try {
    await transfersRepository.delete(id, userId)
    ApiResponse.success({ deleted: true }, res)
  } catch (error: any) {
    if (error.errorCode === "NOT_FOUND") {
      throw error
    }
    throw new AppError("NOT_FOUND", 404, "Transfer not found")
  }
})

export const getRecentTransfers = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id
  const limit = parseInt(req.query.limit as string) || 10
  
  const transfers = await transfersRepository.findRecentByUserId(userId, limit)
  ApiResponse.success(transfers, res)
})

export const getTransferStats = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id
  const stats = await transfersRepository.getTransferStats(userId)
  ApiResponse.success(stats, res)
})
