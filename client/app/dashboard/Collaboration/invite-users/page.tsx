"use client"

import { useState } from "react"
import { motion } from "framer-motion"

import Header from "../../Collaboration/InviteUsersPage/Header"
import InviteForm from "../../Collaboration/InviteUsersPage/InviteForm"
import PendingInvites from "../../Collaboration/InviteUsersPage/PendingInvites"
import MembersList from "../../Collaboration/InviteUsersPage/MembersList"

import { demoInvites, demoTeamMembers } from "../../Collaboration/demo-data-invites"
import type { Invite, TeamMember, MemberRole } from "../../Collaboration/types"

export default function InviteUsersPage() {
  const [invites, setInvites] = useState<Invite[]>(demoInvites)
  const [members, setMembers] = useState<TeamMember[]>(demoTeamMembers)

  const handleSendInvite = (email: string, role: MemberRole) => {
    const newInvite: Invite = {
      id: `inv-${Date.now()}`,
      email,
      role,
      status: "pending",
      sentAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }
    setInvites((prev) => [newInvite, ...prev])
    alert(`Invite sent to ${email} as ${role} — demo mode`)
  }

  const handleResend = (inviteId: string) => {
    setInvites((prev) =>
      prev.map((i) =>
        i.id === inviteId
          ? { ...i, sentAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() }
          : i
      )
    )
    alert(`Invite resent — demo mode`)
  }

  const handleCancel = (inviteId: string) => {
    if (confirm("Cancel this invite?")) {
      setInvites((prev) => prev.filter((i) => i.id !== inviteId))
    }
  }

  const handleChangeRole = (memberId: string, newRole: MemberRole) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    )
    alert(`Role changed to ${newRole} — demo mode`)
  }

  const handleRemoveMember = (memberId: string) => {
    if (confirm("Remove this member from the team?")) {
      setMembers((prev) => prev.filter((m) => m.id !== memberId))
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      <Header />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <InviteForm onSendInvite={handleSendInvite} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <MembersList
              members={members}
              onChangeRole={handleChangeRole}
              onRemove={handleRemoveMember}
            />
          </motion.div>
        </div>

        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <PendingInvites
              invites={invites}
              onResend={handleResend}
              onCancel={handleCancel}
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

