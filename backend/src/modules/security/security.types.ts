import type { Request } from "express"
import type { AppUserRole } from "../user/user.types"

export type SecurityLoginStatus = "success" | "failed"
export type SecurityDeviceType = "desktop" | "mobile" | "tablet"
export type SecurityAuditActionType = "Create" | "Update" | "Delete"
export type SecurityPermissionAction = "Create" | "Edit" | "Delete"

export type LoginActivitySummary = {
  totalLogins7d: number
  lastLoginTime: string | null
  suspiciousAttempts: number
}

export type LoginSessionRecord = {
  id: string
  dateTime: string
  device: string
  deviceType: SecurityDeviceType
  browser: string
  os: string
  location: string
  country: string
  ipAddress: string
  status: SecurityLoginStatus
  isUnknownDevice: boolean
  sessionToken?: string
  lastActive?: string
}

export type AuditLogRecord = {
  id: string
  action: string
  actionType: SecurityAuditActionType
  user: string
  userAvatar?: string
  timestamp: string
  entity: string
  entityId: string
  before?: Record<string, unknown>
  after?: Record<string, unknown>
  isCritical: boolean
}

export type PermissionRoleRecord = {
  id: AppUserRole
  name: string
  description: string
  color: string
  userCount: number
}

export type PermissionMatrixRecord = {
  roleId: AppUserRole
  permissions: Record<SecurityPermissionAction, boolean>
}

export type PermissionUserAssignmentRecord = {
  id: string
  name: string
  email: string
  avatar: string
  roleId: AppUserRole
}

export type SecurityPermissionsDashboard = {
  roles: PermissionRoleRecord[]
  permissionMatrix: PermissionMatrixRecord[]
  userAssignments: PermissionUserAssignmentRecord[]
  canManageRoles: boolean
}

export type RecordLoginAttemptInput = {
  request: Request
  email: string
  status: SecurityLoginStatus
  user?: {
    id: string
    name: string | null
    email: string
  } | null
  sessionToken?: string
}

export type CreateAuditLogInput = {
  userId?: string | null
  userName: string
  userEmail: string
  action: string
  actionType: SecurityAuditActionType
  entity: string
  entityId: string
  before?: Record<string, unknown>
  after?: Record<string, unknown>
  isCritical?: boolean
}

export type UpdateUserRoleInput = {
  targetUserId: string
  role: AppUserRole
}
