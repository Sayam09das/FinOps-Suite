"use client"

import { motion } from "framer-motion"
import { Banknote, Gift, Pencil, Smartphone, Trash2 } from "lucide-react"
import { formatCurrency } from "@/app/lib/utils/number"
import type { Wallet } from "../types"

interface ListProps {
  wallets: Wallet[]
  onEdit?: (wallet: Wallet) => void
  onDelete?: (id: string) => void
}

const walletTypeConfig: Record<string, { icon: typeof Banknote; color: string; bg: string; label: string }> = {
  cash: { icon: Banknote, color: "text-emerald-700", bg: "bg-emerald-100", label: "Cash" },
  digital: { icon: Smartphone, color: "text-blue-700", bg: "bg-blue-100", label: "Digital" },
  gift_card: { icon: Gift, color: "text-violet-700", bg: "bg-violet-100", label: "Gift Card" },
}

export default function List({ wallets, onEdit, onDelete }: ListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="rounded-3xl border border-border/60 bg-background/60 p-5 shadow-sm backdrop-blur-sm md:p-6"
    >
      <h2 className="mb-4 text-lg font-semibold text-foreground">Your Wallets</h2>

      <div className="space-y-3">
        {wallets.map((wallet, index) => {
          const config = walletTypeConfig[wallet.type] || walletTypeConfig.cash
          const Icon = config.icon

          return (
            <motion.div
              key={wallet.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index }}
              whileHover={{ scale: 1.005 }}
              className="flex items-center gap-4 rounded-2xl border border-border/60 bg-background/50 p-4 transition hover:bg-white/80"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bg}`}>
                <Icon className={`h-5 w-5 ${config.color}`} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{wallet.name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${config.bg} ${config.color}`}>
                    {config.label}
                  </span>
                </div>
                {wallet.notes && (
                  <p className="mt-0.5 text-xs text-foreground/50">{wallet.notes}</p>
                )}
              </div>

              <div className="text-right">
                <p className="text-sm font-bold text-foreground">
                  {formatCurrency(wallet.balance, wallet.currency, "en-IN")}
                </p>
                <p className="text-[11px] text-foreground/40">
                  {new Date(wallet.lastUpdated).toLocaleDateString("en-IN")}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit?.(wallet)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-foreground/50 transition hover:bg-background/70 hover:text-foreground"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onDelete?.(wallet.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-rose-400 transition hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

