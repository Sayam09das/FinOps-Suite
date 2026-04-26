"use client"

import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

interface MonthSelectorProps {
  selectedMonth: number
  onChange: (month: number) => void
}

export default function MonthSelector({ selectedMonth, onChange }: MonthSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="flex items-center gap-2 overflow-x-auto rounded-2xl border border-border/60 bg-background/60 p-2 shadow-sm backdrop-blur-sm"
    >
      <button
        onClick={() => onChange(Math.max(0, selectedMonth - 1))}
        disabled={selectedMonth === 0}
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-foreground/50 transition hover:bg-background/70 hover:text-foreground disabled:opacity-30"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {months.map((m, i) => (
        <button
          key={m}
          onClick={() => onChange(i)}
          className={`shrink-0 rounded-xl px-3 py-1.5 text-sm font-medium transition ${
            i === selectedMonth
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-foreground/60 hover:bg-background/70 hover:text-foreground"
          }`}
        >
          {m}
        </button>
      ))}

      <button
        onClick={() => onChange(Math.min(11, selectedMonth + 1))}
        disabled={selectedMonth === 11}
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-foreground/50 transition hover:bg-background/70 hover:text-foreground disabled:opacity-30"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </motion.div>
  )
}

