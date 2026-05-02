"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Landmark, Plus, RefreshCw } from "lucide-react"
import Link from "next/link"

interface HeaderProps {
  onRefresh?: () => void
  onAddAccount?: () => void
}

export default function Header({ onRefresh, onAddAccount }: HeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl text-foreground/72 transition hover:bg-background/70 hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="primary-wash flex h-11 w-11 items-center justify-center rounded-2xl">
            <Landmark className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-[-0.03em] text-foreground md:text-3xl">
              Bank Accounts
            </h1>
            <p className="text-sm text-foreground/60">Manage your banking relationships and balances</p>
          </div>
        </div>
      </div>

<div className="flex flex-wrap items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onRefresh}
          className="inline-flex items-center gap-2 rounded-2xl border border-border/80 bg-background/75 px-4 py-2.5 text-sm font-semibold text-foreground/80 shadow-sm transition hover:bg-white/90"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Refresh</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onAddAccount}
          className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Account</span>
        </motion.button>
      </div>
    </motion.div>
  )
}
