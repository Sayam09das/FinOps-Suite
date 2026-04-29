"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronDown, Search, Tag } from "lucide-react"

import { cn } from "@/app/lib/utils/cn"
import { useTransactionsQuery } from "@/app/lib/api/queries"
import { CATEGORY_CONFIG } from "../AllTransactions/view-model"
import { mapApiTransaction } from "../AllTransactions/view-model"

interface CategorySelectProps {
  value: string
  onChange: (category: string) => void
  type?: "income" | "expense"
}

export default function CategorySelect({ value, onChange, type = "expense" }: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const { data: transactionsResponse } = useTransactionsQuery(1, true, 50)

  const relevantCategories = useMemo(() => {
    const source = Array.isArray(transactionsResponse)
      ? transactionsResponse
      : transactionsResponse?.data || []

    return Array.from(
      new Set(
        source
          .map(mapApiTransaction)
          .filter((transaction) => transaction.type === type)
          .map((transaction) => transaction.category)
          .filter(Boolean),
      ),
    ).sort()
  }, [transactionsResponse, type])

  const filtered = useMemo(() => {
    if (!search) return relevantCategories
    return relevantCategories.filter((c) => c.toLowerCase().includes(search.toLowerCase()))
  }, [relevantCategories, search])

  const selectedConfig = CATEGORY_CONFIG[value]

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center gap-3 rounded-2xl border border-border/70 bg-background/60 px-4 py-3.5 text-left transition hover:bg-white/70",
          isOpen && "border-primary/50 ring-2 ring-primary/10"
        )}
      >
        {selectedConfig ? (
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: selectedConfig.bgColor.replace("bg-", "") === selectedConfig.bgColor ? undefined : undefined }}
          >
            <selectedConfig.icon className="h-5 w-5" style={{ color: selectedConfig.color }} />
          </div>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
            <Tag className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">{value || "Select category"}</p>
          <p className="text-xs text-foreground/50">Choose a category</p>
        </div>
        <ChevronDown className={cn("h-4 w-4 text-foreground/40 transition", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-border/70 bg-white/95 shadow-[0_20px_60px_rgba(33,49,43,0.12)] backdrop-blur-xl"
            >
              {/* Search */}
              <div className="border-b border-border/40 p-3">
                <div className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2">
                  <Search className="h-4 w-4 text-foreground/40" />
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-foreground/40"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="max-h-64 overflow-y-auto p-2">
                {search.trim() && !filtered.includes(search.trim()) && (
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => {
                      onChange(search.trim())
                      setIsOpen(false)
                      setSearch("")
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-muted/60"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <Tag className="h-4 w-4 text-foreground/55" />
                    </div>
                    <span className="flex-1 text-sm font-medium">Use "{search.trim()}"</span>
                  </motion.button>
                )}
                {filtered.map((catName, i) => {
                  const config = CATEGORY_CONFIG[catName]
                  const isSelected = value === catName
                  return (
                    <motion.button
                      key={catName}
                      type="button"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.02 }}
                      onClick={() => {
                        onChange(catName)
                        setIsOpen(false)
                        setSearch("")
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition",
                        isSelected ? "bg-primary/8" : "hover:bg-muted/60"
                      )}
                    >
                      {config && (
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                          <config.icon className="h-4 w-4" style={{ color: config.color }} />
                        </div>
                      )}
                      <span className="flex-1 text-sm font-medium">{catName}</span>
                      {isSelected && <Check className="h-4 w-4 text-primary" />}
                    </motion.button>
                  )
                })}
                {filtered.length === 0 && (
                  <p className="py-6 text-center text-sm text-foreground/50">
                    Type a category name to create it with this transaction.
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
