import { Router } from "express";
import analyticsRoutes from "./analytics.routes";

const router = Router();
router.use("/analytics", analyticsRoutes);

export default router;

