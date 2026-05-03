import { Router } from "express"
import { protect } from "../../common/middleware/auth.middleware"
import {
  createDebt,
  createInvestment,
  createSavingsGoal,
  getDebts,
  getInvestments,
  getSavingsGoals,
  recordDebtPayment,
} from "./goals.controller"

const router = Router()

router.use(protect)

router.route("/savings").get(getSavingsGoals).post(createSavingsGoal)
router.route("/debts").get(getDebts).post(createDebt)
router.route("/debts/:id/payments").post(recordDebtPayment)
router.route("/investments").get(getInvestments).post(createInvestment)

export default router
