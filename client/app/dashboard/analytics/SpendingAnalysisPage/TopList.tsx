"use client"

import { motion } from "framer-motion"
import {
  UtensilsCrossed,
  Plane,
  ShoppingBag,
  Film,
  Zap,
  HeartPulse,
  GraduationCap,
  ArrowUpRight,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { formatCurrency } from "@/app/lib/utils/number"
import { cn } from "@/app/lib/utils/cn"
import type { CategorySpend } from "./demo-data"

const iconMap: Record<string, React.ElementType> = {
  UtensilsCrossed,
  Plane,
  ShoppingBag,
  Film,
  Zap,
  HeartPulse,
  GraduationCap,
}

interface TopListProps {
  categories: CategorySpend[]
}

export default function TopList({ categories }: TopListProps) {
  const sorted = [...categories].sort((a, b) => b.amount - a.amount)

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
          <CardTitle className="text-xl">Top Categories</CardTitle>
          <CardDescription>
            Highest spending categories ranked by amount.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-2 px-5 py-5">
          {sorted.map((cat, index) => {
            const Icon = iconMap[cat.icon] ?? ShoppingBag
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.35 + index * 0.07 }}
                className="group flex items-center gap-4 rounded-[1.2rem] border border-border/60 bg-background/60 px-4 py-3.5 transition-all hover:border-border/90 hover:bg-background/90 hover:shadow-sm"
              >
                {/* Rank */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-foreground/70">
                  {index + 1}
                </div>

                {/* Icon */}
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm"
                  style={{ backgroundColor: cat.color + "18" }}
                >
                  <Icon
                    className="h-5 w-5"
                    style={{ color: cat.color }}
                  />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {cat.name}
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      {formatCurrency(cat.amount, "INR")}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.4 + index * 0.07, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground/55">
                      {cat.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <ArrowUpRight className="h-4 w-4 shrink-0 text-foreground/30 transition-colors group-hover:text-foreground/60" />
              </motion.div>
            )
          })}
        </CardContent>
      </Card>
    </motion.div>
  )
}

