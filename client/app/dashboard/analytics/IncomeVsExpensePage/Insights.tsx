"use client"

import { motion } from "framer-motion"
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Lightbulb,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { cn } from "@/app/lib/utils/cn"
import type { InsightItem } from "./demo-data"

const iconMap: Record<string, React.ElementType> = {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
}

const toneStyles: Record<string, { bg: string; text: string; border: string; iconBg: string }> = {
  warning: {
    bg: "bg-amber-50/80 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200/70 dark:border-amber-900/50",
    iconBg: "bg-amber-100 text-amber-600 dark:bg-amber-900/50",
  },
  success: {
    bg: "bg-green-50/80 dark:bg-green-950/30",
    text: "text-green-700 dark:text-green-400",
    border: "border-green-200/70 dark:border-green-900/50",
    iconBg: "bg-green-100 text-green-600 dark:bg-green-900/50",
  },
  danger: {
    bg: "bg-red-50/80 dark:bg-red-950/30",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-200/70 dark:border-red-900/50",
    iconBg: "bg-red-100 text-red-600 dark:bg-red-900/50",
  },
  info: {
    bg: "bg-blue-50/80 dark:bg-blue-950/30",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200/70 dark:border-blue-900/50",
    iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-900/50",
  },
}

interface InsightsProps {
  insights: InsightItem[]
}

export default function Insights({ insights }: InsightsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
    >
      <Card
        variant="surface"
        className="rounded-[1.95rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-0 backdrop-blur-xl"
      >
        <CardHeader className="border-b border-border/70 px-5 py-5">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Lightbulb className="h-5 w-5 text-primary" />
            Insights
          </CardTitle>
          <CardDescription>
            Key observations about your income and expense patterns.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 px-5 py-5">
          {insights.map((insight, index) => {
            const Icon = iconMap[insight.icon] ?? Lightbulb
            const styles = toneStyles[insight.type] ?? toneStyles.info

            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.45 + index * 0.08 }}
                className={cn(
                  "flex items-start gap-3 rounded-[1.2rem] border px-4 py-3.5 transition-all hover:shadow-sm",
                  styles.bg,
                  styles.border
                )}
              >
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                    styles.iconBg
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <p className={cn("text-sm font-medium leading-relaxed", styles.text)}>
                  {insight.message}
                </p>
              </motion.div>
            )
          })}
        </CardContent>
      </Card>
    </motion.div>
  )
}

