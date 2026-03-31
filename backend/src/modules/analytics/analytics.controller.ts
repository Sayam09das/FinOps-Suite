import { Request, Response, NextFunction } from "express";
import type { AnalyticsData } from "./analytics.types";
import { getAnalyticsData } from "./analytics.service";
import { asyncHandler } from "../../common/utils/asyncHandler";
import { ApiResponse } from "../../common/utils/apiResponse";

export const getAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const data: AnalyticsData = await getAnalyticsData(userId);

  ApiResponse.success(data, res);
});
