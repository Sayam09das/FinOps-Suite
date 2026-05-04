import type { Request, Response } from "express"
import { asyncHandler } from "../../common/utils/asyncHandler"
import { ApiResponse } from "../../common/utils/apiResponse"
import { securityRepository } from "./security.repository"
import type { UpdateUserRoleInput } from "./security.types"

export const getLoginActivity = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id

  if (!userId) {
    ApiResponse.error("Unauthorized", res, 401)
    return
  }

  const data = await securityRepository.getLoginActivity(userId)
  ApiResponse.success(data, res, 200, "Login activity loaded")
})

export const getAuditLogs = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id
  const role = req.user?.role

  if (!userId || !role) {
    ApiResponse.error("Unauthorized", res, 401)
    return
  }

  const data = await securityRepository.getAuditLogs(userId, role)
  ApiResponse.success(data, res, 200, "Audit logs loaded")
})

export const getPermissions = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id
  const role = req.user?.role

  if (!userId || !role) {
    ApiResponse.error("Unauthorized", res, 401)
    return
  }

  const data = await securityRepository.getPermissionsDashboard(userId, role)
  ApiResponse.success(data, res, 200, "Permissions loaded")
})

export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id
  const role = req.user?.role

  if (!userId || !role) {
    ApiResponse.error("Unauthorized", res, 401)
    return
  }

  const updated = await securityRepository.updateUserRole(userId, role, {
    targetUserId: (req.params.userId || "").toString(),
    role: ((req.body as UpdateUserRoleInput).role || "").toString() as UpdateUserRoleInput["role"],
  })

  ApiResponse.success(updated, res, 200, "User role updated")
})
