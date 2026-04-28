"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  Mail,
  Hourglass,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/app/lib/utils/cn"
import type { Invite } from "../types"

interface PendingInvitesProps {
  invites: Invite[]
  onResend: (inviteId: string) => void
  onCancel: (inviteId: string) => void
}

const statusConfig = {
  pending: {
    icon: Hourglass,
    label: "Pending",
    color: "text-amber-600",
    bg: "bg-amber-50",
    dot: "bg-amber-500",
  },
  accepted: {
    icon: CheckCircle2,
    label: "Accepted",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    dot: "bg-emerald-500",
  },
  expired: {
    icon: AlertCircle,
    label: "Expired",
    color: "text-slate-500",
    bg: "bg-slate-100",
    dot: "bg-slate-400",
  },
}

export default function PendingInvites({ invites, onResend, onCancel }: PendingInvitesProps) {
  const sorted = [...invites].sort((a, b) => {
    const order = { pending: 0, accepted: 1, expired: 2 }
    return order[a.status] - order[b.status]
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-border/60 bg-background/60 p-5 shadow-sm backdrop-blur-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
            Pending Invites
          </h3>
        </div>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {invites.filter((i) => i.status === "pending").length} pending
        </span>
      </div>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {sorted.map((invite) => {
            const config = statusConfig[invite.status]
            const StatusIcon = config.icon
            const isPending = invite.status === "pending"

            return (
              <motion.div
                key={invite.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  "flex items-center justify-between rounded-2xl border p-3 transition",
                  isPending
                    ? "border-amber-200/60 bg-amber-50/30"
                    : "border-border/40 bg-background/40"
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-foreground">
                      {invite.email}
                    </p>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                        config.bg,
                        config.color
                      )}
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
                      {config.label}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-foreground/40">
                    <span className="rounded bg-border/40 px-1.5 py-0.5 text-[10px] font-medium">
                      {invite.role}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(invite.sentAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {isPending && (
                    <>
                      <button
                        onClick={() => onResend(invite.id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-foreground/40 transition hover:bg-sky-50 hover:text-sky-600"
                        title="Resend invite"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onCancel(invite.id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-foreground/40 transition hover:bg-rose-50 hover:text-rose-600"
                        title="Cancel invite"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {invites.length === 0 && (
          <div className="rounded-2xl border border-border/40 bg-background/40 p-6 text-center">
            <Mail className="mx-auto h-8 w-8 text-foreground/20" />
            <p className="mt-2 text-sm text-foreground/40">No invites sent yet</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

