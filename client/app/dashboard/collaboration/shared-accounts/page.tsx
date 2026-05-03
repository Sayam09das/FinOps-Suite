"use client"

import { useState, useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"

import Header from "../shared-accounts-page/Header"
import Summary from "../shared-accounts-page/Summary"
import AccountsList from "../shared-accounts-page/AccountsList"
import Members from "../shared-accounts-page/Members"
import ActivityFeed from "../shared-accounts-page/ActivityFeed"
import CreateSharedAccountModal from "../shared-accounts-page/CreateSharedAccountModal"
import type { SharedAccount } from "../../collaboration/types"
import { useToast } from "@/app/components/ui/use-toast"
import {
  useCreateSharedAccount,
  useLeaveSharedAccount,
  useRemoveSharedAccountMember,
  useSharedAccountsDashboard,
  useUpdateSharedAccountMemberRole,
} from "@/app/features/collaboration"
import type { MemberRole } from "../../collaboration/types"

export default function SharedAccountsPage() {
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { toast } = useToast()
  const { data, error } = useSharedAccountsDashboard()
  const createSharedAccount = useCreateSharedAccount()
  const updateMemberRole = useUpdateSharedAccountMemberRole()
  const removeSharedAccountMember = useRemoveSharedAccountMember()
  const leaveSharedAccount = useLeaveSharedAccount()
  const accounts = data?.accounts ?? []

  const selectedAccount = useMemo(
    () => accounts.find((a) => a.id === selectedAccountId) || accounts[0] || null,
    [accounts, selectedAccountId]
  )

  const summaryCurrency = selectedAccount?.currency || accounts[0]?.currency || "INR"

  const totalSharedBalance = useMemo(
    () => accounts.reduce((sum, a) => sum + a.totalBalance, 0),
    [accounts]
  )

  const totalMembers = useMemo(
    () => new Set(accounts.flatMap((a) => a.members.map((m) => m.id))).size,
    [accounts]
  )

  const yourShare = useMemo(
    () => accounts.reduce((sum, a) => sum + (a.members.length > 0 ? a.totalBalance / a.members.length : 0), 0),
    [accounts]
  )

  const handleCreateAccount = async (payload: { name: string; description: string }) => {
    const account = await createSharedAccount.mutateAsync(payload)
    setSelectedAccountId(account.id)
    toast({
      title: "Shared account created",
      description: `${payload.name} is now live and synced from backend.`,
    })
  }

  const handleViewAccount = (account: SharedAccount) => {
    setSelectedAccountId(account.id)
  }

  const handleManageMembers = (account: SharedAccount) => {
    setSelectedAccountId(account.id)
  }

  const handleLeaveAccount = async (accountId: string) => {
    if (!confirm("Are you sure you want to leave this account?")) return
    await leaveSharedAccount.mutateAsync(accountId)
    if (selectedAccountId === accountId) {
      setSelectedAccountId(null)
    }
    toast({
      title: "Left shared account",
      description: "Your membership was removed successfully.",
    })
  }

  const handleChangeRole = async (memberId: string, newRole: string) => {
    if (!selectedAccount) return
    await updateMemberRole.mutateAsync({
      accountId: selectedAccount.id,
      memberId,
      role: newRole as MemberRole,
    })
    toast({
      title: "Member role updated",
      description: `The member role is now ${newRole}.`,
    })
  }

  const handleRemoveUser = async (memberId: string) => {
    if (!selectedAccount) return
    if (!confirm("Remove this user from the account?")) return
    await removeSharedAccountMember.mutateAsync({
      accountId: selectedAccount.id,
      memberId,
    })
    toast({
      title: "Member removed",
      description: "The user was removed from this shared account.",
    })
  }

  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      <Header onCreateAccount={() => setShowCreateModal(true)} />
      {error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Failed to load shared accounts: {error.message}
        </div>
      ) : null}
      <Summary
        totalSharedBalance={totalSharedBalance}
        totalMembers={totalMembers}
        yourShare={yourShare}
        currency={summaryCurrency}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AccountsList
            accounts={accounts}
            selectedAccountId={selectedAccountId}
            onView={handleViewAccount}
            onManageMembers={handleManageMembers}
            onLeave={handleLeaveAccount}
          />
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {selectedAccount ? (
              <motion.div
                key={selectedAccount.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Members
                  account={selectedAccount}
                  onChangeRole={handleChangeRole}
                  onRemoveUser={handleRemoveUser}
                />
                <ActivityFeed activities={selectedAccount.activities} />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-3xl border border-border/60 bg-background/60 p-8 text-center shadow-sm backdrop-blur-sm"
              >
                <p className="text-foreground/50">Select an account to view members and activity</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <CreateSharedAccountModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateAccount}
      />
    </div>
  )
}
