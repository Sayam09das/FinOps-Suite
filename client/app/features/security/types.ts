export type LoginEventStatus = "success" | "failed"
export type LoginDeviceType = "desktop" | "mobile" | "tablet"
export type AuditActionType = "Create" | "Update" | "Delete"
export type AppRole = "ADMIN" | "USER"
export type PermissionAction = "Create" | "Edit" | "Delete"

export interface LoginActivitySummary {
  totalLogins7d: number
  lastLoginTime: string | null
  suspiciousAttempts: number
}

export interface LoginSession {
  id: string
  dateTime: string
  device: string
  deviceType: LoginDeviceType
  browser: string
  os: string
  location: string
  country: string
  ipAddress: string
  status: LoginEventStatus
  isUnknownDevice: boolean
  sessionToken?: string
  lastActive?: string
}

export interface LoginActivityDashboardData {
  summary: LoginActivitySummary
  sessions: LoginSession[]
}

export interface AuditLog {
  id: string
  action: string
  actionType: AuditActionType
  user: string
  userAvatar?: string
  timestamp: string
  entity: string
  entityId: string
  before?: Record<string, unknown>
  after?: Record<string, unknown>
  isCritical: boolean
}

export interface AuditLogsDashboardData {
  logs: AuditLog[]
}

export interface PermissionRole {
  id: AppRole
  name: string
  description: string
  color: string
  userCount: number
}

export interface PermissionMatrixItem {
  roleId: AppRole
  permissions: Record<PermissionAction, boolean>
}

export interface UserAssignment {
  id: string
  name: string
  email: string
  avatar: string
  roleId: AppRole
}

export interface PermissionsDashboardData {
  roles: PermissionRole[]
  permissionMatrix: PermissionMatrixItem[]
  userAssignments: UserAssignment[]
  canManageRoles: boolean
}
