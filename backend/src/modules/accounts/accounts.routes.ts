import { Router } from "express";
import { protect } from "../../common/middleware/auth.middleware";
import {
  getAllAccounts,
  getBankAccounts,
  getWalletAccounts,
  getCreditCardAccounts,
  getAccount,
  createNewAccount,
  updateExistingAccount,
  deleteExistingAccount,
  updateBalance,
  getTotalBalance,
  getAccountBalanceByType,
} from "./accounts.controller";

const router = Router();

// All routes require authentication
router.use(protect);

// CRUD routes
router.route("/").get(getAllAccounts).post(createNewAccount);

router.route("/banks").get(getBankAccounts);

router.route("/wallets").get(getWalletAccounts);

router.route("/credit-cards").get(getCreditCardAccounts);

router.route("/total-balance").get(getTotalBalance);

router.route("/balance-by-type").get(getAccountBalanceByType);

// Individual account routes
router.route("/:id").get(getAccount).patch(updateExistingAccount).delete(deleteExistingAccount);

router.route("/:id/balance").patch(updateBalance);

export default router;
