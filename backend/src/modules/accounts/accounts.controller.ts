import { Request, Response } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler";
import { ApiResponse } from "../../common/utils/apiResponse";
import accountsRepository from "./accounts.repository";
import { AppError } from "../../common/errors";
import type { CreateAccountDTO, UpdateAccountDTO } from "./accounts.types";

export const getAllAccounts = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const accounts = await accountsRepository.findAllByUserId(userId);
  ApiResponse.success(accounts, res);
});

export const getBankAccounts = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const accounts = await accountsRepository.findBanksByUserId(userId);
  ApiResponse.success(accounts, res);
});

export const getWalletAccounts = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const accounts = await accountsRepository.findWalletsByUserId(userId);
  ApiResponse.success(accounts, res);
});

export const getCreditCardAccounts = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const accounts = await accountsRepository.findCreditCardsByUserId(userId);
  ApiResponse.success(accounts, res);
});

export const getAccount = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  
  const account = await accountsRepository.findById(id as string, userId);
  if (!account) {
    throw new AppError("NOT_FOUND", 404, "Account not found");
  }
  ApiResponse.success(account, res);
});

export const createNewAccount = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const accountData: CreateAccountDTO = req.body;
  
  const account = await accountsRepository.create(userId, accountData);
  ApiResponse.success(account, res, 201);
});

export const updateExistingAccount = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  const updateData: UpdateAccountDTO = req.body;
  
  try {
    const account = await accountsRepository.update(id as string, userId, updateData);
    ApiResponse.success(account, res);
  } catch (error) {
    if (error instanceof AppError && error.errorCode === "NOT_FOUND") {
      throw error;
    }
    throw new AppError("NOT_FOUND", 404, "Account not found");
  }
});

export const deleteExistingAccount = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  
  try {
    await accountsRepository.delete(id as string, userId);
    ApiResponse.success({ deleted: true }, res);
  } catch (error) {
    if (error instanceof AppError && error.errorCode === "NOT_FOUND") {
      throw error;
    }
    throw new AppError("NOT_FOUND", 404, "Account not found");
  }
});

export const updateBalance = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  const { amount, operation } = req.body;
  
  if (!amount || !operation) {
    throw new AppError("BAD_REQUEST", 400, "Amount and operation are required");
  }
  
  try {
    const account = await accountsRepository.updateBalance(id as string, userId, amount, operation);
    ApiResponse.success(account, res);
  } catch (error) {
    if (error instanceof AppError && error.errorCode === "NOT_FOUND") {
      throw error;
    }
    throw new AppError("NOT_FOUND", 404, "Account not found");
  }
});

export const getTotalBalance = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const total = await accountsRepository.getTotalBalance(userId);
  ApiResponse.success({ totalBalance: total }, res);
});

export const getAccountBalanceByType = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { type } = req.query;
  
  // Handle string | string[] case - take first element if array
  const typeStr = Array.isArray(type) ? type[0] : type;
  
  if (!typeStr || typeof typeStr !== "string") {
    throw new AppError("BAD_REQUEST", 400, "Account type is required");
  }
  
  const accounts = await accountsRepository.findByType(userId, typeStr);
  const balance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  ApiResponse.success({ type: typeStr, balance }, res);
});
