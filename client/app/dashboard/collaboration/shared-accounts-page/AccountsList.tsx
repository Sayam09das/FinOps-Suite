"use client"

import { motion } from "framer-motion"
import { Eye, Users, LogOut, Settings2, Wallet } from "lucide-react"
import { formatCurrency } from "@/app/lib/utils/number"
import { cn } from "@/app/lib/utils/cn"
import type { SharedAccount } from "../types"

interface AccountsListProps {
  accounts: SharedAccount[]
  selectedAccountId: string | null
  onView: (account: SharedAccount) => void
  onManageMembers: (account: SharedAccount) => void
  onLeave: (accountId: string) => void
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function AccountsList({
  accounts,
  selectedAccountId,
  onView,
  onManageMembers,
  onLeave,
}: AccountsListProps) {
  if (accounts.length === 0) {
    return (
      <div className="rounded-3xl border border-border/60 bg-background/60 p-8 text-center shadow-sm backdrop-blur-sm">
        <p className="text-foreground/50">No shared accounts yet. Create one to start collaborating.</p>
      </div>
    )
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
          Accounts
        </h2>
        <span className="text-sm text-foreground/50">{accounts.length} total</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {accounts.map((account) => {
          const isSelected = account.id === selectedAccountId
          return (
            <motion.div
              key={account.id}
              variants={item}
              whileHover={{ y: -2 }}
              className={cn(
                "group relative cursor-pointer rounded-3xl border p-5 shadow-sm transition-all duration-300",
                isSelected
                  ? "border-primary/40 bg-primary/[0.04] ring-1 ring-primary/20"
                  : "border-border/60 bg-background/60 backdrop-blur-sm hover:border-primary/30 hover:shadow-md"
              )}
              onClick={() => onView(account)}
            >
              {/* Accent stripe */}
              <div
                className="absolute left-0 top-0 h-full w-1 rounded-l-3xl opacity-60"
                style={{ backgroundColor: account.color }}
              />

              <div className="flex items-start justify-between gap-3 pl-2">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${account.color}18` }}
                  >
                    <Wallet className="h-5 w-5" style={{ color: account.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{account.name}</h3>
                    <p className="text-xs text-foreground/50">{account.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-foreground/50">
                  <Users className="h-3.5 w-3.5" />
                  {account.members.length}
                </div>
              </div>

              <div className="mt-4 pl-2">
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(account.totalBalance, account.currency)}
                </p>
                <p className="text-xs text-foreground/40">Total balance</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 pl-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onView(account)
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground/70 transition hover:bg-primary/10 hover:text-primary"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onManageMembers(account)
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground/70 transition hover:bg-primary/10 hover:text-primary"
                >
                  <Settings2 className="h-3.5 w-3.5" />
                  Manage members
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onLeave(account.id)
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground/70 transition hover:bg-rose-50 hover:text-rose-600"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Leave
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
