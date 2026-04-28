"use client"

import { useState, useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"

import Header from "../shared-accounts-page/Header"
import Summary from "../shared-accounts-page/Summary"
import AccountsList from "../shared-accounts-page/AccountsList"
import Members from "../shared-accounts-page/Members"
import ActivityFeed from "../shared-accounts-page/ActivityFeed"

import { demoSharedAccounts } from "../../collaboration/demo-data"
import type { SharedAccount } from "../../collaboration/types"

export default function SharedAccountsPage() {
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null)

  const accounts = demoSharedAccounts

  const selectedAccount = useMemo(
    () => accounts.find((a) => a.id === selectedAccountId) || null,
    [accounts, selectedAccountId]
  )

  const totalSharedBalance = useMemo(
    () => accounts.reduce((sum, a) => sum + a.totalBalance, 0),
    [accounts]
  )

  const totalMembers = useMemo(
    () => new Set(accounts.flatMap((a) => a.members.map((m) => m.id))).size,
    [accounts]
  )

  const yourShare = useMemo(
    () => accounts.reduce((sum, a) => sum + a.totalBalance / a.members.length, 0),
    [accounts]
  )

  const handleCreateAccount = () => {
    alert("Create Shared Account — demo mode")
  }

  const handleViewAccount = (account: SharedAccount) => {
    setSelectedAccountId(account.id)
  }

  const handleManageMembers = (account: SharedAccount) => {
    setSelectedAccountId(account.id)
  }

  const handleLeaveAccount = (accountId: string) => {
    if (confirm("Are you sure you want to leave this account?")) {
      alert(`Left account ${accountId} — demo mode`)
    }
  }

  const handleChangeRole = (memberId: string, newRole: string) => {
    alert(`Changed role of ${memberId} to ${newRole} — demo mode`)
  }

  const handleRemoveUser = (memberId: string) => {
    if (confirm("Remove this user from the account?")) {
      alert(`Removed ${memberId} — demo mode`)
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      <Header onCreateAccount={handleCreateAccount} />
      <Summary
        totalSharedBalance={totalSharedBalance}
        totalMembers={totalMembers}
        yourShare={yourShare}
        currency="INR"
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
    </div>
  )
}

