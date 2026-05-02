"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CalendarDays, ChevronDown } from "lucide-react"
import { useState, useRef, useCallback } from "react"

import { Card, CardContent } from "@/app/components/ui/card"
import { cn } from "@/app/lib/utils/cn"
import { useClickOutside } from "@/app/hooks/use-click-outside"
import { dateRangeOptions } from "./types"

interface FiltersProps {
  dateRange: string
  onDateRangeChange: (value: string) => void
}

export default function Filters({ dateRange, onDateRangeChange }: FiltersProps) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const selectedLabel = dateRangeOptions.find((r) => r.value === dateRange)?.label ?? "Select Range"

  const closeDropdown = useCallback(() => setOpen(false), [])
  useClickOutside(dropdownRef, closeDropdown)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
    >
      <Card
        variant="surface"
        className="rounded-[1.95rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-0 backdrop-blur-xl"
      >
        <CardContent className="flex items-center gap-3 px-4 py-4 sm:px-5">
          <div ref={dropdownRef} className="relative w-full sm:w-auto">
            <button
              onClick={() => setOpen(!open)}
              className={cn(
                "inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all sm:w-auto sm:justify-start",
                "border-border/80 bg-background/75 text-foreground/80 hover:bg-white/90 hover:shadow-sm",
                open && "bg-white shadow-sm ring-2 ring-primary/20"
              )}
            >
              <CalendarDays className="h-4 w-4 shrink-0 text-foreground/60" />
              <span className="truncate">{selectedLabel}</span>
              <ChevronDown
                className={cn(
                  "ml-auto h-3.5 w-3.5 shrink-0 text-foreground/50 transition-transform sm:ml-0",
                  open && "rotate-180"
                )}
              />
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-border/80 bg-white/95 p-1.5 shadow-[0_20px_60px_rgba(33,49,43,0.14)] backdrop-blur-xl sm:w-52"
                >
                  {dateRangeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        onDateRangeChange(opt.value)
                        setOpen(false)
                      }}
                      className={cn(
                        "flex w-full items-center rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                        dateRange === opt.value
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/80 hover:bg-muted/60"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

