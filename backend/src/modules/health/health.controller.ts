import { Request, Response, NextFunction } from "express";
import { pingDatabase } from "../../config/db";
import { logger } from "../../config/logger";
import { AppError } from "../../common/errors";
import { ApiResponse } from "../../common/utils/apiResponse";

export const healthCheck = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await pingDatabase();
    const uptime = process.uptime();

    ApiResponse.success(
      {
        db: "connected",
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`,
      },
      res,
      200,
      "OK"
    );
  } catch (error) {
    logger.error(error, "Health check failed");

    const message = error instanceof Error ? error.message : "Database ping failed";
    return next(new AppError("HEALTH_001", 503, message));
  }
};
