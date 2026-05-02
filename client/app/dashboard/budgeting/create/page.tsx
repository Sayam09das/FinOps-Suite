"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Save, Loader2 } from "lucide-react"
import { useToast } from "@/app/components/ui/use-toast"

import Header from "../CreateBudgetPage/Header"
import Form from "../CreateBudgetPage/Form"
import Preview from "../CreateBudgetPage/Preview"
import Suggestions from "../CreateBudgetPage/Suggestions"
import Snapshot from "../CreateBudgetPage/Snapshot"

import { useBudgets, useCreateBudget, useBudgetStatus } from "@/app/features/budgets"

export default function CreateBudgetPage() {
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [startMonth, setStartMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  })
  const [recurrence, setRecurrence] = useState("monthly")
  const [showSuccess, setShowSuccess] = useState(false)

  const { toast } = useToast()

  // Fetch budgets and status from backend
  const { data: budgets = [], isLoading: budgetsLoading } = useBudgets()
  const { data: budgetStatus } = useBudgetStatus(startMonth)

  // Create budget mutation
  const createBudget = useCreateBudget()

  const isPending = createBudget.isPending

  const handleSave = async () => {
    if (!category || !amount) return

    try {
      await createBudget.mutateAsync({
        category,
        amount: parseFloat(amount),
        month: startMonth,
      })

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)

      // Reset form
      setCategory("")
      setAmount("")

      toast({
        title: "Budget created",
        description: `Budget for ${category} has been created successfully`,
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create budget. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      <Header />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Form
            category={category}
            amount={amount}
            startMonth={startMonth}
            recurrence={recurrence}
            onCategoryChange={setCategory}
            onAmountChange={setAmount}
            onStartMonthChange={setStartMonth}
            onRecurrenceChange={setRecurrence}
          />

          {/* Preview Component - Uses real-time data from budget status */}
          <Preview category={category} budgetStatus={budgetStatus} />

          {/* Suggestions Component - Uses real-time data */}
          <Suggestions category={category} amount={amount} budgetStatus={budgetStatus} />

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleSave}
            disabled={!category || !amount || isPending}
            className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="inline-flex items-center gap-2">
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Create Budget
                </>
              )}
            </span>
          </motion.button>

          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-emerald-700"
            >
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-medium">Budget created successfully!</span>
            </motion.div>
          )}
        </div>

        <div>
          {/* Snapshot - Uses real-time budgets from backend */}
          <Snapshot budgets={budgets} selectedCategory={category} isLoading={budgetsLoading} />
        </div>
      </div>
    </div>
  )
}
