"use client"

import { motion } from "framer-motion"

import Header from "../invite-users-page/Header"
import InviteForm from "../invite-users-page/InviteForm"
import PendingInvites from "../invite-users-page/PendingInvites"
import MembersList from "../invite-users-page/MembersList"
import { useToast } from "@/app/components/ui/use-toast"
import {
  useCancelInvite,
  useCreateInvite,
  useInviteUsersDashboard,
  useRemoveTeamMember,
  useResendInvite,
  useUpdateTeamMemberRole,
} from "@/app/features/collaboration"
import type { MemberRole } from "../../collaboration/types"

export default function InviteUsersPage() {
  const { toast } = useToast()
  const { data, error } = useInviteUsersDashboard()
  const createInvite = useCreateInvite()
  const resendInvite = useResendInvite()
  const cancelInvite = useCancelInvite()
  const updateMemberRole = useUpdateTeamMemberRole()
  const removeMember = useRemoveTeamMember()
  const invites = data?.invites ?? []
  const members = data?.members ?? []

  const handleSendInvite = async (email: string, role: MemberRole) => {
    await createInvite.mutateAsync({ email, role: role === "Owner" ? "Editor" : role })
    toast({
      title: "Invite sent",
      description: `Invitation sent to ${email}.`,
    })
  }

  const handleResend = async (inviteId: string) => {
    await resendInvite.mutateAsync(inviteId)
    toast({
      title: "Invite resent",
      description: "The invitation expiry was refreshed.",
    })
  }

  const handleCancel = async (inviteId: string) => {
    if (!confirm("Cancel this invite?")) return
    await cancelInvite.mutateAsync(inviteId)
    toast({
      title: "Invite cancelled",
      description: "The pending invite was removed.",
    })
  }

  const handleChangeRole = async (memberId: string, newRole: MemberRole) => {
    await updateMemberRole.mutateAsync({ id: memberId, role: newRole })
    toast({
      title: "Role updated",
      description: `Member role changed to ${newRole}.`,
    })
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Remove this member from the team?")) return
    await removeMember.mutateAsync(memberId)
    toast({
      title: "Member removed",
      description: "The team member was removed.",
    })
  }

  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      <Header />
      {error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Failed to load collaboration invites: {error.message}
        </div>
      ) : null}

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
