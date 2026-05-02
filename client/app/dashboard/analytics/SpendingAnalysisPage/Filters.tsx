"use client"

import { motion } from "framer-motion"
import { CalendarDays, Tag, CreditCard, ChevronDown } from "lucide-react"
import { useState } from "react"

import { Card, CardContent } from "@/app/components/ui/card"
import { cn } from "@/app/lib/utils/cn"
import { filterOptions } from "./types"

interface FiltersProps {
  dateRange: string
  onDateRangeChange: (value: string) => void
  category: string
  onCategoryChange: (value: string) => void
  account: string
  onAccountChange: (value: string) => void
}

export default function Filters({
  dateRange,
  onDateRangeChange,
  category,
  onCategoryChange,
  account,
  onAccountChange,
}: FiltersProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const dropdowns = [
    {
      key: "date",
      label: filterOptions.dateRanges.find((r) => r.value === dateRange)?.label ?? "Date Range",
      icon: CalendarDays,
      options: filterOptions.dateRanges,
      value: dateRange,
      onChange: onDateRangeChange,
    },
    {
      key: "category",
      label: filterOptions.categories.find((c) => c.value === category)?.label ?? "Category",
      icon: Tag,
      options: filterOptions.categories,
      value: category,
      onChange: onCategoryChange,
    },
    {
      key: "account",
      label: filterOptions.accounts.find((a) => a.value === account)?.label ?? "Account",
      icon: CreditCard,
      options: filterOptions.accounts,
      value: account,
      onChange: onAccountChange,
    },
  ]

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
        <CardContent className="flex flex-wrap items-center gap-3 px-5 py-4">
          {dropdowns.map((dd) => (
            <div key={dd.key} className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === dd.key ? null : dd.key)
                }
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all",
                  "border-border/80 bg-background/75 text-foreground/80 hover:bg-white/90 hover:shadow-sm",
                  openDropdown === dd.key && "bg-white shadow-sm ring-2 ring-primary/20"
                )}
              >
                <dd.icon className="h-4 w-4 text-foreground/60" />
                <span className="hidden sm:inline">{dd.label}</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 text-foreground/50 transition-transform",
                    openDropdown === dd.key && "rotate-180"
                  )}
                />
              </button>

              {openDropdown === dd.key && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-border/80 bg-white/95 p-1.5 shadow-[0_20px_60px_rgba(33,49,43,0.14)] backdrop-blur-xl"
                >
                  {dd.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        dd.onChange(opt.value)
                        setOpenDropdown(null)
                      }}
                      className={cn(
                        "flex w-full items-center rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                        dd.value === opt.value
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/80 hover:bg-muted/60"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}

