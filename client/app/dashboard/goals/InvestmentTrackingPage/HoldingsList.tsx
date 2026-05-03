"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, BarChart3, PieChart } from "lucide-react"

import { Card, CardContent } from "@/app/components/ui/card"
import { formatCurrency } from "@/app/lib/utils/number"
import { cn } from "@/app/lib/utils/cn"
import type { Holding } from "@/app/features/goals"

interface HoldingsListProps {
  holdings: Holding[]
  currency: string
  onSelectHolding: (holding: Holding) => void
}

export default function HoldingsList({ holdings, currency, onSelectHolding }: HoldingsListProps) {
  if (holdings.length === 0) {
    return (
      <Card variant="surface" className="rounded-[1.95rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))]">
        <CardContent className="px-6 py-10 text-center text-foreground/60">
          No investments added yet. Add a holding to track your portfolio in real time.
        </CardContent>
      </Card>
    )
  }

  const totalInvested = holdings.reduce((s, h) => s + h.investedAmount, 0)
  const stockAllocation = holdings.filter(h => h.type === "stock").reduce((s, h) => s + h.investedAmount, 0)
  const fundAllocation = holdings.filter(h => h.type === "mutual-fund").reduce((s, h) => s + h.investedAmount, 0)
  const stockPct = totalInvested > 0 ? Math.round((stockAllocation / totalInvested) * 100) : 0
  const fundPct = totalInvested > 0 ? Math.round((fundAllocation / totalInvested) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
    >
      <Card
        variant="surface"
        className="rounded-[1.95rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-0 backdrop-blur-xl"
      >
        <CardContent className="space-y-5 px-6 py-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Holdings</h3>
            <span className="text-xs text-foreground/50">Tap for details</span>
          </div>

          {/* Allocation Breakdown */}
          <div className="flex items-center gap-4 rounded-xl bg-primary/5 px-4 py-3">
            <div className="flex-1">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-foreground/70">Allocation</span>
                <span className="text-foreground/50">Stocks {stockPct}% · Funds {fundPct}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="flex h-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stockPct}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="h-full bg-blue-500"
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${fundPct}%` }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="h-full bg-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {holdings.map((holding, index) => {
              const gainLoss = holding.currentValue - holding.investedAmount
              const returnPct = holding.investedAmount > 0 ? Math.round((gainLoss / holding.investedAmount) * 100) : 0
              const isProfit = gainLoss >= 0
              const allocation = Math.round((holding.investedAmount / totalInvested) * 100)

              return (
                <motion.div
                  key={holding.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 + index * 0.08 }}
                >
                  <Card
                    variant="surface"
                    className="cursor-pointer rounded-[1.5rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-0 backdrop-blur-xl transition-all hover:shadow-lg"
                    onClick={() => onSelectHolding(holding)}
                  >
                    <CardContent className="space-y-4 px-5 py-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm"
                            style={{ backgroundColor: holding.color }}
                          >
                            {holding.type === "stock" ? (
                              <BarChart3 className="h-5 w-5" />
                            ) : (
                              <PieChart className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-foreground">{holding.name}</h3>
                            <span className="text-xs capitalize text-foreground/50">{holding.type.replace("-", " ")}</span>
                          </div>
                        </div>
                        <div className={cn("flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold", isProfit ? "bg-green-500/15 text-green-600" : "bg-red-500/15 text-red-600")}>
                          {isProfit ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {isProfit ? "+" : ""}{returnPct}%
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-foreground/50">Invested</p>
                          <p className="font-semibold text-foreground">{formatCurrency(holding.investedAmount, currency)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-foreground/50">Current Value</p>
                          <p className="font-semibold text-foreground">{formatCurrency(holding.currentValue, currency)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-foreground/50">Gain/Loss</p>
                          <p className={cn("font-semibold", isProfit ? "text-green-600" : "text-red-600")}>
                            {isProfit ? "+" : ""}{formatCurrency(gainLoss, currency)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-foreground/50">Allocation</p>
                          <p className="font-semibold text-foreground">{allocation}%</p>
                        </div>
                      </div>

                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${allocation}%` }}
                          transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: holding.color }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
