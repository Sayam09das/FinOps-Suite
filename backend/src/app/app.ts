import express, { Request, Response } from "express";
import { corsMiddleware } from "../common/cors";
import { logger } from "../common/logger";
import { loginLimiter, createAccountLimiter } from "../common/rateLimit";
import { API_VERSION } from "../common/constants";
import prisma, { pingDatabase } from "../config/db";
import authIndex from "../modules/auth/index";
import userIndex from "../modules/user/index";
import transactionIndex from '../modules/transactions/index';
import { healthCheck } from "./health";

// Create app
const app = express();

// Middleware
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api/auth/register', createAccountLimiter);
app.use('/api/auth/login', loginLimiter);

// Routes
app.use("/api/auth", authIndex);
app.use("/api/user", userIndex);
app.use("/api/transactions", transactionIndex);
app.use("api/dashboard", dashboardIndex);

// Health endpoint
app.get("/health", healthCheck);

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

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
