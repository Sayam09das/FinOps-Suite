import { Request, Response, NextFunction } from "express";
import { DashboardData } from "./dashboard.types";
import { getDashboardData } from "./dashboard.service";
import { asyncHandler } from "../../common/utils/asyncHandler";
import { ApiResponse } from "../../common/utils/apiResponse";

export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    const data: DashboardData = await getDashboardData(userId);

    ApiResponse.success(data, res);
});
