import { Router } from "express"
import { protect } from "../../common/middleware/auth.middleware"
import {
  getAllTransfers,
  getTransfer,
  createTransfer,
  updateTransfer,
  deleteTransfer,
  getRecentTransfers,
  getTransferStats,
} from "./transfers.controller"

const router = Router()

// All routes require authentication
router.use(protect)

// CRUD routes
router.route("/").get(getAllTransfers).post(createTransfer)

router.route("/recent").get(getRecentTransfers)

router.route("/stats").get(getTransferStats)

// Individual transfer routes
router.route("/:id").get(getTransfer).patch(updateTransfer).delete(deleteTransfer)

export default router
