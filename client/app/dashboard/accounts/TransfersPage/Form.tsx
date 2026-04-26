"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Banknote, Calendar, Landmark, MessageSquare, Wallet } from "lucide-react"
import { demoBankAccounts, demoWallets } from "../../accounts/demo-data"
import type { AccountTransfer } from "../../accounts/types"

interface FormProps {
  onSubmit?: (transfer: Partial<AccountTransfer>) => void
}

const allAccounts = [
  ...demoBankAccounts.map((a) => ({
    id: a.id,
    name: `${a.bankName} — ${a.accountType}`,
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

export default function Form({ onSubmit }: FormProps) {
  const [fromId, setFromId] = useState("")
  const [toId, setToId] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [notes, setNotes] = useState("")

  const fromAccount = allAccounts.find((a) => a.id === fromId)
  const toAccount = allAccounts.find((a) => a.id === toId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fromAccount || !toAccount || !amount) return
    onSubmit?.({
      fromAccountId: fromId,
      fromAccountName: fromAccount.name,
      fromAccountType: fromAccount.type,
      toAccountId: toId,
      toAccountName: toAccount.name,
      toAccountType: toAccount.type,
      amount: parseFloat(amount),
      currency: fromAccount.currency,
      date,
      notes: notes || undefined,
      status: "completed",
    })
  }

  const isValid = fromId && toId && fromId !== toId && amount && parseFloat(amount) > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-3xl border border-border/60 bg-background/60 p-5 shadow-sm backdrop-blur-sm md:p-6"
    >
      <div className="mb-5 flex items-center gap-2">
        <Banknote className="h-5 w-5 text-foreground/70" />
        <h2 className="text-lg font-semibold text-foreground">Transfer Form</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* From Account */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground/70">From Account</label>
          <div className="relative">
            <Landmark className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
            <select
              value={fromId}
              onChange={(e) => setFromId(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-border/60 bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select source account</option>
              {allAccounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} — ₹{a.balance.toLocaleString("en-IN")}
                </option>
              ))}
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
          <label className="mb-1.5 block text-sm font-medium text-foreground/70">To Account</label>
          <div className="relative">
            <Wallet className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
            <select
              value={toId}
              onChange={(e) => setToId(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-border/60 bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select destination account</option>
              {allAccounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} — ₹{a.balance.toLocaleString("en-IN")}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Amount & Date Row */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground/70">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground/40">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-2xl border border-border/60 bg-background py-2.5 pl-8 pr-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground/70">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-2xl border border-border/60 bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
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
              className="w-full rounded-2xl border border-border/60 bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={!isValid}
          whileHover={isValid ? { scale: 1.02 } : {}}
          whileTap={isValid ? { scale: 0.98 } : {}}
          className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          Transfer Money
        </motion.button>
      </form>
    </motion.div>
  )
}

