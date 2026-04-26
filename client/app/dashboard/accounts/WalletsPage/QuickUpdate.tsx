"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, Wallet as WalletIcon } from "lucide-react"
import { formatCurrency } from "@/app/lib/utils/number"
import type { Wallet } from "../types"

interface QuickUpdateProps {
  wallets: Wallet[]
  onUpdate?: (id: string, newBalance: number) => void
}

export default function QuickUpdate({ wallets, onUpdate }: QuickUpdateProps) {
  const [selectedId, setSelectedId] = useState("")
  const [newBalance, setNewBalance] = useState("")

  const selectedWallet = wallets.find((w) => w.id === selectedId)

  const handleUpdate = () => {
    if (!selectedWallet || !newBalance) return
    onUpdate?.(selectedId, parseFloat(newBalance))
    setNewBalance("")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-3xl border border-border/60 bg-background/60 p-5 shadow-sm backdrop-blur-sm md:p-6"
    >
      <div className="mb-5 flex items-center gap-2">
        <ArrowUpRight className="h-5 w-5 text-foreground/70" />
        <h2 className="text-lg font-semibold text-foreground">Quick Update</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground/70">Select Wallet</label>
          <div className="relative">
            <WalletIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-border/60 bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Choose a wallet</option>
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} — {formatCurrency(w.balance, w.currency, "en-IN")}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedWallet && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-4"
          >
            <div className="rounded-2xl border border-border/60 bg-background/50 p-4">
              <p className="text-xs text-foreground/50">Current Balance</p>
              <p className="mt-1 text-xl font-bold text-foreground">
                {formatCurrency(selectedWallet.balance, selectedWallet.currency, "en-IN")}
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/70">New Balance</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground/40">₹</span>
                <input
                  type="number"
                  value={newBalance}
                  onChange={(e) => setNewBalance(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-2xl border border-border/60 bg-background py-2.5 pl-8 pr-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpdate}
              disabled={!newBalance}
              className="w-full rounded-2xl bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Update Balance
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

