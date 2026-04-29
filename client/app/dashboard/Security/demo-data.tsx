import type { LucideIcon } from "lucide-react"

export type PermissionAction = "Create" | "Edit" | "Delete"

export type Role = {
  id: string
  name: string
  description: string
  color: string
  userCount: number
}

export const demoRoles: Role[] = [
  {
    id: "admin",
    name: "Admin",
    description: "Full access to all features and settings",
    color: "#10b981",
    userCount: 2,
  },
  {
    id: "editor",
    name: "Editor",
    description: "Manage transactions, budgets, and reports",
    color: "#3b82f6",
    userCount: 5,
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "View-only access to dashboard and reports",
    color: "#f59e0b",
    userCount: 8,
  },
]

export type PermissionMatrixItem = {
  roleId: string
  permissions: Record<PermissionAction, boolean>
}

export const demoPermissionMatrix: PermissionMatrixItem[] = [
  {
    roleId: "admin",
    permissions: {
      Create: true,
      Edit: true,
      Delete: true,
    },
  },
  {
    roleId: "editor",
    permissions: {
      Create: true,
      Edit: true,
      Delete: false,
    },
  },
  {
    roleId: "viewer",
    permissions: {
      Create: false,
      Edit: false,
      Delete: false,
    },
  },
]

export const demoUserAssignments = [
  {
    id: "1",
    name: "John Doe",
    email: "john@finops.com",
    avatar: "JD",
    roleId: "admin",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@finops.com",
    avatar: "JS",
    roleId: "editor",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@finops.com",
    avatar: "BJ",
    roleId: "viewer",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@finops.com",
    avatar: "AB",
    roleId: "editor",
  },
  {
    id: "5",
    name: "Charlie Wilson",
    email: "charlie@finops.com",
    avatar: "CW",
    roleId: "viewer",
  },
]

