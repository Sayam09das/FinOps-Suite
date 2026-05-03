"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { TrendingUp, X } from "lucide-react"

import { Card, CardContent } from "@/app/components/ui/card"

interface AddInvestmentModalProps {
  open: boolean
  onClose: () => void
  onAdd: (investment: {
    name: string
    type: "stock" | "mutual-fund"
    investedAmount: number
    currentValue: number
    quantity: number
    buyPrice: number
  }) => void
}

export default function AddInvestmentModal({ open, onClose, onAdd }: AddInvestmentModalProps) {
  const [name, setName] = useState("")
  const [type, setType] = useState<"stock" | "mutual-fund">("stock")
  const [investedAmount, setInvestedAmount] = useState("")
  const [currentValue, setCurrentValue] = useState("")
  const [quantity, setQuantity] = useState("")
  const [buyPrice, setBuyPrice] = useState("")

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onAdd({
      name,
      type,
      investedAmount: Number(investedAmount),
      currentValue: Number(currentValue),
      quantity: Number(quantity),
      buyPrice: Number(buyPrice),
    })
    setName("")
    setType("stock")
    setInvestedAmount("")
    setCurrentValue("")
    setQuantity("")
    setBuyPrice("")
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
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">Add Investment</h2>
                      <p className="text-xs text-foreground/60">Create a live portfolio holding</p>
                    </div>
                  </div>
                  <button onClick={onClose} className="rounded-full p-2 text-foreground/60 hover:bg-muted">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Investment name" className="w-full rounded-xl border border-border/80 bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                  <select value={type} onChange={(e) => setType(e.target.value as "stock" | "mutual-fund")} className="w-full rounded-xl border border-border/80 bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                    <option value="stock">Stock</option>
                    <option value="mutual-fund">Mutual Fund</option>
                  </select>
                  <div className="grid grid-cols-2 gap-4">
                    <input required type="number" min={0} value={investedAmount} onChange={(e) => setInvestedAmount(e.target.value)} placeholder="Invested amount" className="w-full rounded-xl border border-border/80 bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                    <input required type="number" min={0} value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} placeholder="Current value" className="w-full rounded-xl border border-border/80 bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input required type="number" min={0} value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity" className="w-full rounded-xl border border-border/80 bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                    <input required type="number" min={0} value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} placeholder="Buy price" className="w-full rounded-xl border border-border/80 bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-border/80 bg-background px-4 py-2.5 text-sm font-semibold hover:bg-muted">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                      Create Holding
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
