import { Request, Response } from "express";
import {
  createTransaction,
  getTransactions,
  deleteTransaction,
  getTransactionsBasic,
  updateTransaction,
  getMonthlySummary,
  getCategoryAnalytics,
} from "./transaction.service";
import redis from "../../infrastructure/cache/redis";

// Create
export const addTransaction = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const transaction = await createTransaction(req.body, userId);

    // Invalidate dashboard cache
    await redis.del(`dashboard:${userId}`);

    res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all (filtered/paginated)
export const getAllTransactions = async (req: any, res: any) => {
  try {
    const userId = req.user.id;

    const result = await getTransactions(userId, req.query);

    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete
export const removeTransaction = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    await deleteTransaction(id, userId);

    // Invalidate dashboard cache
    await redis.del(`dashboard:${userId}`);

    res.json({
      success: true,
      message: "Transaction deleted",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ✏️ Update
export const editTransaction = async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const updated = await updateTransaction(
      id,
      userId,
      req.body
    );

    // Invalidate dashboard cache
    await redis.del(`dashboard:${userId}`);

    res.json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 📊 Monthly summary
export const monthlySummary = async (req: any, res: any) => {
  try {
    const userId = req.user.id;

    const summary = await getMonthlySummary(userId);

    res.json({
      success: true,
      data: summary,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📊 Category analytics
export const categoryAnalytics = async (req: any, res: any) => {
  try {
    const userId = req.user.id;

    const data = await getCategoryAnalytics(userId);

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
