"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Target, Calculator } from "lucide-react"

import { Card, CardContent } from "@/app/components/ui/card"
import { formatCurrency } from "@/app/lib/utils/number"
import { accountOptions } from "./demo-data"

interface AddModalProps {
  open: boolean
  onClose: () => void
  onAdd: (goal: {
    name: string
    targetAmount: number
    currentAmount: number
    deadline: string
    linkedAccount: string
  }) => void
  currency: string
}

export default function AddModal({ open, onClose, onAdd, currency }: AddModalProps) {
  const [name, setName] = useState("")
  const [targetAmount, setTargetAmount] = useState("")
  const [currentAmount, setCurrentAmount] = useState("")
  const [deadline, setDeadline] = useState("")
  const [linkedAccount, setLinkedAccount] = useState(accountOptions[0].label)

  const monthlyRequired = useMemo(() => {
    const target = parseFloat(targetAmount) || 0
    const current = parseFloat(currentAmount) || 0
    const remaining = target - current
    if (!remaining || !deadline) return 0
    const months = Math.max(1, Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)))
    return Math.ceil(remaining / months)
  }, [targetAmount, currentAmount, deadline])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      name,
      targetAmount: parseFloat(targetAmount) || 0,
      currentAmount: parseFloat(currentAmount) || 0,
      deadline,
      linkedAccount,
    })
    setName("")
    setTargetAmount("")
    setCurrentAmount("")
    setDeadline("")
    setLinkedAccount(accountOptions[0].label)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
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
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg"
          >
            <Card
              variant="surface"
              className="rounded-[1.95rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,255,255,0.85))] p-0 shadow-2xl backdrop-blur-xl"
            >
              <CardContent className="space-y-5 px-6 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <Target className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">Add Savings Goal</h2>
                      <p className="text-xs text-foreground/60">Set a new financial target</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-full p-2 text-foreground/60 transition-colors hover:bg-muted"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground/80">Goal Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Emergency Fund"
                      className="w-full rounded-xl border border-border/80 bg-background/60 px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground/80">Target Amount</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        placeholder="50000"
                        className="w-full rounded-xl border border-border/80 bg-background/60 px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground/80">Current Amount (optional)</label>
                      <input
                        type="number"
                        min={0}
                        value={currentAmount}
                        onChange={(e) => setCurrentAmount(e.target.value)}
                        placeholder="0"
                        className="w-full rounded-xl border border-border/80 bg-background/60 px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground/80">Deadline</label>
                      <input
                        type="date"
                        required
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full rounded-xl border border-border/80 bg-background/60 px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground/80">Linked Account</label>
                      <select
                        value={linkedAccount}
                        onChange={(e) => setLinkedAccount(e.target.value)}
                        className="w-full rounded-xl border border-border/80 bg-background/60 px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                      >
                        {accountOptions.map((opt) => (
                          <option key={opt.value} value={opt.label}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {monthlyRequired > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 rounded-xl bg-primary/5 px-4 py-3 text-sm text-primary"
                    >
                      <Calculator className="h-4 w-4 shrink-0" />
                      <span>
                        Save <strong>{formatCurrency(monthlyRequired, currency)}</strong>/month to reach your goal on time.
                      </span>
                    </motion.div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 rounded-xl border border-border/80 bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_rgba(33,49,43,0.1)] transition-all hover:bg-primary/90"
                    >
                      Create Goal
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

