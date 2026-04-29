"use client"

import { useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingDown, TrendingUp } from "lucide-react"

import { useTransactionsQuery } from "@/app/lib/api/queries"
import CategoryItem, { type CategoryData } from "./CategoryItem"
import { CATEGORY_CONFIG, mapApiTransaction } from "../AllTransactions/view-model"

export default function CategoryList() {
  const { data: transactionsResponse } = useTransactionsQuery(1, true, 50)
  const categories = useMemo<CategoryData[]>(() => {
    const source = Array.isArray(transactionsResponse)
      ? transactionsResponse
      : transactionsResponse?.data || []
    const counts = new Map<string, CategoryData>()

    source.map(mapApiTransaction).forEach((transaction) => {
      const config = CATEGORY_CONFIG[transaction.category] || CATEGORY_CONFIG.Uncategorized
      const existing = counts.get(transaction.category)

      counts.set(transaction.category, {
        id: transaction.category,
        name: transaction.category,
        icon: config.name,
        type: transaction.type,
        color: config.color,
        usageCount: (existing?.usageCount || 0) + 1,
      })
    })

    return Array.from(counts.values())
  }, [transactionsResponse])

  const expenseCategories = useMemo(
    () => categories.filter((c) => c.type === "expense").sort((a, b) => b.usageCount - a.usageCount),
    [categories]
  )
  const incomeCategories = useMemo(
    () => categories.filter((c) => c.type === "income").sort((a, b) => b.usageCount - a.usageCount),
    [categories]
  )

  return (
    <div className="space-y-8">
      {/* Expense Categories */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100">
            <TrendingDown className="h-4 w-4 text-rose-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Expense Categories</h2>
            <p className="text-xs text-foreground/50">{expenseCategories.length} categories</p>
          </div>
        </div>

        <motion.div layout className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {expenseCategories.map((cat) => (
              <CategoryItem key={cat.id} category={cat} />
            ))}
          </AnimatePresence>
          {expenseCategories.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border/60 bg-background/40 py-10 text-center text-sm font-medium text-foreground/50 sm:col-span-2 lg:col-span-3">
              No expense categories found in backend transactions.
            </div>
          )}
        </motion.div>
      </section>

      {/* Income Categories */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Income Categories</h2>
            <p className="text-xs text-foreground/50">{incomeCategories.length} categories</p>
          </div>
        </div>

        <motion.div layout className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {incomeCategories.map((cat) => (
              <CategoryItem key={cat.id} category={cat} />
            ))}
          </AnimatePresence>
          {incomeCategories.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border/60 bg-background/40 py-10 text-center text-sm font-medium text-foreground/50 sm:col-span-2 lg:col-span-3">
              No income categories found in backend transactions.
            </div>
          )}
        </motion.div>
      </section>
    </div>
  )
}
