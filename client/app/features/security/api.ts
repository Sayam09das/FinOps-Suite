"use client"

import { api } from "@/app/lib/api/client"
import { ENDPOINTS } from "@/app/lib/api/endpoints"
import type {
  AppRole,
  AuditLogsDashboardData,
  LoginActivityDashboardData,
  PermissionsDashboardData,
} from "./types"

export const securityApi = {
  getLoginActivity: () => api.get<LoginActivityDashboardData>(ENDPOINTS.SECURITY.LOGIN_ACTIVITY),
  getAuditLogs: () => api.get<AuditLogsDashboardData>(ENDPOINTS.SECURITY.AUDIT_LOGS),
  getPermissions: () => api.get<PermissionsDashboardData>(ENDPOINTS.SECURITY.PERMISSIONS),
  updateUserRole: (userId: string, role: AppRole) =>
    api.patch(ENDPOINTS.SECURITY.USER_ROLE(userId), { role }),
}
