"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LockKeyhole,
  ShieldCheck,
  ShieldAlert,
  Check,
  X,
  Sparkles,
  ChevronDown,
  Crown,
  Eye,
  UserCheck,
} from "lucide-react"

import { Card, CardContent } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import {
  demoRoles,
  demoPermissionMatrix,
  demoUserAssignments,
  type PermissionAction,
  type Role,
} from "./demo-data"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
}

const tableRowVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
}

const permissionActions: PermissionAction[] = ["Create", "Edit", "Delete"]

const roleIconMap: Record<string, React.ElementType> = {
  admin: Crown,
  editor: Eye,
  viewer: Eye,
}

function getRoleById(roleId: string) {
  return demoRoles.find((r) => r.id === roleId)!
}

function UserAssignmentRow({
  user,
  index,
  onAssignRole,
}: {
  user: { id: string; name: string; email: string; avatar: string; roleId: string }
  index: number
  onAssignRole: (userId: string, roleId: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const userRole = getRoleById(user.roleId)

  return (
    <motion.div
      variants={tableRowVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.04 }}
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

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-full border border-border/80 bg-background/60 px-4 py-2 text-xs font-medium text-foreground transition hover:bg-background"
        >
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: userRole.color }}
          />
          {userRole.name}
          <ChevronDown className="h-3.5 w-3.5 text-foreground/40" />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 z-40 mt-2 w-44 overflow-hidden rounded-2xl border border-border/80 bg-background/95 p-1.5 shadow-xl backdrop-blur-xl"
              >
                {demoRoles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => {
                      onAssignRole(user.id, role.id)
                      setIsOpen(false)
                    }}
                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition ${
                      user.roleId === role.id
                        ? "bg-primary/20 text-foreground"
                        : "text-foreground/70 hover:bg-background"
                    }`}
                  >
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: role.color }}
                    />
                    {role.name}
                    {user.roleId === role.id && (
                      <UserCheck className="ml-auto h-3.5 w-3.5 text-emerald-600" />
                    )}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function PermissionsPage() {
  const [matrix, setMatrix] = useState(demoPermissionMatrix)
  const [users, setUsers] = useState(demoUserAssignments)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  const togglePermission = (roleId: string, action: PermissionAction) => {
    setMatrix((prev) =>
      prev.map((m) =>
        m.roleId === roleId
          ? { ...m, permissions: { ...m.permissions, [action]: !m.permissions[action] } }
          : m,
      ),
    )
  }

  const assignRole = (userId: string, roleId: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, roleId } : u)))
  }

  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
            Manage roles and access control across your team
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="accent" className="rounded-full">
            <Sparkles className="mr-1 h-3 w-3" />
            Pro
          </Badge>
        </div>
      </motion.div>

      {/* Roles List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {demoRoles.map((role) => {
          const RoleIcon = roleIconMap[role.id] || ShieldCheck
          return (
            <motion.div key={role.id} variants={itemVariants}>
              <Card
                variant="ghost"
                padding="lg"
                className="h-full cursor-pointer transition hover:-translate-y-0.5 hover:border-primary/30"
                onClick={() => setSelectedRole(role)}
              >
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-2xl border"
                      style={{
                        borderColor: `${role.color}40`,
                        backgroundColor: `${role.color}18`,
                      }}
                    >
                      <RoleIcon className="h-4 w-4" style={{ color: role.color }} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{role.name}</h3>
                      <p className="text-xs text-foreground/50">{role.userCount} users</p>
                    </div>
                  </div>
                  <p className="text-xs leading-5 text-foreground/60">{role.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Permissions Matrix */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card variant="ghost" padding="none" className="overflow-hidden">
          <div className="border-b border-border/60 px-5 py-4">
            <h2 className="text-sm font-semibold text-foreground">Permissions Matrix</h2>
            <p className="mt-0.5 text-xs text-foreground/50">
              Toggle access levels for each role
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-foreground/50">
                    Feature
                  </th>
                  {demoRoles.map((role) => (
                    <th
                      key={role.id}
                      className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-foreground/50"
                    >
                      <div className="flex items-center gap-1.5">
                        <div
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: role.color }}
                        />
                        {role.name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissionActions.map((action, idx) => (
                  <motion.tr
                    key={action}
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-border/40"
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-medium text-foreground">{action}</span>
                    </td>
                    {demoRoles.map((role) => {
                      const perm = matrix.find((m) => m.roleId === role.id)!
                      const isEnabled = perm.permissions[action]
                      return (
                        <td key={role.id} className="px-5 py-3.5">
                          <button
                            onClick={() => togglePermission(role.id, action)}
                            className={`flex h-7 w-12 items-center rounded-full border px-0.5 transition-all ${
                              isEnabled
                                ? "border-emerald-300/80 bg-emerald-50"
                                : "border-border/80 bg-background/60"
                            }`}
                          >
                            <motion.div
                              animate={{ x: isEnabled ? 18 : 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              className={`flex h-5.5 w-5.5 items-center justify-center rounded-full shadow-sm ${
                                isEnabled ? "bg-emerald-500 text-white" : "bg-white text-foreground/30"
                              }`}
                            >
                              {isEnabled ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <X className="h-3 w-3" />
                              )}
                            </motion.div>
                          </button>
                        </td>
                      )
                    })}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* User Assignment */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Card variant="ghost" padding="none" className="overflow-hidden">
          <div className="border-b border-border/60 px-5 py-4">
            <h2 className="text-sm font-semibold text-foreground">User Assignment</h2>
            <p className="mt-0.5 text-xs text-foreground/50">Assign roles to team members</p>
          </div>
          <div className="divide-y divide-border/40">
            {users.map((user, idx) => (
              <UserAssignmentRow
                key={user.id}
                user={user}
                index={idx}
                onAssignRole={assignRole}
              />
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Pro Features */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Card variant="accent" padding="lg" className="border-accent/30">
          <CardContent className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-accent/40 bg-accent/15">
                <ShieldAlert className="h-4 w-4 text-accent-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-accent-foreground">Pro Features</h3>
                <p className="mt-0.5 text-xs text-foreground/60">
                  Unlock custom roles and fine-grained permissions with a Pro plan.
                </p>
              </div>
            </div>
            <Button
              variant="accent"
              className="rounded-2xl"
              onClick={() => alert("Upgrade to Pro — coming soon")}
            >
              <Sparkles className="h-4 w-4" />
              Upgrade to Pro
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Role Details Drawer */}
      <AnimatePresence>
        {selectedRole && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedRole(null)}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-border/80 bg-background/95 p-6 shadow-2xl backdrop-blur-xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Role Details</h2>
                <button
                  onClick={() => setSelectedRole(null)}
                  className="rounded-full p-2 text-foreground/60 transition-colors hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl border text-lg font-bold"
                    style={{
                      borderColor: `${selectedRole.color}40`,
                      backgroundColor: `${selectedRole.color}18`,
                      color: selectedRole.color,
                    }}
                  >
                    {(() => {
                      const Icon = roleIconMap[selectedRole.id] || ShieldCheck
                      return <Icon className="h-6 w-6" />
                    })()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{selectedRole.name}</h3>
                    <p className="text-sm text-foreground/60">{selectedRole.userCount} users assigned</p>
                  </div>
                </div>

                <div className="rounded-xl border border-border/60 bg-background/60 px-4 py-3">
                  <p className="text-xs font-medium text-foreground/50">Description</p>
                  <p className="mt-1 text-sm text-foreground">{selectedRole.description}</p>
                </div>

                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-foreground/50">
                    Permissions
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {permissionActions.map((action) => {
                      const perm = matrix.find((m) => m.roleId === selectedRole.id)!
                      const isEnabled = perm.permissions[action]
                      return (
                        <div
                          key={action}
                          className={`flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 ${
                            isEnabled
                              ? "border-emerald-200/80 bg-emerald-50 text-emerald-700"
                              : "border-border/60 bg-background/60 text-foreground/40"
                          }`}
                        >
                          {isEnabled ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                          <span className="text-xs font-medium">{action}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-foreground/50">
                    Assigned Users
                  </p>
                  <div className="space-y-2">
                    {users
                      .filter((u) => u.roleId === selectedRole.id)
                      .map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 px-4 py-2.5"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-border/70 bg-background/60 text-xs font-bold text-foreground/70">
                            {user.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{user.name}</p>
                            <p className="text-xs text-foreground/50">{user.email}</p>
                          </div>
                        </div>
                      ))}
                    {users.filter((u) => u.roleId === selectedRole.id).length === 0 && (
                      <p className="text-sm text-foreground/50">No users assigned to this role.</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

