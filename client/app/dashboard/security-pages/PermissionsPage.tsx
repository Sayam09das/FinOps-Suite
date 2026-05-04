"use client"

import { motion } from "framer-motion"
import { LockKeyhole, ShieldAlert, ShieldCheck, UserCheck } from "lucide-react"

import { Badge } from "@/app/components/ui/badge"
import { Card, CardContent } from "@/app/components/ui/card"
import { useToast } from "@/app/components/ui/use-toast"
import { useSecurityPermissions, useUpdateSecurityUserRole } from "@/app/features/security"
import type { AppRole, PermissionAction } from "@/app/features/security"

const permissionActions: PermissionAction[] = ["Create", "Edit", "Delete"]

export default function PermissionsPage() {
  const { data, error, isLoading } = useSecurityPermissions()
  const updateRole = useUpdateSecurityUserRole()
  const { toast } = useToast()

  const roles = data?.roles ?? []
  const permissionMatrix = data?.permissionMatrix ?? []
  const users = data?.userAssignments ?? []
  const canManageRoles = data?.canManageRoles ?? false

  const handleRoleChange = async (userId: string, role: AppRole) => {
    await updateRole.mutateAsync({ userId, role })
    toast({
      title: "Role updated",
      description: `User access is now ${role}.`,
    })
  }

  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <div className="flex items-center gap-2">
            <LockKeyhole className="h-5 w-5 text-primary-foreground" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Permissions
            </h1>
          </div>
          <p className="mt-1 text-sm text-foreground/60">
            Real roles and assignments from your current user database.
          </p>
        </div>
        <Badge variant="accent" className="rounded-full">
          {canManageRoles ? "Live Admin Controls" : "Read Only"}
        </Badge>
      </motion.div>

      {error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Failed to load permissions: {error.message}
        </div>
      ) : null}

      {!canManageRoles ? (
        <Card variant="accent" padding="md" className="border-accent/30">
          <CardContent className="flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-accent-foreground" />
            <p className="text-sm text-accent-foreground">
              You can review permissions here, but only admins can change user roles.
            </p>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {roles.map((role) => (
          <Card key={role.id} variant="ghost" padding="lg" className="h-full">
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border"
                  style={{
                    borderColor: `${role.color}40`,
                    backgroundColor: `${role.color}18`,
                  }}
                >
                  <ShieldCheck className="h-4 w-4" style={{ color: role.color }} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{role.name}</h3>
                  <p className="text-xs text-foreground/50">{role.userCount} users</p>
                </div>
              </div>
              <p className="text-xs leading-5 text-foreground/60">{role.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card variant="ghost" padding="none" className="overflow-hidden">
        <div className="border-b border-border/60 px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">Permissions Matrix</h2>
          <p className="mt-0.5 text-xs text-foreground/50">
            This matrix now comes from the backend role policy.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-border/60 text-left">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-foreground/50">
                  Feature
                </th>
                {roles.map((role) => (
                  <th
                    key={role.id}
                    className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-foreground/50"
                  >
                    {role.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissionActions.map((action) => (
                <tr key={action} className="border-b border-border/40">
                  <td className="px-5 py-3.5 text-sm font-medium text-foreground">{action}</td>
                  {roles.map((role) => {
                    const permissions = permissionMatrix.find((item) => item.roleId === role.id)
                    const isEnabled = permissions?.permissions[action] ?? false
                    return (
                      <td key={role.id} className="px-5 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            isEnabled
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-muted text-foreground/50"
                          }`}
                        >
                          {isEnabled ? "Allowed" : "Blocked"}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card variant="ghost" padding="none" className="overflow-hidden">
        <div className="border-b border-border/60 px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">User Assignment</h2>
          <p className="mt-0.5 text-xs text-foreground/50">
            Live user records with role changes synced back to the backend.
          </p>
        </div>
        <div className="divide-y divide-border/40">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/70 bg-background/60 text-sm font-bold text-foreground/70">
                  {user.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-foreground/50">{user.email}</p>
                </div>
              </div>

              {canManageRoles ? (
                <select
                  value={user.roleId}
                  onChange={(event) => handleRoleChange(user.id, event.target.value as AppRole)}
                  disabled={updateRole.isPending}
                  className="rounded-full border border-border/80 bg-background/60 px-4 py-2 text-xs font-medium text-foreground outline-none transition focus:border-primary/50"
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/60 px-4 py-2 text-xs font-medium text-foreground">
                  <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                  {roles.find((role) => role.id === user.roleId)?.name || user.roleId}
                </div>
              )}
            </div>
          ))}
        </div>

        {!isLoading && users.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-foreground/50">
            No users are available for role assignment yet.
          </div>
        ) : null}
      </Card>
    </div>
  )
}
