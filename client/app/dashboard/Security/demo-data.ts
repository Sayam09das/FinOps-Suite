// ==================== Login Activity Types & Data ====================

export interface LoginSession {
  id: string
  dateTime: string
  device: string
  deviceType: "desktop" | "mobile" | "tablet"
  browser: string
  os: string
  location: string
  country: string
  ipAddress: string
  status: "success" | "failed"
  isUnknownDevice?: boolean
  sessionToken?: string
  lastActive?: string
}

export interface LoginActivitySummary {
  totalLogins7d: number
  lastLoginTime: string
  suspiciousAttempts: number
}

export const demoLoginSummary: LoginActivitySummary = {
  totalLogins7d: 24,
  lastLoginTime: "2025-06-15T09:42:00Z",
  suspiciousAttempts: 2,
}

export const demoLoginSessions: LoginSession[] = [
  {
    id: "s1",
    dateTime: "2025-06-15T09:42:00Z",
    device: "Chrome on MacBook Pro",
    deviceType: "desktop",
    browser: "Chrome 125",
    os: "macOS Sonoma",
    location: "Mumbai",
    country: "India",
    ipAddress: "103.21.45.112",
    status: "success",
    isUnknownDevice: false,
    sessionToken: "sess_live_abc123",
    lastActive: "2025-06-15T09:42:00Z",
  },
  {
    id: "s2",
    dateTime: "2025-06-14T18:30:00Z",
    device: "Safari on iPhone 15",
    deviceType: "mobile",
    browser: "Safari 17",
    os: "iOS 17.5",
    location: "Mumbai",
    country: "India",
    ipAddress: "103.21.45.88",
    status: "success",
    isUnknownDevice: false,
    sessionToken: "sess_live_def456",
    lastActive: "2025-06-14T19:15:00Z",
  },
  {
    id: "s3",
    dateTime: "2025-06-14T03:12:00Z",
    device: "Firefox on Windows",
    deviceType: "desktop",
    browser: "Firefox 127",
    os: "Windows 11",
    location: "Unknown",
    country: "Unknown",
    ipAddress: "185.220.101.45",
    status: "failed",
    isUnknownDevice: true,
    sessionToken: undefined,
    lastActive: undefined,
  },
  {
    id: "s4",
    dateTime: "2025-06-13T14:20:00Z",
    device: "Chrome on Windows",
    deviceType: "desktop",
    browser: "Chrome 124",
    os: "Windows 10",
    location: "Bangalore",
    country: "India",
    ipAddress: "106.51.72.190",
    status: "success",
    isUnknownDevice: true,
    sessionToken: "sess_live_ghi789",
    lastActive: "2025-06-13T16:45:00Z",
  },
  {
    id: "s5",
    dateTime: "2025-06-12T22:05:00Z",
    device: "Edge on Surface Pro",
    deviceType: "tablet",
    browser: "Edge 124",
    os: "Windows 11",
    location: "Delhi",
    country: "India",
    ipAddress: "117.99.34.21",
    status: "failed",
    isUnknownDevice: false,
    sessionToken: undefined,
    lastActive: undefined,
  },
  {
    id: "s6",
    dateTime: "2025-06-12T08:15:00Z",
    device: "Chrome on Android",
    deviceType: "mobile",
    browser: "Chrome 124",
    os: "Android 14",
    location: "Pune",
    country: "India",
    ipAddress: "103.48.67.155",
    status: "success",
    isUnknownDevice: false,
    sessionToken: "sess_live_jkl012",
    lastActive: "2025-06-12T08:45:00Z",
  },
  {
    id: "s7",
    dateTime: "2025-06-11T11:30:00Z",
    device: "Safari on iPad",
    deviceType: "tablet",
    browser: "Safari 17",
    os: "iPadOS 17.5",
    location: "Hyderabad",
    country: "India",
    ipAddress: "183.82.14.78",
    status: "success",
    isUnknownDevice: false,
    sessionToken: "sess_live_mno345",
    lastActive: "2025-06-11T12:00:00Z",
  },
]

// ==================== Audit Logs Types & Data ====================

export type AuditAction = "Create" | "Update" | "Delete"

export interface AuditLog {
  id: string
  action: string
  actionType: AuditAction
  user: string
  userAvatar?: string
  timestamp: string
  entity: string
  entityId: string
  before?: Record<string, unknown>
  after?: Record<string, unknown>
  isCritical?: boolean
}

export const demoAuditLogs: AuditLog[] = [
  {
    id: "a1",
    action: "Transaction Deleted",
    actionType: "Delete",
    user: "Rahul Sharma",
    userAvatar: "RS",
    timestamp: "2025-06-15T10:30:00Z",
    entity: "Transaction",
    entityId: "txn_8842",
    before: { amount: 5000, category: "Food", description: "Dinner at Taj" },
    after: undefined,
    isCritical: true,
  },
  {
    id: "a2",
    action: "Budget Updated",
    actionType: "Update",
    user: "Priya Patel",
    userAvatar: "PP",
    timestamp: "2025-06-14T16:45:00Z",
    entity: "Budget",
    entityId: "bud_2219",
    before: { limit: 25000, category: "Shopping" },
    after: { limit: 30000, category: "Shopping" },
    isCritical: false,
  },
  {
    id: "a3",
    action: "Account Created",
    actionType: "Create",
    user: "Admin System",
    userAvatar: "AS",
    timestamp: "2025-06-14T09:00:00Z",
    entity: "Bank Account",
    entityId: "acc_5512",
    before: undefined,
    after: { name: "HDFC Savings", type: "Savings", balance: 0 },
    isCritical: false,
  },
  {
    id: "a4",
    action: "User Role Changed",
    actionType: "Update",
    user: "Rahul Sharma",
    userAvatar: "RS",
    timestamp: "2025-06-13T14:20:00Z",
    entity: "User",
    entityId: "usr_3381",
    before: { role: "Viewer", permissions: ["read"] },
    after: { role: "Editor", permissions: ["read", "write"] },
    isCritical: true,
  },
  {
    id: "a5",
    action: "Savings Goal Deleted",
    actionType: "Delete",
    user: "Priya Patel",
    userAvatar: "PP",
    timestamp: "2025-06-12T11:10:00Z",
    entity: "Savings Goal",
    entityId: "goal_9921",
    before: { name: "Emergency Fund", target: 100000, current: 45000 },
    after: undefined,
    isCritical: false,
  },
  {
    id: "a6",
    action: "Category Created",
    actionType: "Create",
    user: "Rahul Sharma",
    userAvatar: "RS",
    timestamp: "2025-06-11T08:30:00Z",
    entity: "Category",
    entityId: "cat_7721",
    before: undefined,
    after: { name: "Pet Care", color: "#F59E0B", icon: "Dog" },
    isCritical: false,
  },
  {
    id: "a7",
    action: "Credit Card Updated",
    actionType: "Update",
    user: "Admin System",
    userAvatar: "AS",
    timestamp: "2025-06-10T17:00:00Z",
    entity: "Credit Card",
    entityId: "cc_1102",
    before: { limit: 150000, statementDate: "5th" },
    after: { limit: 200000, statementDate: "10th" },
    isCritical: true,
  },
]

// ==================== Permissions Types & Data ====================

export type PermissionAction = "Create" | "Edit" | "Delete"

export interface Role {
  id: string
  name: string
  description: string
  color: string
  userCount: number
}

export interface PermissionMatrix {
  roleId: string
  permissions: Record<PermissionAction, boolean>
}

export interface UserAssignment {
  id: string
  name: string
  email: string
  avatar: string
  roleId: string
}

export const demoRoles: Role[] = [
  {
    id: "admin",
    name: "Admin",
    description: "Full system access. Can manage users, settings, and all data.",
    color: "#10B981",
    userCount: 2,
  },
  {
    id: "editor",
    name: "Editor",
    description: "Can create and modify data. Cannot delete or manage users.",
    color: "#3B82F6",
    userCount: 4,
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Read-only access. Can view reports and dashboards only.",
    color: "#F59E0B",
    userCount: 6,
  },
]

export const demoPermissionMatrix: PermissionMatrix[] = [
  { roleId: "admin", permissions: { Create: true, Edit: true, Delete: true } },
  { roleId: "editor", permissions: { Create: true, Edit: true, Delete: false } },
  { roleId: "viewer", permissions: { Create: false, Edit: false, Delete: false } },
]

export const demoUserAssignments: UserAssignment[] = [
  { id: "u1", name: "Rahul Sharma", email: "rahul@example.com", avatar: "RS", roleId: "admin" },
  { id: "u2", name: "Priya Patel", email: "priya@example.com", avatar: "PP", roleId: "admin" },
  { id: "u3", name: "Amit Kumar", email: "amit@example.com", avatar: "AK", roleId: "editor" },
  { id: "u4", name: "Sneha Gupta", email: "sneha@example.com", avatar: "SG", roleId: "editor" },
  { id: "u5", name: "Vikram Rao", email: "vikram@example.com", avatar: "VR", roleId: "viewer" },
  { id: "u6", name: "Neha Iyer", email: "neha@example.com", avatar: "NI", roleId: "viewer" },
]

