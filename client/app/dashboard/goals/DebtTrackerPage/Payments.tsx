"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Receipt, Zap, Calculator, IndianRupee } from "lucide-react"

import { Card, CardContent } from "@/app/components/ui/card"
import { formatCurrency } from "@/app/lib/utils/number"
import type { Debt } from "./demo-data"

interface PaymentsProps {
  debts: Debt[]
  currency: string
  onRecordPayment: (debtId: string, amount: number) => void
}

export default function Payments({ debts, currency, onRecordPayment }: PaymentsProps) {
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null)
  const [extraAmount, setExtraAmount] = useState("")

  const selected = selectedDebt || debts[0]
  const monthsLeft = Math.ceil(selected.remainingBalance / selected.emi)
  const extra = parseFloat(extraAmount) || 0
  const newBalance = Math.max(0, selected.remainingBalance - extra)
  const newMonths = extra > 0 ? Math.ceil(newBalance / selected.emi) : monthsLeft
  const monthsSaved = monthsLeft - newMonths

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
    >
      <Card
        variant="surface"
        className="rounded-[1.95rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-0 backdrop-blur-xl"
      >
        <CardContent className="space-y-5 px-6 py-6">
          <h3 className="text-lg font-bold text-foreground">Payment Actions</h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">Select Debt</label>
              <select
                value={selected.id}
                onChange={(e) => {
                  const d = debts.find((x) => x.id === e.target.value)
                  if (d) setSelectedDebt(d)
                }}
                className="w-full rounded-xl border border-border/80 bg-background/60 px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {debts.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">Extra Payment</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                <input
                  type="number"
                  min={0}
                  value={extraAmount}
                  onChange={(e) => setExtraAmount(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-xl border border-border/80 bg-background/60 pl-9 pr-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          {extra > 0 && monthsSaved > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-xl bg-green-500/10 px-4 py-3 text-sm text-green-700"
            >
              <Zap className="h-4 w-4 shrink-0" />
              <span>
                Pay <strong>{formatCurrency(extra, currency)}</strong> extra &rarr; finish <strong>{monthsSaved} month{monthsSaved > 1 ? "s" : ""}</strong> early!
              </span>
            </motion.div>
          )}

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-primary/5 px-3 py-2">
              <p className="text-xs text-foreground/50">Current Balance</p>
              <p className="font-semibold text-foreground">{formatCurrency(selected.remainingBalance, currency)}</p>
            </div>
            <div className="rounded-xl bg-primary/5 px-3 py-2">
              <p className="text-xs text-foreground/50">After Extra Payment</p>
              <p className="font-semibold text-foreground">{formatCurrency(newBalance, currency)}</p>
            </div>
          </div>

          <button
            onClick={() => onRecordPayment(selected.id, selected.emi)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_rgba(33,49,43,0.1)] transition-all hover:bg-primary/90"
          >
            <Receipt className="h-4 w-4" />
            Record Regular Payment
          </button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

