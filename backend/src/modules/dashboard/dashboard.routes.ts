import { Router } from "express";
import { getDashboard, getNetWorth } from "./dashboard.controller";
import { protect } from "../../common/middleware/auth.middleware";

const router = Router();

router.get("/", protect, getDashboard);
router.get("/networth", protect, getNetWorth);

export default router;
