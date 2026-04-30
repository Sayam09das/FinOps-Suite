import { Router } from "express";
import {
  addTransaction,
  getAllTransactions,
  removeTransaction,
  editTransaction,
  monthlySummary,
  categoryAnalytics,
} from "./transaction.controller";
import { protect } from "../../common/middleware/auth.middleware";
import { validateRequest } from "../../common/middleware/validation.middleware";
import { createTransactionSchema, updateTransactionSchema } from "./transaction.validation";

const router = Router();

router.post("/", protect, validateRequest(createTransactionSchema), addTransaction);
router.get("/", protect, getAllTransactions);
router.delete("/:id", protect, removeTransaction);
router.put("/:id", protect, validateRequest(updateTransactionSchema), editTransaction);
router.get("/summary", protect, monthlySummary);
router.get("/analytics/category", protect, categoryAnalytics);

export default router;
