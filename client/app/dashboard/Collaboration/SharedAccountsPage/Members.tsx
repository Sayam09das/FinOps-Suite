"use client"

import { motion } from "framer-motion"
import { Crown, Pencil, Eye, UserMinus, ChevronDown } from "lucide-react"
import { cn } from "@/app/lib/utils/cn"
import type { SharedAccount, MemberRole } from "../types"

interface MembersProps {
  account: SharedAccount
  onChangeRole: (memberId: string, newRole: string) => void
  onRemoveUser: (memberId: string) => void
}

const roleConfig: Record<
  MemberRole,
  { icon: typeof Crown; label: string; color: string; bg: string }
> = {
  Owner: {
    icon: Crown,
    label: "Owner",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  Editor: {
    icon: Pencil,
    label: "Editor",
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
  Viewer: {
    icon: Eye,
    label: "Viewer",
    color: "text-slate-500",
    bg: "bg-slate-100",
  },
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const listItem = {
  hidden: { opacity: 0, x: 12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35 } },
}

export default function Members({ account, onChangeRole, onRemoveUser }: MembersProps) {
  const roles: MemberRole[] = ["Owner", "Editor", "Viewer"]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-border/60 bg-background/60 p-5 shadow-sm backdrop-blur-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
            Members
          </h3>
          <p className="text-xs text-foreground/50">
            {account.members.length} people in {account.name}
          </p>
        </div>
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: account.color }}
        />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-2"
      >
        {account.members.map((member) => {
          const config = roleConfig[member.role]
          const Icon = config.icon
          const isYou = member.name === "You"

          return (
            <motion.div
              key={member.id}
              variants={listItem}
              className={cn(
                "flex items-center justify-between rounded-2xl border border-border/40 p-3 transition hover:bg-background/80",
                isYou && "border-primary/20 bg-primary/[0.03]"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {member.name} {isYou && <span className="text-primary">(You)</span>}
                  </p>
                  <p className="text-xs text-foreground/40">{member.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", config.bg, config.color)}>
                  <Icon className="h-3 w-3" />
                  {config.label}
                </div>

                <div className="relative flex items-center">
                  <select
                    value={member.role}
                    onChange={(e) => onChangeRole(member.id, e.target.value)}
                    disabled={member.role === "Owner"}
                    className="h-7 cursor-pointer appearance-none rounded-lg border border-border/60 bg-transparent pl-2 pr-6 text-xs text-foreground/70 outline-none transition hover:bg-background/80 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Change role"
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-1.5 h-3 w-3 text-foreground/40" />
                </div>

                <button
                  onClick={() => onRemoveUser(member.id)}
                  disabled={member.role === "Owner"}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-foreground/40 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30"
                  title="Remove user"
                >
                  <UserMinus className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}

