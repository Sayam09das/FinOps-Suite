"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { formatCurrency } from "@/app/lib/utils/number"
import { cn } from "@/app/lib/utils/cn"
import type { BreakdownItem } from "./types"

interface BreakdownProps {
  incomeSources: BreakdownItem[]
  expenseCategories: BreakdownItem[]
  currency?: string
}

function BreakdownList({
  title,
  icon: Icon,
  items,
  currency,
  iconColor,
  iconBg,
  barFrom,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  items: BreakdownItem[]
  currency: string
  iconColor: string
  iconBg: string
  barFrom: string
}) {
  const total = items.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center gap-3">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", iconBg)}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <p className="text-sm font-medium text-foreground/60">
            {formatCurrency(total, currency)}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: barFrom === "left" ? -12 : 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.2 + index * 0.06 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{item.name}</span>
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">
                  {formatCurrency(item.amount, currency)}
                </p>
              </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted/60">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.06, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ backgroundColor: item.color }}
              />
            </div>
            <p className="text-xs text-foreground/50">{item.percentage.toFixed(1)}%</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default function Breakdown({ incomeSources, expenseCategories, currency = "INR" }: BreakdownProps) {
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
          <CardTitle className="text-xl">Inflow vs Outflow Breakdown</CardTitle>
          <CardDescription>
            Where your money comes from and where it goes.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-8 px-5 py-6 md:flex-row">
          <BreakdownList
            title="Income Sources"
            icon={ArrowUpRight}
            items={incomeSources}
            currency={currency}
            iconColor="text-green-600"
            iconBg="bg-green-500/15"
            barFrom="left"
          />

          <div className="hidden w-px bg-border/60 md:block" />

          <BreakdownList
            title="Expense Categories"
            icon={ArrowDownRight}
            items={expenseCategories}
            currency={currency}
            iconColor="text-red-600"
            iconBg="bg-red-500/15"
            barFrom="right"
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}

