"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Banknote, Landmark, MessageSquare, Wallet } from "lucide-react"

interface AccountOption {
  id: string
  name: string
  type: "bank" | "wallet"
  balance: number
  currency: string
}

interface FormProps {
  accounts?: AccountOption[]
  onSubmit?: (transfer: {
    fromAccountId: string
    toAccountId: string
    amount: number
    currency?: string
    notes?: string
  }) => void
  isLoading?: boolean
}

// Loading skeleton for account select
function AccountSelectSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-1.5 h-4 w-24 rounded bg-foreground/10" />
      <div className="h-10 w-full rounded-2xl bg-foreground/5" />
    </div>
  )
}

// Empty state when no accounts exist
function NoAccountsMessage() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <Wallet className="h-6 w-6 text-primary" />
      </div>
      <p className="text-sm font-medium text-foreground">No accounts yet</p>
      <p className="text-xs text-foreground/60">Add a bank account or wallet to start transferring</p>
    </div>
  )
}

export default function Form({ accounts = [], onSubmit, isLoading }: FormProps) {
  const [fromId, setFromId] = useState("")
  const [toId, setToId] = useState("")
  const [amount, setAmount] = useState("")
  const [notes, setNotes] = useState("")

  const fromAccount = accounts.find((a) => a.id === fromId)
  const toAccount = accounts.find((a) => a.id === toId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fromAccount || !toAccount || !amount) return
    
    onSubmit?.({
      fromAccountId: fromId,
      toAccountId: toId,
      amount: parseFloat(amount),
      currency: fromAccount.currency || "INR",
      notes: notes || undefined,
    })
    
    // Reset form after successful submit
    setFromId("")
    setToId("")
    setAmount("")
    setNotes("")
  }

  const isValid = fromId && toId && fromId !== toId && amount && parseFloat(amount) > 0

  // Group accounts by type for better UX
  const bankAccounts = accounts.filter((a) => a.type === "bank")
  const walletAccounts = accounts.filter((a) => a.type === "wallet")
  
  // Check if we have any accounts
  const hasAccounts = accounts.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-3xl border border-border/60 bg-background/60 p-5 shadow-sm backdrop-blur-sm md:p-6"
    >
      <div className="mb-5 flex items-center gap-2">
        <Banknote className="h-5 w-5 text-foreground/70" />
        <h2 className="text-lg font-semibold text-foreground">Transfer Funds</h2>
      </div>

      {/* Show loading skeleton while fetching accounts */}
      {isLoading && (
        <div className="space-y-4">
          <AccountSelectSkeleton />
          <AccountSelectSkeleton />
          <div className="animate-pulse h-10 w-full rounded-2xl bg-foreground/5" />
        </div>
      )}

      {/* Show empty state when no accounts exist */}
      {!isLoading && !hasAccounts && <NoAccountsMessage />}

      {/* Show form when accounts exist */}
      {!isLoading && hasAccounts && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* From Account */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground/70">
              From Account <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Landmark className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
              <select
                value={fromId}
                onChange={(e) => setFromId(e.target.value)}
                disabled={isLoading}
                className="w-full appearance-none rounded-2xl border border-border/60 bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              >
                <option value="">Select source account</option>
                {bankAccounts.length > 0 && (
                  <optgroup label="Bank Accounts" className="text-foreground">
                    {bankAccounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} (₹{a.balance.toLocaleString("en-IN")})
                      </option>
                    ))}
                  </optgroup>
                )}
                {walletAccounts.length > 0 && (
                  <optgroup label="Wallets" className="text-foreground">
                    {walletAccounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} (₹{a.balance.toLocaleString("en-IN")})
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>
          </div>

          {/* Arrow indicator */}
          <div className="flex justify-center">
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10"
            >
              <ArrowRight className="h-4 w-4 text-primary" />
            </motion.div>
          </div>

          {/* To Account */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground/70">
              To Account <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Wallet className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
              <select
                value={toId}
                onChange={(e) => setToId(e.target.value)}
                disabled={isLoading}
                className="w-full appearance-none rounded-2xl border border-border/60 bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              >
                <option value="">Select destination account</option>
                {bankAccounts.length > 0 && (
                  <optgroup label="Bank Accounts" className="text-foreground">
                    {bankAccounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} (₹{a.balance.toLocaleString("en-IN")})
                      </option>
                    ))}
                  </optgroup>
                )}
                {walletAccounts.length > 0 && (
                  <optgroup label="Wallets" className="text-foreground">
                    {walletAccounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} (₹{a.balance.toLocaleString("en-IN")})
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground/70">
              Amount <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground/40">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                disabled={isLoading}
                className="w-full rounded-2xl border border-border/60 bg-background py-2.5 pl-8 pr-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              />
            </div>
            {fromAccount && amount && parseFloat(amount) > fromAccount.balance && (
              <p className="mt-1 text-xs text-rose-500">
                ⚠️ Insufficient balance
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground/70">Notes (optional)</label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-foreground/40" />
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What's this transfer for?"
                disabled={isLoading}
                className="w-full rounded-2xl border border-border/60 bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={!isValid || isLoading}
            whileHover={isValid && !isLoading ? { scale: 1.02 } : {}}
            whileTap={isValid && !isLoading ? { scale: 0.98 } : {}}
            className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                />
                Processing...
              </span>
            ) : (
              "Transfer Money"
            )}
          </motion.button>
        </form>
      )}
    </motion.div>
  )
}
