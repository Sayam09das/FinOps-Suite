import prisma from "../../config/db"
import { AppError } from "../../common/errors"
import type {
  CreateExpenseGroupDTO,
  CreateInviteDTO,
  CreateSharedAccountDTO,
  MemberRole,
} from "./collaboration.types"

const DEFAULT_CURRENCY = "INR"
const DEFAULT_SHARED_COLOR = "#3b82f6"
const DEFAULT_GROUP_COLOR = "#3b82f6"

const mapInvite = (invite: any) => ({
  id: invite.id,
  email: invite.email,
  role: invite.role,
  status: invite.status,
  sentAt: invite.sentAt.toISOString(),
  expiresAt: invite.expiresAt.toISOString(),
})

const mapTeamMember = (member: any) => ({
  id: member.id,
  name: member.name,
  email: member.email,
  role: member.role,
  joinedAt: member.joinedAt.toISOString(),
  status: member.status,
})

const mapSharedAccount = (account: any) => ({
  id: account.id,
  name: account.name,
  description: account.description,
  totalBalance: account.totalBalance,
  currency: account.currency,
  createdAt: account.createdAt.toISOString(),
  color: account.color,
  members: (account.members || []).map((member: any) => ({
    id: member.id,
    name: member.name,
    email: member.email,
    role: member.role,
    joinedAt: member.joinedAt.toISOString(),
  })),
  activities: (account.activities || []).map((activity: any) => ({
    id: activity.id,
    userId: undefined,
    userName: activity.userName,
    action: activity.action,
    amount: activity.amount ?? undefined,
    description: activity.description,
    timestamp: activity.timestamp.toISOString(),
  })),
})

const mapExpenseGroup = (group: any) => ({
  id: group.id,
  name: group.name,
  description: group.description,
  color: group.color,
  createdAt: group.createdAt.toISOString(),
  members: (group.members || []).map((member: any) => ({
    id: member.id,
    name: member.name,
    email: member.email,
  })),
  expenses: (group.expenses || []).map((expense: any) => ({
    id: expense.id,
    description: expense.description,
    amount: expense.amount,
    currency: expense.currency,
    paidBy: expense.paidBy,
    splitType: expense.splitType,
    tags: expense.tags,
    date: expense.date.toISOString().slice(0, 10),
    createdAt: expense.createdAt.toISOString(),
    splits: (expense.splits || []).map((split: any) => ({
      userId: split.userId,
      amount: split.amount,
    })),
  })),
})

async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  })

  if (!user) {
    throw new AppError("NOT_FOUND", 404, "User not found")
  }

  return user
}

export const collaborationRepository = {
  async getInviteUsersDashboard(userId: string) {
    const [invites, storedMembers, user] = await Promise.all([
      prisma.teamInvite.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.teamMember.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
      getUserProfile(userId),
    ])

    const ownerMember = {
      id: user.id,
      name: user.name || "You",
      email: user.email,
      role: "Owner" as const,
      joinedAt: user.createdAt.toISOString(),
      status: "active" as const,
    }

    return {
      invites: invites.map(mapInvite),
      members: [ownerMember, ...storedMembers.map(mapTeamMember)],
    }
  },

  async createInvite(userId: string, data: CreateInviteDTO) {
    const invite = await prisma.teamInvite.create({
      data: {
        userId,
        email: data.email.trim().toLowerCase(),
        role: data.role,
        status: "pending",
        sentAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    return mapInvite(invite)
  },

  async resendInvite(userId: string, inviteId: string) {
    const invite = await prisma.teamInvite.findFirst({
      where: { id: inviteId, userId },
    })

    if (!invite) {
      throw new AppError("NOT_FOUND", 404, "Invite not found")
    }

    const updated = await prisma.teamInvite.update({
      where: { id: inviteId },
      data: {
        status: "pending",
        sentAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    return mapInvite(updated)
  },

  async cancelInvite(userId: string, inviteId: string) {
    const invite = await prisma.teamInvite.findFirst({
      where: { id: inviteId, userId },
    })

    if (!invite) {
      throw new AppError("NOT_FOUND", 404, "Invite not found")
    }

    await prisma.teamInvite.delete({
      where: { id: inviteId },
    })
  },

  async updateTeamMemberRole(userId: string, memberId: string, role: MemberRole) {
    const member = await prisma.teamMember.findFirst({
      where: { id: memberId, userId },
    })

    if (!member) {
      throw new AppError("NOT_FOUND", 404, "Team member not found")
    }

    return mapTeamMember(await prisma.teamMember.update({
      where: { id: memberId },
      data: { role },
    }))
  },

  async removeTeamMember(userId: string, memberId: string) {
    const member = await prisma.teamMember.findFirst({
      where: { id: memberId, userId },
    })

    if (!member) {
      throw new AppError("NOT_FOUND", 404, "Team member not found")
    }

    await prisma.teamMember.delete({
      where: { id: memberId },
    })
  },

  async getSharedAccountsDashboard(userId: string) {
    const accounts = await prisma.sharedAccount.findMany({
      where: { userId },
      include: {
        members: {
          orderBy: { createdAt: "asc" },
        },
        activities: {
          orderBy: { timestamp: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return {
      accounts: accounts.map(mapSharedAccount),
    }
  },

  async createSharedAccount(userId: string, data: CreateSharedAccountDTO) {
    const user = await getUserProfile(userId)

    const account = await prisma.sharedAccount.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
        currency: data.currency || DEFAULT_CURRENCY,
        color: data.color || DEFAULT_SHARED_COLOR,
        members: {
          create: {
            name: user.name || "You",
            email: user.email,
            role: "Owner",
          },
        },
        activities: {
          create: {
            userName: user.name || "You",
            action: "created",
            description: "created the account",
          },
        },
      },
      include: {
        members: { orderBy: { createdAt: "asc" } },
        activities: { orderBy: { timestamp: "desc" } },
      },
    })

    return mapSharedAccount(account)
  },

  async updateSharedAccountMemberRole(userId: string, accountId: string, memberId: string, role: MemberRole) {
    const account = await prisma.sharedAccount.findFirst({
      where: { id: accountId, userId },
    })

    if (!account) {
      throw new AppError("NOT_FOUND", 404, "Shared account not found")
    }

    const member = await prisma.sharedAccountMember.findFirst({
      where: { id: memberId, sharedAccountId: accountId },
    })

    if (!member) {
      throw new AppError("NOT_FOUND", 404, "Account member not found")
    }

    await prisma.sharedAccountMember.update({
      where: { id: memberId },
      data: { role },
    })

    return this.getSharedAccountsDashboard(userId)
  },

  async removeSharedAccountMember(userId: string, accountId: string, memberId: string) {
    const account = await prisma.sharedAccount.findFirst({
      where: { id: accountId, userId },
    })

    if (!account) {
      throw new AppError("NOT_FOUND", 404, "Shared account not found")
    }

    await prisma.sharedAccountMember.delete({
      where: { id: memberId },
    })

    return this.getSharedAccountsDashboard(userId)
  },

  async leaveSharedAccount(userId: string, accountId: string) {
    const account = await prisma.sharedAccount.findFirst({
      where: { id: accountId, userId },
      include: {
        members: true,
      },
    })

    if (!account) {
      throw new AppError("NOT_FOUND", 404, "Shared account not found")
    }

    const user = await getUserProfile(userId)
    const ownedMember = account.members.find((member) => member.email === user.email && member.role === "Owner")
    if (ownedMember) {
      throw new AppError("BAD_REQUEST", 400, "Owner cannot leave the account")
    }

    const membership = account.members.find((member) => member.email === user.email)
    if (!membership) {
      throw new AppError("NOT_FOUND", 404, "Membership not found")
    }

    await prisma.sharedAccountMember.delete({
      where: { id: membership.id },
    })

    return this.getSharedAccountsDashboard(userId)
  },

  async getExpenseGroupsDashboard(userId: string) {
    const groups = await prisma.expenseGroup.findMany({
      where: { userId },
      include: {
        members: {
          orderBy: { createdAt: "asc" },
        },
        expenses: {
          include: {
            splits: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return {
      groups: groups.map(mapExpenseGroup),
    }
  },

  async createExpenseGroup(userId: string, data: CreateExpenseGroupDTO) {
    const user = await getUserProfile(userId)

    const group = await prisma.expenseGroup.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
        color: data.color || DEFAULT_GROUP_COLOR,
        members: {
          create: {
            name: user.name || "You",
            email: user.email,
          },
        },
      },
      include: {
        members: { orderBy: { createdAt: "asc" } },
        expenses: {
          include: { splits: true },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    return mapExpenseGroup(group)
  },
}

export default collaborationRepository
