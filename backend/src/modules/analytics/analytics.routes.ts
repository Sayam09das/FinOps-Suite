import { Router } from "express";
import { getAnalytics } from "./analytics.controller";
import { protect } from "../../common/middleware/auth.middleware";

const router = Router();

// 📊 Analytics endpoints
router.get("/overview", protect, getAnalytics);

export default router;

