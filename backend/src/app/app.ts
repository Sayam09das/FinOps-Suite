import express from "express";
import prisma, { pingDatabase } from "../config/db";
import authIndex from "../modules/auth/index";
import userRoutes from "../modules/user/user.routes";
import { healthCheck } from "./health";

const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


app.use("/api", authIndex);
app.use("/api/user", userRoutes);


// Health endpoint
app.get("/health", healthCheck);

// Health Check Route
app.get("/", (req, res) => {
  res.send("Backend API is running 🚀");
});

// DB test route
app.get("/test-db", async (req, res) => {
  try {
    await pingDatabase();
    const userCount = await prisma.user.count();

    res.status(200).json({
      status: "OK",
      db: "connected",
      userCount,
    });
  } catch (error) {
    console.error("DB test route failed:", error);
    res.status(503).json({
      status: "ERROR",
      db: "disconnected",
      error: error instanceof Error ? error.message : "Database query failed",
    });
  }
});

export default app;
