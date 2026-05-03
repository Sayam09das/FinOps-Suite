"use client"

import { motion } from "framer-motion"
import { Landmark, CreditCard, CalendarDays, Percent } from "lucide-react"

import { Card, CardContent } from "@/app/components/ui/card"
import { formatCurrency } from "@/app/lib/utils/number"
import type { Debt } from "@/app/features/goals"

interface DebtListProps {
  debts: Debt[]
  currency: string
  onSelectDebt: (debt: Debt) => void
}

export default function DebtList({ debts, currency, onSelectDebt }: DebtListProps) {
  if (debts.length === 0) {
    return (
      <Card variant="surface" className="rounded-[1.95rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))]">
        <CardContent className="px-6 py-10 text-center text-foreground/60">
          No debts added yet. Add a debt to start tracking payoff progress.
        </CardContent>
      </Card>
    )
  }

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
            <h3 className="text-lg font-bold text-foreground">Your Debts</h3>
            <span className="text-xs text-foreground/50">Tap for details</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {debts.map((debt, index) => {
              const paid = debt.totalAmount - debt.remainingBalance
              const progress = Math.round((paid / debt.totalAmount) * 100)
              const monthsLeft = Math.ceil(debt.remainingBalance / debt.emi)
              const Icon = debt.type === "loan" ? Landmark : CreditCard

              return (
                <motion.div
                  key={debt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 + index * 0.08 }}
                >
                  <Card
                    variant="surface"
                    className="cursor-pointer rounded-[1.5rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-0 backdrop-blur-xl transition-all hover:shadow-lg"
                    onClick={() => onSelectDebt(debt)}
                  >
                    <CardContent className="space-y-4 px-5 py-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm"
                            style={{ backgroundColor: debt.color }}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-foreground">{debt.name}</h3>
                            <span className="text-xs capitalize text-foreground/50">{debt.type.replace("-", " ")}</span>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-foreground">{progress}%</span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: debt.color }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-foreground/60">{formatCurrency(paid, currency)} paid</span>
                          <span className="text-foreground/60">{formatCurrency(debt.remainingBalance, currency)} left</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="rounded-xl bg-primary/5 px-3 py-2">
                          <p className="text-xs text-foreground/50">EMI</p>
                          <p className="font-semibold text-foreground">{formatCurrency(debt.emi, currency)}</p>
                        </div>
                        <div className="rounded-xl bg-primary/5 px-3 py-2">
                          <p className="text-xs text-foreground/50">Interest</p>
                          <p className="font-semibold text-foreground">{debt.interestRate}%</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-foreground/60">
                        <CalendarDays className="h-3 w-3" />
                        <span>~{monthsLeft} months remaining</span>
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
