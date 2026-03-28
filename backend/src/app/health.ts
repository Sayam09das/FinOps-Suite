import { Request, Response } from "express";
import { pingDatabase } from "../config/db";

export const healthCheck = async (_req: Request, res: Response): Promise<void> => {
  try {
    await pingDatabase();
    const uptime = process.uptime();

    res.status(200).json({
      status: "OK",
      db: "connected",
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`,
    });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(503).json({
      status: "ERROR",
      db: "disconnected",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Database ping failed",
    });
  }
};
