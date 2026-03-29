import { Router } from 'express';
import budgetRoutes from './budget.routes';

/**
 * Budgets module router - prefixed with /budgets for app.use("/api", ...)
 */
const router = Router();
router.use('/budgets', budgetRoutes);

export default router;

