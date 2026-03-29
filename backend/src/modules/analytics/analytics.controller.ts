import { Request, Response } from "express";
import type { AnalyticsData } from "./analytics.types";
import { getAnalyticsData } from "./analytics.service";

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const data: AnalyticsData = await getAnalyticsData(userId);

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error("Analytics error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch analytics",
    });
  }
};
