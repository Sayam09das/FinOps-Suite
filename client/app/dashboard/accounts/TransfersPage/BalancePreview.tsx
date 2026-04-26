"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, ArrowRight, Landmark, TrendingDown, TrendingUp, Wallet } from "lucide-react"
import { useMemo } from "react"
import { demoBankAccounts, demoWallets } from "../../accounts/demo-data"
import { formatCurrency } from "@/app/lib/utils/number"

interface BalancePreviewProps {
  fromId?: string
  toId?: string
  amount?: string
}

const allAccounts = [
  ...demoBankAccounts.map((a) => ({
    id: a.id,
    name: a.bankName,
    type: "bank" as const,
    balance: a.balance,
    currency: a.currency,
  })),
  ...demoWallets.map((w) => ({
    id: w.id,
    name: w.name,
    type: "wallet" as const,
    balance: w.balance,
    currency: w.currency,
  })),
]

export default function BalancePreview({ fromId, toId, amount }: BalancePreviewProps) {
  const fromAccount = allAccounts.find((a) => a.id === fromId)
  const toAccount = allAccounts.find((a) => a.id === toId)
  const numericAmount = parseFloat(amount || "0")
  const fee = 0

  const fromAfter = useMemo(() => {
    if (!fromAccount || !numericAmount) return null
    return fromAccount.balance - numericAmount - fee
  }, [fromAccount, numericAmount, fee])

  const toAfter = useMemo(() => {
    if (!toAccount || !numericAmount) return null
    return toAccount.balance + numericAmount
  }, [toAccount, numericAmount])

  const showPreview = fromAccount && numericAmount > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="rounded-3xl border border-border/60 bg-background/60 p-5 shadow-sm backdrop-blur-sm md:p-6"
    >
      <div className="mb-5 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-foreground/70" />
        <h2 className="text-lg font-semibold text-foreground">Balance Preview</h2>
      </div>

      <AnimatePresence mode="wait">
        {showPreview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* From Account */}
            <div className="rounded-2xl border border-red-200 bg-red-50/50 p-4 dark:border-red-900/30 dark:bg-red-950/20">
              <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
                <Landmark className="h-4 w-4" />
                <span className="font-medium">{fromAccount?.name}</span>
              </div>
              <div className="mt-2 flex items-end justify-between">
                <div>
                  <p className="text-xs text-foreground/50">Before</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(fromAccount?.balance || 0, fromAccount?.currency || "INR")}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-foreground/30" />
                <div className="text-right">
                  <p className="text-xs text-foreground/50">After</p>
                  <p className={`text-lg font-bold ${fromAfter !== null && fromAfter < 0 ? "text-red-600" : "text-foreground"}`}>
                    {formatCurrency(fromAfter || 0, fromAccount?.currency || "INR")}
                  </p>
                </div>
              </div>
              {fromAfter !== null && fromAfter < 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex items-center gap-2 rounded-xl bg-red-100 px-3 py-2 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300"
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Insufficient balance — this transfer will overdraw the account
                </motion.div>
              )}
            </div>

            {/* To Account */}
            {toAccount && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20">
                <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300">
                  <Wallet className="h-4 w-4" />
                  <span className="font-medium">{toAccount?.name}</span>
                </div>
                <div className="mt-2 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-foreground/50">Before</p>
                    <p className="text-lg font-bold text-foreground">
                      {formatCurrency(toAccount?.balance || 0, toAccount?.currency || "INR")}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-foreground/30" />
                  <div className="text-right">
                    <p className="text-xs text-foreground/50">After</p>
                    <p className="text-lg font-bold text-emerald-600">
                      {formatCurrency(toAfter || 0, toAccount?.currency || "INR")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/5">
              <TrendingDown className="h-6 w-6 text-foreground/30" />
            </div>
            <p className="text-sm font-medium text-foreground/50">
              Select accounts and enter an amount
            </p>
            <p className="text-xs text-foreground/40">
              See a live preview of balances before confirming
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

