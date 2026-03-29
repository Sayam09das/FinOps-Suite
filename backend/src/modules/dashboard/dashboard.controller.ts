import { Request, Response } from "express";
import { DashboardData } from "./dashboard.types";
import { getDashboardData } from "./dashboard.service";

export const getDashboard = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        const data: DashboardData = await getDashboardData(userId);

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