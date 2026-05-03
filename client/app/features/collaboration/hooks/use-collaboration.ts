"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { collaborationApi } from "../api"
import type { MemberRole } from "@/app/dashboard/collaboration/types"

const REFRESH_INTERVAL = 5000

export const collaborationKeys = {
  all: ["collaboration"] as const,
  inviteUsers: () => [...collaborationKeys.all, "invite-users"] as const,
  sharedAccounts: () => [...collaborationKeys.all, "shared-accounts"] as const,
  groupExpenses: () => [...collaborationKeys.all, "group-expenses"] as const,
}

export function useInviteUsersDashboard() {
  return useQuery({
    queryKey: collaborationKeys.inviteUsers(),
    queryFn: collaborationApi.getInviteUsers,
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 0,
  })
}

export function useCreateInvite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: collaborationApi.createInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collaborationKeys.inviteUsers() })
    },
  })
}

export function useResendInvite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: collaborationApi.resendInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collaborationKeys.inviteUsers() })
    },
  })
}

export function useCancelInvite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: collaborationApi.cancelInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collaborationKeys.inviteUsers() })
    },
  })
}

export function useUpdateTeamMemberRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: MemberRole }) => collaborationApi.updateMemberRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collaborationKeys.inviteUsers() })
    },
  })
}

export function useRemoveTeamMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: collaborationApi.removeMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collaborationKeys.inviteUsers() })
    },
  })
}

export function useSharedAccountsDashboard() {
  return useQuery({
    queryKey: collaborationKeys.sharedAccounts(),
    queryFn: collaborationApi.getSharedAccounts,
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 0,
  })
}

export function useCreateSharedAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: collaborationApi.createSharedAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collaborationKeys.sharedAccounts() })
    },
  })
}

export function useUpdateSharedAccountMemberRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ accountId, memberId, role }: { accountId: string; memberId: string; role: MemberRole }) =>
      collaborationApi.updateSharedAccountMemberRole(accountId, memberId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collaborationKeys.sharedAccounts() })
    },
  })
}

export function useRemoveSharedAccountMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ accountId, memberId }: { accountId: string; memberId: string }) =>
      collaborationApi.removeSharedAccountMember(accountId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collaborationKeys.sharedAccounts() })
    },
  })
}

export function useLeaveSharedAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: collaborationApi.leaveSharedAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collaborationKeys.sharedAccounts() })
    },
  })
}

export function useGroupExpensesDashboard() {
  return useQuery({
    queryKey: collaborationKeys.groupExpenses(),
    queryFn: collaborationApi.getGroupExpenses,
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 0,
  })
}

export function useCreateExpenseGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: collaborationApi.createGroupExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collaborationKeys.groupExpenses() })
    },
  })
}
