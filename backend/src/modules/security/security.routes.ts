import { Router } from "express"
import { protect } from "../../common/middleware/auth.middleware"
import {
  getAuditLogs,
  getLoginActivity,
  getPermissions,
  updateUserRole,
} from "./security.controller"

const router = Router()

router.use(protect)

router.get("/login-activity", getLoginActivity)
router.get("/audit-logs", getAuditLogs)
router.get("/permissions", getPermissions)
router.patch("/permissions/users/:userId/role", updateUserRole)

export default router
