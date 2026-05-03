"use client"

import { motion } from "framer-motion"
import { Shield, Plane, Car, Home, CalendarDays, Wallet } from "lucide-react"

import { Card, CardContent } from "@/app/components/ui/card"
import { formatCurrency } from "@/app/lib/utils/number"
import type { SavingsGoal } from "@/app/features/goals"

const iconMap: Record<string, React.ElementType> = {
  Shield,
  Plane,
  Car,
  Home,
}

interface GoalsListProps {
  goals: SavingsGoal[]
  currency: string
  onSelectGoal: (goal: SavingsGoal) => void
}

export default function GoalsList({ goals, currency, onSelectGoal }: GoalsListProps) {
  if (goals.length === 0) {
    return (
      <Card variant="surface" className="rounded-[1.95rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))]">
        <CardContent className="px-6 py-10 text-center text-foreground/60">
          No savings goals yet. Create your first goal to start tracking progress.
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      {goals.map((goal, index) => {
        const progress = Math.round((goal.currentAmount / goal.targetAmount) * 100)
        const remaining = goal.targetAmount - goal.currentAmount
        const monthsLeft = Math.max(1, Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)))
        const monthlyRequired = Math.max(0, Math.ceil(remaining / monthsLeft))
        const Icon = iconMap[goal.icon] || Shield

        return (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 + index * 0.08 }}
          >
            <Card
              variant="surface"
              className="cursor-pointer rounded-[1.95rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-0 backdrop-blur-xl transition-all hover:shadow-lg"
              onClick={() => onSelectGoal(goal)}
            >
              <CardContent className="space-y-4 px-5 py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm"
                      style={{ backgroundColor: goal.color }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground">
                        {goal.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-foreground/50">
                        <CalendarDays className="h-3 w-3" />
                        Due {new Date(goal.deadline).toLocaleDateString("en-IN", {
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-foreground">
                    {progress}%
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: goal.color }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground/60">
                      {formatCurrency(goal.currentAmount, currency)} saved
                    </span>
                    <span className="text-foreground/60">
                      {formatCurrency(remaining, currency)} remaining
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-primary/5 px-3 py-2 text-xs font-medium text-primary">
                  <Wallet className="h-3.5 w-3.5" />
                  Save {formatCurrency(monthlyRequired, currency)}/month to reach goal
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
