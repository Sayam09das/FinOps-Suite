"use client"

import { api } from "@/app/lib/api/client"
import { ENDPOINTS } from "@/app/lib/api/endpoints"
import type { ExpenseGroup, Invite, MemberRole, SharedAccount, TeamMember } from "@/app/dashboard/collaboration/types"

export interface InviteUsersDashboardData {
  invites: Invite[]
  members: TeamMember[]
}

export interface SharedAccountsDashboardData {
  accounts: SharedAccount[]
}

export interface GroupExpensesDashboardData {
  groups: ExpenseGroup[]
}

export const collaborationApi = {
  getInviteUsers: () => api.get<InviteUsersDashboardData>(ENDPOINTS.COLLABORATION.INVITE_USERS),
  createInvite: (data: { email: string; role: Exclude<MemberRole, "Owner"> }) =>
    api.post<Invite>(ENDPOINTS.COLLABORATION.INVITES, data),
  resendInvite: (id: string) => api.post<Invite>(ENDPOINTS.COLLABORATION.INVITE_RESEND(id)),
  cancelInvite: (id: string) => api.del(ENDPOINTS.COLLABORATION.INVITE_CANCEL(id)),
  updateMemberRole: (id: string, role: MemberRole) =>
    api.patch<TeamMember>(ENDPOINTS.COLLABORATION.MEMBER_ROLE(id), { role }),
  removeMember: (id: string) => api.del(ENDPOINTS.COLLABORATION.MEMBER_REMOVE(id)),

  getSharedAccounts: () => api.get<SharedAccountsDashboardData>(ENDPOINTS.COLLABORATION.SHARED_ACCOUNTS),
  createSharedAccount: (data: { name: string; description: string; color?: string; currency?: string }) =>
    api.post<SharedAccount>(ENDPOINTS.COLLABORATION.SHARED_ACCOUNTS, data),
  updateSharedAccountMemberRole: (accountId: string, memberId: string, role: MemberRole) =>
    api.patch<SharedAccountsDashboardData>(ENDPOINTS.COLLABORATION.SHARED_ACCOUNT_MEMBER_ROLE(accountId, memberId), { role }),
  removeSharedAccountMember: (accountId: string, memberId: string) =>
    api.del<SharedAccountsDashboardData>(ENDPOINTS.COLLABORATION.SHARED_ACCOUNT_MEMBER_REMOVE(accountId, memberId)),
  leaveSharedAccount: (accountId: string) =>
    api.post<SharedAccountsDashboardData>(ENDPOINTS.COLLABORATION.SHARED_ACCOUNT_LEAVE(accountId)),

  getGroupExpenses: () => api.get<GroupExpensesDashboardData>(ENDPOINTS.COLLABORATION.GROUP_EXPENSES),
  createGroupExpense: (data: { name: string; description: string; color?: string }) =>
    api.post<ExpenseGroup>(ENDPOINTS.COLLABORATION.GROUP_EXPENSES, data),
}
