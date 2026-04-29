"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"

import { cn } from "@/app/lib/utils/cn"
import { CATEGORY_CONFIG } from "../AllTransactions/view-model"

export interface CategoryData {
  id: string
  name: string
  icon: string
  type: "income" | "expense"
  color: string
  usageCount: number
  isDefault?: boolean
}

interface CategoryItemProps {
  category: CategoryData
}

export default function CategoryItem({ category }: CategoryItemProps) {
  const config = CATEGORY_CONFIG[category.name]
  const IconComponent = config?.icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      whileHover={{ y: -2 }}
      className="group flex items-center gap-3 rounded-2xl border border-border/60 bg-background/50 px-4 py-3.5 transition hover:border-primary/30 hover:bg-white/70 hover:shadow-[0_8px_30px_rgba(33,49,43,0.06)]"
    >
      {/* Icon */}
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: category.color + "20" }}
      >
        {IconComponent ? (
          <IconComponent className="h-5 w-5" style={{ color: category.color }} />
        ) : (
          <div className="h-5 w-5 rounded-full" style={{ backgroundColor: category.color }} />
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-foreground">{category.name}</p>
        </div>
        <div className="mt-0.5 flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
              category.type === "income"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700"
            )}
          >
            {category.type === "income" ? (
              <TrendingUp className="h-2.5 w-2.5" />
            ) : (
              <TrendingDown className="h-2.5 w-2.5" />
            )}
            {category.type}
          </span>
          <span className="text-xs text-foreground/40">{category.usageCount} uses</span>
        </div>
      </div>

    </motion.div>
  )
}
