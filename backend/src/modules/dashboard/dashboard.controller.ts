import { Request, Response } from "express";
import { getDashboardData } from "./dashboard.service";

export const getDashboard = async (req: any, res: Response) => {
    try {
        const userId = req.user.id;

        const data = await getDashboardData(userId);

        res.json({
            success: true,
            data,
        });
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
        });
    }
};