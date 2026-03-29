import { Router } from "express";
import {
  addBudget,
  getAllBudgets,
  budgetStatus,
} from "./budget.controller";
import { protect } from "../../common/middleware/auth.middleware";
import { validateRequest } from "../../common/middleware/validation.middleware";
import { createBudgetSchema } from "./budget.validation";

const router = Router();

router.post("/", protect, validateRequest(createBudgetSchema), addBudget);
router.get("/", protect, getAllBudgets);
router.get("/status", protect, budgetStatus);

export default router;

