"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Shield, X } from "lucide-react"

import { Card, CardContent } from "@/app/components/ui/card"

interface AddDebtModalProps {
  open: boolean
  onClose: () => void
  onAdd: (debt: {
    name: string
    type: "loan" | "credit-card"
    totalAmount: number
    remainingBalance: number
    interestRate: number
    emi: number
  }) => void
}

export default function AddDebtModal({ open, onClose, onAdd }: AddDebtModalProps) {
  const [name, setName] = useState("")
  const [type, setType] = useState<"loan" | "credit-card">("loan")
  const [totalAmount, setTotalAmount] = useState("")
  const [remainingBalance, setRemainingBalance] = useState("")
  const [interestRate, setInterestRate] = useState("")
  const [emi, setEmi] = useState("")

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onAdd({
      name,
      type,
      totalAmount: Number(totalAmount),
      remainingBalance: Number(remainingBalance),
      interestRate: Number(interestRate),
      emi: Number(emi),
    })
    setName("")
    setType("loan")
    setTotalAmount("")
    setRemainingBalance("")
    setInterestRate("")
    setEmi("")
    onClose()
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-lg"
          >
            <Card variant="surface" className="rounded-[1.95rem] border-border/80 bg-white/95 p-0 shadow-2xl">
              <CardContent className="space-y-5 px-6 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/15 text-red-600">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">Add Debt</h2>
                      <p className="text-xs text-foreground/60">Track a new liability</p>
                    </div>
                  </div>
                  <button onClick={onClose} className="rounded-full p-2 text-foreground/60 hover:bg-muted">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Debt name" className="w-full rounded-xl border border-border/80 bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                  <div className="grid grid-cols-2 gap-4">
                    <select value={type} onChange={(e) => setType(e.target.value as "loan" | "credit-card")} className="w-full rounded-xl border border-border/80 bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                      <option value="loan">Loan</option>
                      <option value="credit-card">Credit Card</option>
                    </select>
                    <input required type="number" min={0} value={interestRate} onChange={(e) => setInterestRate(e.target.value)} placeholder="Interest %" className="w-full rounded-xl border border-border/80 bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input required type="number" min={0} value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} placeholder="Total amount" className="w-full rounded-xl border border-border/80 bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                    <input required type="number" min={0} value={remainingBalance} onChange={(e) => setRemainingBalance(e.target.value)} placeholder="Remaining balance" className="w-full rounded-xl border border-border/80 bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <input required type="number" min={0} value={emi} onChange={(e) => setEmi(e.target.value)} placeholder="Monthly EMI" className="w-full rounded-xl border border-border/80 bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-border/80 bg-background px-4 py-2.5 text-sm font-semibold hover:bg-muted">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                      Create Debt
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
