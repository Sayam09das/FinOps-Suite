"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Send, CheckCircle2, Eye, Pencil } from "lucide-react"
import { cn } from "@/app/lib/utils/cn"
import type { MemberRole } from "../types"

interface InviteFormProps {
  onSendInvite: (email: string, role: MemberRole) => void
}

export default function InviteForm({ onSendInvite }: InviteFormProps) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<MemberRole>("Viewer")
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !email.includes("@")) return

    onSendInvite(email.trim(), role)
    setIsSuccess(true)
    setEmail("")
    setRole("Viewer")

    setTimeout(() => setIsSuccess(false), 2500)
  }

  const roles: { value: MemberRole; label: string; icon: typeof Eye; desc: string }[] = [
    { value: "Viewer", label: "Viewer", icon: Eye, desc: "Can view only" },
    { value: "Editor", label: "Editor", icon: Pencil, desc: "Can edit & add" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-border/60 bg-background/60 p-6 shadow-sm backdrop-blur-sm"
    >
      <h2 className="mb-4 text-lg font-semibold tracking-[-0.02em] text-foreground">
        Send Invite
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email field */}
        <div className="relative">
          <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40">
            <Mail className="h-4 w-4" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=" colleague@example.com"
            className="w-full rounded-2xl border border-border/60 bg-background/80 py-3 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-foreground/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
            required
          />
        </div>

        {/* Role selection */}
        <div className="grid grid-cols-2 gap-3">
          {roles.map((r) => {
            const Icon = r.icon
            const isSelected = role === r.value
            return (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition-all",
                  isSelected
                    ? "border-primary/40 bg-primary/[0.06] ring-1 ring-primary/20"
                    : "border-border/40 bg-background/40 hover:border-primary/20"
                )}
              >
                <Icon className={cn("h-4 w-4", isSelected ? "text-primary" : "text-foreground/40")} />
                <span className={cn("text-sm font-medium", isSelected ? "text-foreground" : "text-foreground/60")}>
                  {r.label}
                </span>
                <span className="text-[10px] text-foreground/40">{r.desc}</span>
              </button>
            )
          })}
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSuccess}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold shadow-sm transition-all",
              isSuccess
                ? "bg-emerald-500 text-white"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.span
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Invite Sent
                </motion.span>
              ) : (
                <motion.span
                  key="send"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send Invite Link
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}

