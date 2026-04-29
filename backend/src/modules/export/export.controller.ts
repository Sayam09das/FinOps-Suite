import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler";
import { ApiResponse } from "../../common/utils/apiResponse";
import { exportDashboardData } from "./export.service";

export const exportCSV = asyncHandler(async (req: Request, res: Response) => {
  const { dateRange = 'thisMonth' } = req.query;
  const userId = (req as any).user.id;

  const csvData = await exportDashboardData(userId, dateRange as string, 'csv');
  
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="finops-dashboard-${new Date().toISOString().slice(0,10)}.csv"`);
  
  res.send(csvData);
});

