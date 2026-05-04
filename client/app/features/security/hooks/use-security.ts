"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { securityApi } from "../api"
import type { AppRole } from "../types"

const REFRESH_INTERVAL = 5000

export const securityKeys = {
  all: ["security"] as const,
  loginActivity: () => [...securityKeys.all, "login-activity"] as const,
  auditLogs: () => [...securityKeys.all, "audit-logs"] as const,
  permissions: () => [...securityKeys.all, "permissions"] as const,
}

export function useSecurityLoginActivity() {
  return useQuery({
    queryKey: securityKeys.loginActivity(),
    queryFn: securityApi.getLoginActivity,
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 0,
  })
}

export function useSecurityAuditLogs() {
  return useQuery({
    queryKey: securityKeys.auditLogs(),
    queryFn: securityApi.getAuditLogs,
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 0,
  })
}

export function useSecurityPermissions() {
  return useQuery({
    queryKey: securityKeys.permissions(),
    queryFn: securityApi.getPermissions,
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 0,
  })
}

export function useUpdateSecurityUserRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: AppRole }) =>
      securityApi.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: securityKeys.permissions() })
      queryClient.invalidateQueries({ queryKey: securityKeys.auditLogs() })
    },
  })
}
