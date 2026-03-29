import { Request, Response } from "express";
import { createBudget, getBudgets, checkBudget } from "./budget.service";

// Create
export const addBudget = async (req: any, res: Response) => {
    try {
        const userId = req.user.id;

        const budget = await createBudget(req.body, userId);

        res.status(201).json({
            success: true,
            data: budget,
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Get all
export const getAllBudgets = async (req: any, res: Response) => {
    const userId = req.user.id;

    const budgets = await getBudgets(userId);

    res.json({
        success: true,
        data: budgets,
    });
};

// Check budget
export const budgetStatus = async (req: any, res: Response) => {
    const userId = req.user.id;
    const { month } = req.query;

    const data = await checkBudget(userId, month);

    res.json({
        success: true,
        data,
    });
};