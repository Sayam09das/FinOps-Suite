import express, { Request, Response } from "express";
import cookieParser from 'cookie-parser';
import { corsMiddleware } from "../config/cors";
import { logger } from "../config/logger";
import { API_VERSION } from "../config/constants";
import { AppError } from "../common/errors";
import prisma, { pingDatabase } from "../config/db";
import authIndex from "../modules/auth/index";
import userIndex from "../modules/user/index";
import transactionIndex from '../modules/transactions/index';
import dashboardIndex from "../modules/dashboard/index";
import budgetIndex from "../modules/budgets/index";
import analyticsIndex from "../modules/analytics";
import notificationsIndex from "../modules/notifications";
import { startNotificationWorker } from "../infrastructure/queue/notification.queue";
import uploadsIndex from "../modules/uploads/index";
import healthIndex from "../modules/health";
import accountsIndex from "../modules/accounts";
import transfersIndex from "../modules/transfers";
import goalsIndex from "../modules/goals";

// Create app
const app = express();

// Trust proxy for rate limiting behind reverse proxy (Render)
app.set('trust proxy', 1);

// Middleware - ORDER MATTERS!
// 1. CORS must come first (to handle preflight OPTIONS requests)
// 2. Cookie parser must come before routes (to parse cookies)
app.use(corsMiddleware);
app.use(cookieParser()); // CRITICAL: Parse cookies from requests
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authIndex);
app.use("/api/user", userIndex);
app.use("/api/accounts", accountsIndex);
app.use("/api/transfers", transfersIndex);
app.use("/api/goals", goalsIndex);
app.use("/api/transactions", transactionIndex);
app.use("/api/dashboard", dashboardIndex);
app.use("/api", budgetIndex);
app.use("/api/analytics", analyticsIndex);
app.use("/api/notifications", notificationsIndex);
app.use("/api/uploads", uploadsIndex);

// Start notification worker
void startNotificationWorker();

// Health endpoint
app.use("/api/health", healthIndex);

// Root
app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "FinOps Suite API",
    version: API_VERSION,
    status: "healthy",
  });
});

// DB test
app.get("/test-db", async (_req: Request, res: Response) => {
  try {
    await pingDatabase();
    const userCount = await prisma.user.count();
    res.json({
      status: "OK",
      db: "connected",
      userCount,
    });
  } catch (error) {
    logger.error(error, "DB test failed");
    res.status(503).json({
      status: "ERROR",
      db: "disconnected",
    });
  }
});



// Global error handler
app.use((error: any, req: Request, res: Response, next: any) => {
  logger.error(error, `Error occurred at ${req.method} ${req.path}`);

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      ...error.toJSON(),
    });
  } else {
    res.status(500).json({
      success: false,
      errorCode: 'GENERAL_002',
      message: 'Internal server error',
    });
  }
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    errorCode: 'GENERAL_001',
    message: "Route not found",
  });
});

export default app;
