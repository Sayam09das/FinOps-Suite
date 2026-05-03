"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Shield,
  Plane,
  Car,
  Home,
  TrendingUp,
  CalendarDays,
  Wallet,
  CreditCard,
  Landmark,
} from "lucide-react"

import { Card, CardContent } from "@/app/components/ui/card"
import { formatCurrency } from "@/app/lib/utils/number"
import type { SavingsGoal } from "@/app/features/goals"

const iconMap: Record<string, React.ElementType> = {
  Shield,
  Plane,
  Car,
  Home,
}

interface DetailsDrawerProps {
  goal: SavingsGoal | null
  onClose: () => void
  currency: string
}

export default function DetailsDrawer({ goal, onClose, currency }: DetailsDrawerProps) {
  if (!goal) return null

  const progress = Math.round((goal.currentAmount / goal.targetAmount) * 100)
  const remaining = goal.targetAmount - goal.currentAmount
  const monthsLeft = Math.max(1, Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)))
  const monthlyRequired = Math.max(0, Math.ceil(remaining / monthsLeft))
  const Icon = iconMap[goal.icon] || Shield

  return (
    <AnimatePresence>
      {goal && (
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
              <h2 className="text-xl font-bold text-foreground">Goal Details</h2>
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
                  style={{ backgroundColor: goal.color }}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{goal.name}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-foreground/60">
                    <Landmark className="h-3.5 w-3.5" />
                    {goal.linkedAccount}
                  </div>
                </div>
              </div>

              <Card variant="surface" className="rounded-[1.5rem] border-border/80 p-0">
                <CardContent className="space-y-3 px-4 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground/70">Progress</span>
                    <span className="text-sm font-bold text-foreground">{progress}%</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: goal.color }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-foreground/60">
                    <span>{formatCurrency(goal.currentAmount, currency)}</span>
                    <span>{formatCurrency(goal.targetAmount, currency)}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-3">
                <StatCard icon={Wallet} label="Current Saved" value={formatCurrency(goal.currentAmount, currency)} />
                <StatCard icon={TrendingUp} label="Remaining" value={formatCurrency(remaining, currency)} />
                <StatCard icon={CalendarDays} label="Deadline" value={new Date(goal.deadline).toLocaleDateString("en-IN")} />
                <StatCard icon={CreditCard} label="Monthly Required" value={formatCurrency(monthlyRequired, currency)} />
              </div>

              <div>
                <h4 className="mb-3 text-sm font-semibold text-foreground">Contribution History</h4>
                <div className="space-y-2">
                  {goal.contributions.map((c, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 px-4 py-2.5"
                    >
                      <span className="text-xs text-foreground/60">
                        {new Date(c.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <span className="text-sm font-bold text-foreground">
                        +{formatCurrency(c.amount, currency)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Progress Prediction */}
              <div className="rounded-xl border border-border/60 bg-primary/5 px-4 py-3">
                <div className="mb-1 flex items-center gap-2 text-primary">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs font-semibold">Progress Prediction</span>
                </div>
                <p className="text-sm text-foreground/80">
                  At the current pace of <strong>{formatCurrency(monthlyRequired, currency)}/month</strong>, you will reach your goal by{" "}
                  <strong>{new Date(goal.deadline).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</strong>.
                </p>
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
