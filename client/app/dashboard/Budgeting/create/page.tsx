"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Save } from "lucide-react"

import Header from "../CreateBudgetPage/Header"
import Form from "../CreateBudgetPage/Form"
import Preview from "../CreateBudgetPage/Preview"
import Suggestions from "../CreateBudgetPage/Suggestions"
import Snapshot from "../CreateBudgetPage/Snapshot"

import { demoBudgets } from "../demo-data"

export default function CreateBudgetPage() {
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [startMonth, setStartMonth] = useState("2025-01")
  const [recurrence, setRecurrence] = useState("monthly")
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSave = () => {
    if (!category || !amount) return
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
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

          <Preview category={category} />

          <Suggestions category={category} amount={amount} />

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleSave}
            disabled={!category || !amount}
            className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="inline-flex items-center gap-2">
              <Save className="h-4 w-4" />
              Create Budget
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
          <Snapshot budgets={demoBudgets} selectedCategory={category} />
        </div>
      </div>
    </div>
  )
}

