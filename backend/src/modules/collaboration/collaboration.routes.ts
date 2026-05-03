import { Router } from "express"
import { protect } from "../../common/middleware/auth.middleware"
import {
  cancelInvite,
  createExpenseGroup,
  createInvite,
  createSharedAccount,
  getExpenseGroupsDashboard,
  getInviteUsersDashboard,
  getSharedAccountsDashboard,
  leaveSharedAccount,
  removeSharedAccountMember,
  removeTeamMember,
  resendInvite,
  updateSharedAccountMemberRole,
  updateTeamMemberRole,
} from "./collaboration.controller"

const router = Router()

router.use(protect)

router.get("/invite-users", getInviteUsersDashboard)
router.post("/invite-users/invites", createInvite)
router.post("/invite-users/invites/:id/resend", resendInvite)
router.delete("/invite-users/invites/:id", cancelInvite)
router.patch("/invite-users/members/:id/role", updateTeamMemberRole)
router.delete("/invite-users/members/:id", removeTeamMember)

router.get("/shared-accounts", getSharedAccountsDashboard)
router.post("/shared-accounts", createSharedAccount)
router.patch("/shared-accounts/:accountId/members/:memberId/role", updateSharedAccountMemberRole)
router.delete("/shared-accounts/:accountId/members/:memberId", removeSharedAccountMember)
router.post("/shared-accounts/:accountId/leave", leaveSharedAccount)

router.get("/group-expenses", getExpenseGroupsDashboard)
router.post("/group-expenses", createExpenseGroup)

export default router
