"use client"

import { motion } from "framer-motion"
import { Target, TrendingDown, TrendingUp } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { cn } from "@/app/lib/utils/cn"

interface SavingsRateProps {
  current: number
  previous: number
  target: number
}

export default function SavingsRate({ current, previous, target }: SavingsRateProps) {
  const diff = current - previous
  const isUp = diff >= 0
  const toTarget = target - current

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
    >
      <Card
        variant="surface"
        className="rounded-[1.95rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-0 backdrop-blur-xl"
      >
        <CardHeader className="border-b border-border/70 px-5 py-5">
          <CardTitle className="text-xl">Savings Rate</CardTitle>
          <CardDescription>
            Percentage of income saved this period.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-6 px-5 py-8 sm:flex-row sm:justify-around">
          {/* Main Circle */}
          <div className="relative flex h-40 w-40 items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="rgba(0,0,0,0.06)"
                strokeWidth="8"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#2f7d67"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(current / 100) * 264} 264`}
                initial={{ strokeDasharray: "0 264" }}
                animate={{ strokeDasharray: `${(current / 100) * 264} 264` }}
                transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-3xl font-bold text-foreground"
              >
                {current.toFixed(1)}%
              </motion.span>
              <span className="text-xs text-foreground/50">saved</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 rounded-[1.1rem] border border-border/60 bg-background/60 px-4 py-3">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full",
                  isUp ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                )}
              >
                {isUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              </div>
              <div>
                <p className="text-xs text-foreground/50">vs last period</p>
                <p className={cn("text-sm font-bold", isUp ? "text-green-600" : "text-red-600")}>
                  {isUp ? "+" : ""}
                  {diff.toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-[1.1rem] border border-border/60 bg-background/60 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Target className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-foreground/50">Target</p>
                <p className="text-sm font-bold text-foreground">
                  {target.toFixed(0)}%
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-[1.1rem] border border-border/60 bg-background/60 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-foreground/50">To target</p>
                <p className="text-sm font-bold text-foreground">
                  {toTarget > 0 ? `${toTarget.toFixed(1)}% more` : "Target reached!"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

