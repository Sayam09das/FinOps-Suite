import type { Request } from "express"
import prisma from "../../config/db"
import { AppError } from "../../common/errors"
import type {
  AuditLogRecord,
  CreateAuditLogInput,
  LoginActivitySummary,
  LoginSessionRecord,
  RecordLoginAttemptInput,
  SecurityAuditActionType,
  SecurityDeviceType,
  SecurityPermissionsDashboard,
  UpdateUserRoleInput,
} from "./security.types"
import type { AppUserRole } from "../user/user.types"

const ROLE_META: Record<AppUserRole, { name: string; description: string; color: string }> = {
  ADMIN: {
    name: "Admin",
    description: "Full access to users, security settings, and all finance data.",
    color: "#10B981",
  },
  USER: {
    name: "User",
    description: "Can create and edit day-to-day finance data, but cannot manage other users.",
    color: "#3B82F6",
  },
}

const PERMISSION_MATRIX = {
  ADMIN: { Create: true, Edit: true, Delete: true },
  USER: { Create: true, Edit: true, Delete: false },
} as const

function isAppRole(role: string): role is AppUserRole {
  return role === "ADMIN" || role === "USER"
}

function getAvatar(name: string, email: string) {
  const source = name.trim() || email.trim()
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

function parseJsonField(value?: string | null) {
  if (!value) {
    return undefined
  }

  try {
    return JSON.parse(value) as Record<string, unknown>
  } catch {
    return undefined
  }
}

function getHeaderValue(req: Request, name: string) {
  const value = req.headers[name]
  return Array.isArray(value) ? value[0] : value
}

function parseDeviceType(userAgent: string): SecurityDeviceType {
  const lower = userAgent.toLowerCase()
  if (lower.includes("ipad") || lower.includes("tablet")) {
    return "tablet"
  }
  if (
    lower.includes("iphone") ||
    lower.includes("android") ||
    lower.includes("mobile")
  ) {
    return "mobile"
  }
  return "desktop"
}

function parseBrowser(userAgent: string) {
  if (/edg/i.test(userAgent)) return "Edge"
  if (/chrome/i.test(userAgent) && !/edg/i.test(userAgent)) return "Chrome"
  if (/firefox/i.test(userAgent)) return "Firefox"
  if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return "Safari"
  return "Unknown Browser"
}

function parseOs(userAgent: string) {
  if (/windows/i.test(userAgent)) return "Windows"
  if (/android/i.test(userAgent)) return "Android"
  if (/iphone|ipad|ios/i.test(userAgent)) return "iOS"
  if (/mac os|macintosh/i.test(userAgent)) return "macOS"
  if (/linux/i.test(userAgent)) return "Linux"
  return "Unknown OS"
}

function getClientIp(req: Request) {
  const forwarded = getHeaderValue(req, "x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "Unknown"
  }

  const realIp = getHeaderValue(req, "x-real-ip")
  return realIp || req.ip || "Unknown"
}

function getLocationDetails(req: Request) {
  const city =
    getHeaderValue(req, "x-vercel-ip-city") ||
    getHeaderValue(req, "x-city") ||
    "Unknown"
  const country =
    getHeaderValue(req, "x-vercel-ip-country") ||
    getHeaderValue(req, "cf-ipcountry") ||
    "Unknown"

  return { city, country }
}

function buildDeviceContext(req: Request) {
  const userAgent = getHeaderValue(req, "user-agent") || ""
  const browser = parseBrowser(userAgent)
  const os = parseOs(userAgent)
  const deviceType = parseDeviceType(userAgent)

  return {
    device: `${browser} on ${os}`,
    deviceType,
    browser,
    os,
    ipAddress: getClientIp(req),
    ...getLocationDetails(req),
  }
}

function mapLoginEvent(event: any): LoginSessionRecord {
  return {
    id: event.id,
    dateTime: event.createdAt.toISOString(),
    device: event.device,
    deviceType: event.deviceType,
    browser: event.browser,
    os: event.os,
    location: event.location,
    country: event.country,
    ipAddress: event.ipAddress,
    status: event.status,
    isUnknownDevice: event.isUnknownDevice,
    sessionToken: event.sessionToken ?? undefined,
    lastActive: event.lastActive?.toISOString(),
  }
}

function mapAuditLog(log: any): AuditLogRecord {
  return {
    id: log.id,
    action: log.action,
    actionType: log.actionType as SecurityAuditActionType,
    user: log.userName,
    userAvatar: getAvatar(log.userName, log.userEmail),
    timestamp: log.timestamp.toISOString(),
    entity: log.entity,
    entityId: log.entityId,
    before: parseJsonField(log.beforeJson),
    after: parseJsonField(log.afterJson),
    isCritical: Boolean(log.isCritical),
  }
}

export const securityRepository = {
  async recordLoginAttempt({
    request,
    email,
    status,
    user,
    sessionToken,
  }: RecordLoginAttemptInput) {
    const normalizedEmail = email.trim().toLowerCase()
    const context = buildDeviceContext(request)

    const priorKnownSuccessCount = await prisma.securityLoginEvent.count({
      where: {
        email: normalizedEmail,
        status: "success",
        browser: context.browser,
        os: context.os,
        deviceType: context.deviceType,
      },
    })

    const priorSuccessTotal = await prisma.securityLoginEvent.count({
      where: {
        email: normalizedEmail,
        status: "success",
      },
    })

    const isUnknownDevice = priorSuccessTotal > 0 && priorKnownSuccessCount === 0

    const event = await prisma.securityLoginEvent.create({
      data: {
        userId: user?.id,
        email: normalizedEmail,
        status,
        device: context.device,
        deviceType: context.deviceType,
        browser: context.browser,
        os: context.os,
        location: context.city,
        country: context.country,
        ipAddress: context.ipAddress,
        isUnknownDevice,
        sessionToken: sessionToken ? sessionToken.slice(-12) : undefined,
        lastActive: status === "success" ? new Date() : undefined,
      },
    })

    await this.createAuditLog({
      userId: user?.id,
      userName: user?.name || normalizedEmail,
      userEmail: normalizedEmail,
      action: status === "success" ? "User logged in" : "Failed login attempt",
      actionType: status === "success" ? "Create" : "Delete",
      entity: "Authentication",
      entityId: event.id,
      after:
        status === "success"
          ? {
              device: context.device,
              ipAddress: context.ipAddress,
            }
          : undefined,
      before:
        status === "failed"
          ? {
              device: context.device,
              ipAddress: context.ipAddress,
            }
          : undefined,
      isCritical: status === "failed" || isUnknownDevice,
    })
  },

  async createAuditLog(input: CreateAuditLogInput) {
    return prisma.securityAuditLog.create({
      data: {
        userId: input.userId ?? undefined,
        userName: input.userName,
        userEmail: input.userEmail,
        action: input.action,
        actionType: input.actionType,
        entity: input.entity,
        entityId: input.entityId,
        beforeJson: input.before ? JSON.stringify(input.before) : undefined,
        afterJson: input.after ? JSON.stringify(input.after) : undefined,
        isCritical: Boolean(input.isCritical),
      },
    })
  },

  async getLoginActivity(userId: string) {
    const [recentLogins, lastLogin] = await Promise.all([
      prisma.securityLoginEvent.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
      prisma.securityLoginEvent.findFirst({
        where: { userId, status: "success" },
        orderBy: { createdAt: "desc" },
      }),
    ])

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const summary: LoginActivitySummary = {
      totalLogins7d: recentLogins.filter(
        (event) => event.status === "success" && event.createdAt >= sevenDaysAgo,
      ).length,
      lastLoginTime: lastLogin?.createdAt.toISOString() ?? null,
      suspiciousAttempts: recentLogins.filter(
        (event) => event.status === "failed" || event.isUnknownDevice,
      ).length,
    }

    return {
      summary,
      sessions: recentLogins.map(mapLoginEvent),
    }
  },

  async getAuditLogs(userId: string, role: AppUserRole) {
    const logs = await prisma.securityAuditLog.findMany({
      where: role === "ADMIN" ? undefined : { userId },
      orderBy: { timestamp: "desc" },
      take: 100,
    })

    return {
      logs: logs.map(mapAuditLog),
    }
  },

  async getPermissionsDashboard(currentUserId: string, role: AppUserRole): Promise<SecurityPermissionsDashboard> {
    const users = await prisma.user.findMany({
      where: role === "ADMIN" ? undefined : { id: currentUserId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    const counts = users.reduce<Record<AppUserRole, number>>(
      (acc, user) => {
        acc[user.role] += 1
        return acc
      },
      { ADMIN: 0, USER: 0 },
    )

    return {
      roles: (Object.keys(ROLE_META) as AppUserRole[]).map((roleId) => ({
        id: roleId,
        name: ROLE_META[roleId].name,
        description: ROLE_META[roleId].description,
        color: ROLE_META[roleId].color,
        userCount: counts[roleId],
      })),
      permissionMatrix: (Object.keys(PERMISSION_MATRIX) as AppUserRole[]).map((roleId) => ({
        roleId,
        permissions: { ...PERMISSION_MATRIX[roleId] },
      })),
      userAssignments: users.map((user) => ({
        id: user.id,
        name: user.name || "Unnamed User",
        email: user.email,
        avatar: getAvatar(user.name || "", user.email),
        roleId: user.role,
      })),
      canManageRoles: role === "ADMIN",
    }
  },

  async updateUserRole(currentUserId: string, currentUserRole: AppUserRole, input: UpdateUserRoleInput) {
    if (currentUserRole !== "ADMIN") {
      throw new AppError("FORBIDDEN", 403, "Only admins can update roles")
    }

    if (!isAppRole(input.role)) {
      throw new AppError("BAD_REQUEST", 400, "Invalid role")
    }

    if (currentUserId === input.targetUserId) {
      throw new AppError("BAD_REQUEST", 400, "You cannot change your own role here")
    }

    const target = await prisma.user.findUnique({
      where: { id: input.targetUserId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    if (!target) {
      throw new AppError("NOT_FOUND", 404, "User not found")
    }

    const updated = await prisma.user.update({
      where: { id: input.targetUserId },
      data: { role: input.role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    const actor = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    await this.createAuditLog({
      userId: actor?.id,
      userName: actor?.name || actor?.email || "Admin",
      userEmail: actor?.email || "unknown@local",
      action: "User role changed",
      actionType: "Update",
      entity: "User",
      entityId: updated.id,
      before: { role: target.role },
      after: { role: updated.role, email: updated.email },
      isCritical: true,
    })

    return updated
  },
}

export default securityRepository
