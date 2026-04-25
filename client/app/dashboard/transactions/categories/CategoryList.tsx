"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingDown, TrendingUp, AlertCircle, Gift } from "lucide-react"

import { toast } from "@/app/components/ui/use-toast"
import CategoryItem, { type CategoryData } from "./CategoryItem"

// Default categories derived from existing CATEGORY_CONFIG
const DEFAULT_CATEGORIES: CategoryData[] = [
  { id: "cat_1", name: "Food & Dining", icon: "Utensils", type: "expense", color: "#d27768", usageCount: 42, isDefault: true },
  { id: "cat_2", name: "Transport", icon: "Car", type: "expense", color: "#5687cc", usageCount: 28, isDefault: true },
  { id: "cat_3", name: "Shopping", icon: "ShoppingBag", type: "expense", color: "#8d6ad8", usageCount: 19, isDefault: true },
  { id: "cat_4", name: "Utilities", icon: "Zap", type: "expense", color: "#d0a24d", usageCount: 15, isDefault: true },
  { id: "cat_5", name: "Entertainment", icon: "Film", type: "expense", color: "#e85d9a", usageCount: 12, isDefault: true },
  { id: "cat_6", name: "Healthcare", icon: "Heart", type: "expense", color: "#c66a6a", usageCount: 8, isDefault: true },
  { id: "cat_7", name: "Education", icon: "GraduationCap", type: "expense", color: "#4f9e96", usageCount: 5, isDefault: true },
  { id: "cat_8", name: "Travel", icon: "Plane", type: "expense", color: "#2f7d67", usageCount: 7, isDefault: true },
  { id: "cat_9", name: "Rent", icon: "Home", type: "expense", color: "#d27768", usageCount: 3, isDefault: true },
  { id: "cat_10", name: "Subscriptions", icon: "Smartphone", type: "expense", color: "#5687cc", usageCount: 10, isDefault: true },
  { id: "cat_11", name: "Salary", icon: "Briefcase", type: "income", color: "#2f7d67", usageCount: 6, isDefault: true },
  { id: "cat_12", name: "Freelance", icon: "TrendingUp", type: "income", color: "#4f9e96", usageCount: 4, isDefault: true },
  { id: "cat_13", name: "Investment", icon: "TrendingUp", type: "income", color: "#d0a24d", usageCount: 3, isDefault: true },
  { id: "cat_14", name: "Gifts", icon: "Gift", type: "income", color: "#e85d9a", usageCount: 2, isDefault: true },
  { id: "cat_15", name: "Uncategorized", icon: "AlertCircle", type: "expense", color: "#9ca3af", usageCount: 1, isDefault: true },
]

export default function CategoryList() {
  const [categories, setCategories] = useState<CategoryData[]>(DEFAULT_CATEGORIES)

  const expenseCategories = useMemo(
    () => categories.filter((c) => c.type === "expense").sort((a, b) => b.usageCount - a.usageCount),
    [categories]
  )
  const incomeCategories = useMemo(
    () => categories.filter((c) => c.type === "income").sort((a, b) => b.usageCount - a.usageCount),
    [categories]
  )

  const handleEdit = (cat: CategoryData) => {
    toast({ title: "Edit mode", description: `Editing ${cat.name} — coming soon` })
  }

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
    toast({ title: "Deleted", description: "Category removed" })
  }

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
              <CategoryItem key={cat.id} category={cat} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
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
              <CategoryItem key={cat.id} category={cat} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    </div>
  )
}

