"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Plus, RefreshCw, Wallet } from "lucide-react"
import Link from "next/link"

interface HeaderProps {
  onAddWallet?: () => void
  onRefresh?: () => void
}

export default function Header({ onAddWallet, onRefresh }: HeaderProps) {
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
            <Wallet className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-[-0.03em] text-foreground md:text-3xl">
              Wallets
            </h1>
            <p className="text-sm text-foreground/60">Manage cash and digital wallet balances</p>
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
          onClick={onAddWallet}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Add Wallet
        </motion.button>
      </div>
    </motion.div>
  )
}

