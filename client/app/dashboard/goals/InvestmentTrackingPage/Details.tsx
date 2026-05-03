"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, BarChart3, PieChart, TrendingUp, TrendingDown, Hash, IndianRupee } from "lucide-react"

import { Card, CardContent } from "@/app/components/ui/card"
import { formatCurrency } from "@/app/lib/utils/number"
import { cn } from "@/app/lib/utils/cn"
import type { Holding } from "@/app/features/goals"

interface DetailsProps {
  holding: Holding | null
  onClose: () => void
  currency: string
}

export default function Details({ holding, onClose, currency }: DetailsProps) {
  if (!holding) return null

  const gainLoss = holding.currentValue - holding.investedAmount
  const returnPct = holding.investedAmount > 0 ? Math.round((gainLoss / holding.investedAmount) * 100) : 0
  const isProfit = gainLoss >= 0

  return (
    <AnimatePresence>
      {holding && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-border/80 bg-background/95 p-6 shadow-2xl backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Asset Details</h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-foreground/60 transition-colors hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-sm"
                  style={{ backgroundColor: holding.color }}
                >
                  {holding.type === "stock" ? (
                    <BarChart3 className="h-7 w-7" />
                  ) : (
                    <PieChart className="h-7 w-7" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{holding.name}</h3>
                  <span className="text-xs capitalize text-foreground/60">{holding.type.replace("-", " ")}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <StatCard icon={IndianRupee} label="Buy Price" value={formatCurrency(holding.buyPrice, currency)} />
                <StatCard icon={Hash} label="Quantity" value={holding.quantity.toString()} />
                <StatCard icon={IndianRupee} label="Invested" value={formatCurrency(holding.investedAmount, currency)} />
                <StatCard icon={IndianRupee} label="Current Value" value={formatCurrency(holding.currentValue, currency)} />
              </div>

              <Card variant="surface" className="rounded-[1.5rem] border-border/80 p-0">
                <CardContent className="space-y-3 px-4 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground/70">Return</span>
                    <span className={cn("text-sm font-bold", isProfit ? "text-green-600" : "text-red-600")}>
                      {isProfit ? "+" : ""}{returnPct}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground/70">Gain/Loss</span>
                    <span className={cn("text-sm font-bold", isProfit ? "text-green-600" : "text-red-600")}>
                      {isProfit ? "+" : ""}{formatCurrency(Math.abs(gainLoss), currency)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div>
                <h4 className="mb-3 text-sm font-semibold text-foreground">Value History</h4>
                <div className="space-y-2">
                  {holding.history.map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 px-4 py-2.5"
                    >
                      <span className="text-xs text-foreground/60">
                        {new Date(h.date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                      </span>
                      <span className="text-sm font-bold text-foreground">
                        {formatCurrency(h.value, currency)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function StatCard(props: { icon: React.ElementType; label: string; value: string }) {
  const I = props.icon
  return (
    <div className="rounded-xl border border-border/60 bg-background/60 px-4 py-3">
      <div className="mb-1 flex items-center gap-2 text-foreground/50">
        <I className="h-3.5 w-3.5" />
        <span className="text-xs font-medium">{props.label}</span>
      </div>
      <p className="text-sm font-bold text-foreground">{props.value}</p>
    </div>
  )
}
