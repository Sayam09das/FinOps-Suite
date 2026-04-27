"use client"

import { motion } from "framer-motion"
import { ArrowRight, Wallet, TrendingUp, TrendingDown } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { formatCurrency } from "@/app/lib/utils/number"
import { cn } from "@/app/lib/utils/cn"

interface FlowChartProps {
  income: number
  expenses: number
  remaining: number
  currency?: string
}

function FlowNode({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  barColor,
  delay,
  currency,
}: {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  iconBg: string
  iconColor: string
  barColor: string
  delay: number
  currency: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="flex flex-1 flex-col items-center gap-4"
    >
      <div className="w-full rounded-[1.5rem] border border-border/60 bg-background/60 p-5 text-center">
        <div className={cn("mx-auto flex h-12 w-12 items-center justify-center rounded-xl", iconBg)}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
        <p className="mt-3 text-sm font-medium text-foreground/60">{label}</p>
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.15 }}
          className="mt-1 text-2xl font-bold tracking-tight text-foreground"
        >
          {formatCurrency(value, currency)}
        </motion.p>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-muted/60">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.8, delay: delay + 0.2, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: barColor }}
        />
      </div>
    </motion.div>
  )
}

function ArrowConnector({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className="flex shrink-0 items-center justify-center py-4 sm:py-0"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
        <ArrowRight className="h-5 w-5 rotate-90 text-primary sm:rotate-0" />
      </div>
    </motion.div>
  )
}

export default function FlowChart({ income, expenses, remaining, currency = "INR" }: FlowChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
    >
      <Card
        variant="surface"
        className="rounded-[1.95rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-0 backdrop-blur-xl"
      >
        <CardHeader className="border-b border-border/70 px-5 py-5">
          <CardTitle className="text-xl">Flow Chart</CardTitle>
          <CardDescription>Visual flow of your money.</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-2 px-5 py-8 sm:flex-row sm:gap-4">
          <FlowNode
            label="Income"
            value={income}
            icon={TrendingUp}
            iconBg="bg-green-500/15"
            iconColor="text-green-600"
            barColor="#10B981"
            delay={0.3}
            currency={currency}
          />

          <ArrowConnector delay={0.4} />

          <FlowNode
            label="Expenses"
            value={expenses}
            icon={TrendingDown}
            iconBg="bg-red-500/15"
            iconColor="text-red-600"
            barColor="#EF4444"
            delay={0.45}
            currency={currency}
          />

          <ArrowConnector delay={0.55} />

          <FlowNode
            label="Remaining"
            value={remaining}
            icon={Wallet}
            iconBg="bg-primary/15"
            iconColor="text-primary"
            barColor="#2f7d67"
            delay={0.6}
            currency={currency}
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}

