"use client"

import { motion } from "framer-motion"
import { Banknote, CalendarDays, Recycle, Tag } from "lucide-react"
import { budgetCategories } from "../demo-data"

interface FormProps {
  category: string
  amount: string
  startMonth: string
  recurrence: string
  onCategoryChange: (v: string) => void
  onAmountChange: (v: string) => void
  onStartMonthChange: (v: string) => void
  onRecurrenceChange: (v: string) => void
}

export default function Form({
  category,
  amount,
  startMonth,
  recurrence,
  onCategoryChange,
  onAmountChange,
  onStartMonthChange,
  onRecurrenceChange,
}: FormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-3xl border border-border/60 bg-background/60 p-6 shadow-sm backdrop-blur-sm"
    >
      <h2 className="mb-6 text-lg font-semibold text-foreground">Budget Details</h2>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Category */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground/70">
            <Tag className="h-3.5 w-3.5" />
            Category
          </label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-border/60 bg-background py-2.5 pl-4 pr-10 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select category</option>
              {budgetCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40">▼</span>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground/70">
            <Banknote className="h-3.5 w-3.5" />
            Budget Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground/40">₹</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-2xl border border-border/60 bg-background py-2.5 pl-8 pr-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Start Month */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground/70">
            <CalendarDays className="h-3.5 w-3.5" />
            Start Month
          </label>
          <input
            type="month"
            value={startMonth}
            onChange={(e) => onStartMonthChange(e.target.value)}
            className="w-full rounded-2xl border border-border/60 bg-background py-2.5 px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Recurrence */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground/70">
            <Recycle className="h-3.5 w-3.5" />
            Recurrence
          </label>
          <div className="relative">
            <select
              value={recurrence}
              onChange={(e) => onRecurrenceChange(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-border/60 bg-background py-2.5 pl-4 pr-10 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40">▼</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

