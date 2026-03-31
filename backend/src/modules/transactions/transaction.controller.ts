import { Request, Response, NextFunction } from "express";
import {
  createTransaction,
  getTransactions,
  deleteTransaction,
  getTransactionsBasic,
  updateTransaction,
  getMonthlySummary,
  getCategoryAnalytics,
} from "./transaction.service";
import redis, { ensureRedisConnection } from "../../infrastructure/cache/redis";
import { asyncHandler } from "../../common/utils/asyncHandler";
import { ApiResponse } from "../../common/utils/apiResponse";

// Create
export const addTransaction = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const transaction = await createTransaction(req.body, userId);

  // Invalidate dashboard cache
  if (await ensureRedisConnection()) {
    await redis.del(`dashboard:${userId}`);
  }

  ApiResponse.success(transaction, res, 201);
});

// Get all (filtered/paginated)
export const getAllTransactions = asyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;

  const result = await getTransactions(userId, req.query);

  ApiResponse.success(result, res);
});

// Delete
export const removeTransaction = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  await deleteTransaction(id, userId);

  // Invalidate dashboard cache
  if (await ensureRedisConnection()) {
    await redis.del(`dashboard:${userId}`);
  }

  ApiResponse.success(null, res, 200, "Transaction deleted");
});

// ✏️ Update
export const editTransaction = asyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const updated = await updateTransaction(
    id,
    userId,
    req.body
  );

  // Invalidate dashboard cache
  if (await ensureRedisConnection()) {
    await redis.del(`dashboard:${userId}`);
  }

  ApiResponse.success(updated, res);
});

// 📊 Monthly summary
export const monthlySummary = asyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;

  const summary = await getMonthlySummary(userId);

  ApiResponse.success(summary, res);
});

// 📊 Category analytics
export const categoryAnalytics = asyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;

  const data = await getCategoryAnalytics(userId);

  ApiResponse.success(data, res);
});
