"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Crown,
  Pencil,
  Eye,
  UserMinus,
  ChevronDown,
  Search,
  Users,
  ShieldCheck,
  Shield,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/app/lib/utils/cn"
import type { TeamMember, MemberRole } from "../types"

interface MembersListProps {
  members: TeamMember[]
  onChangeRole: (memberId: string, newRole: MemberRole) => void
  onRemove: (memberId: string) => void
}

const roleConfig: Record<
  MemberRole,
  { icon: typeof Crown; label: string; color: string; bg: string; desc: string }
> = {
  Owner: {
    icon: Crown,
    label: "Owner",
    color: "text-amber-600",
    bg: "bg-amber-50",
    desc: "Full control",
  },
  Editor: {
    icon: Pencil,
    label: "Editor",
    color: "text-sky-600",
    bg: "bg-sky-50",
    desc: "Can edit",
  },
  Viewer: {
    icon: Eye,
    label: "Viewer",
    color: "text-slate-500",
    bg: "bg-slate-100",
    desc: "View only",
  },
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

export default function MembersList({ members, onChangeRole, onRemove }: MembersListProps) {
  const [search, setSearch] = useState("")
  const roles: MemberRole[] = ["Owner", "Editor", "Viewer"]

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  )

  const activeCount = members.filter((m) => m.status === "active").length
  const inactiveCount = members.filter((m) => m.status === "inactive").length

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-3xl border border-border/60 bg-background/60 p-5 shadow-sm backdrop-blur-sm"
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
            Members
          </h3>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
              <ShieldCheck className="h-3 w-3" />
              {activeCount} active
            </span>
            {inactiveCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                <Shield className="h-3 w-3" />
                {inactiveCount} inactive
              </span>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members..."
            className="h-9 w-full rounded-xl border border-border/60 bg-background/80 py-2 pl-9 pr-4 text-sm text-foreground outline-none transition placeholder:text-foreground/30 focus:border-primary/40 sm:w-56"
          />
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
        {filtered.map((member) => {
          const config = roleConfig[member.role]
          const Icon = config.icon
          const isYou = member.name === "You"
          const isOwner = member.role === "Owner"

          return (
            <motion.div
              key={member.id}
              variants={item}
              className={cn(
                "flex flex-col gap-3 rounded-2xl border p-3 transition sm:flex-row sm:items-center sm:justify-between",
                isYou
                  ? "border-primary/20 bg-primary/[0.03]"
                  : member.status === "inactive"
                  ? "border-border/30 bg-background/30 opacity-60"
                  : "border-border/40 bg-background/40 hover:bg-background/80"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
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
                {/* Joined date */}
                <span className="hidden text-xs text-foreground/30 md:block">
                  Joined {format(new Date(member.joinedAt), "MMM d, yyyy")}
                </span>

                {/* Role badge */}
                <div className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", config.bg, config.color)}>
                  <Icon className="h-3 w-3" />
                  {config.label}
                </div>

                {/* Role selector */}
                {!isOwner && (
                  <div className="relative flex items-center">
                    <select
                      value={member.role}
                      onChange={(e) => onChangeRole(member.id, e.target.value as MemberRole)}
                      className="h-8 cursor-pointer appearance-none rounded-lg border border-border/60 bg-transparent pl-2 pr-6 text-xs text-foreground/70 outline-none transition hover:bg-background/80"
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
                )}

                {/* Remove */}
                {!isOwner && (
                  <button
                    onClick={() => onRemove(member.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-foreground/40 transition hover:bg-rose-50 hover:text-rose-600"
                    title="Remove member"
                  >
                    <UserMinus className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          )
        })}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-border/40 bg-background/40 p-6 text-center">
            <Users className="mx-auto h-8 w-8 text-foreground/20" />
            <p className="mt-2 text-sm text-foreground/40">No members found</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

