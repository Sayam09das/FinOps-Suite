import { Request, Response, NextFunction } from "express";
import { createBudget, getBudgets, checkBudget } from "./budget.service";
import { asyncHandler } from "../../common/utils/asyncHandler";
import { ApiResponse } from "../../common/utils/apiResponse";

// Create
export const addBudget = asyncHandler(async (req: any, res: Response) => {
    const userId = req.user.id;

    const budget = await createBudget(req.body, userId);

    ApiResponse.success(budget, res, 201);
});

// Get all
export const getAllBudgets = asyncHandler(async (req: any, res: Response) => {
    const userId = req.user.id;

    const budgets = await getBudgets(userId);

    ApiResponse.success(budgets, res);
});

// Check budget
export const budgetStatus = asyncHandler(async (req: any, res: Response) => {
    const userId = req.user.id;
    const { month } = req.query;

    const data = await checkBudget(userId, month);

    ApiResponse.success(data, res);
});
