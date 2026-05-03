"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import {
  Calendar,
  FileText,
  Check,
  Plus,
} from "lucide-react"

import { Button } from "@/app/components/ui/button"
import { toast } from "@/app/components/ui/use-toast"
import { api } from "@/app/lib/api/client"
import { ENDPOINTS } from "@/app/lib/api/endpoints"
import { formatCurrency } from "@/app/lib/utils/number"

import TransactionTypeToggle, { type TransactionType } from "./TransactionTypeToggle"
import CategorySelect from "./CategorySelect"
import SmartSuggestions from "./SmartSuggestions"

import type { Transaction } from "../AllTransactions/types"

function todayISO() {
  return new Date().toISOString().split("T")[0]
}

export default function TransactionForm() {
  const [type, setType] = useState<TransactionType>("expense")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(todayISO())
  const [category, setCategory] = useState("")
  const [note, setNote] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const queryClient = useQueryClient()

  const amountRef = useRef<HTMLInputElement>(null)

  // Auto-focus amount on mount
  useEffect(() => {
    amountRef.current?.focus()
  }, [])

  const handleDuplicate = useCallback((txn: Transaction) => {
    setType(txn.type as TransactionType)
    setAmount(txn.amount.toString())
    setDescription(txn.description)
    setCategory(txn.category)
    setNote(txn.note || "")
    toast({ title: "Form filled", description: `Duplicated: ${txn.description}` })
  }, [])

  const handleSubmit = useCallback(
    async (saveAndAdd = false) => {
      if (!amount || !description || !category) {
        toast({ title: "Missing fields", description: "Please fill all required fields" })
        return
      }

      try {
        setIsSaving(true)

        await api.post(ENDPOINTS.TRANSACTION.CREATE, {
          amount: Number(amount),
          type,
          category,
          note: note || description,
          date,
          createdAt: date,
        })

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
          queryClient.invalidateQueries({ queryKey: ["transactions"] }),
        ])

        toast({
          title: "Transaction saved",
          description: `${type === "income" ? "+" : "-"}${formatCurrency(Number(amount), "INR", "en-IN")} - ${description}`,
          variant: "success",
        })

        if (saveAndAdd) {
          setAmount("")
          setDescription("")
          setCategory("")
          setNote("")
          amountRef.current?.focus()
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Could not save transaction"
        toast({
          title: "Save failed",
          description: message,
          variant: "destructive",
        })
      } finally {
        setIsSaving(false)
      }
    },
    [amount, category, date, description, note, queryClient, type]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handleSubmit(false)
      }
    },
    [handleSubmit]
  )

  return (
    <div onKeyDown={handleKeyDown} className="space-y-6">
      {/* Type Toggle */}
      <TransactionTypeToggle value={type} onChange={setType} />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-5"
        >
          {/* Amount — BIG input */}
          <div className="panel-frost rounded-[1.8rem] border border-border/70 p-5 sm:p-6">
            <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-foreground/40">
              Amount
            </label>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground sm:text-4xl">₹</span>
              <input
                ref={amountRef}
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full bg-transparent text-4xl font-bold text-foreground outline-none placeholder:text-foreground/20 sm:text-5xl"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What was this for?"
              className="w-full rounded-2xl border border-border/70 bg-background/60 px-4 py-3.5 text-sm text-foreground outline-none transition placeholder:text-foreground/35 focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
            />
          </div>

          {/* Date & Category Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-2xl border border-border/70 bg-background/60 py-3.5 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
                Category
              </label>
              <CategorySelect value={category} onChange={setCategory} type={type} />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
              Notes
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-foreground/40" />
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Any additional details..."
                rows={3}
                className="w-full resize-none rounded-2xl border border-border/70 bg-background/60 py-3 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-foreground/35 focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <motion.div className="flex-1" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                onClick={() => handleSubmit(false)}
                disabled={isSaving}
                className="w-full rounded-2xl py-3.5 shadow-lg shadow-primary/15"
              >
                <Check className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Transaction"}
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                variant="secondary"
                onClick={() => handleSubmit(true)}
                disabled={isSaving}
                className="w-full rounded-2xl border border-border/70 py-3.5 sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                Save & Add Another
              </Button>
            </motion.div>
          </div>

          <p className="text-center text-xs text-foreground/40">
            Press <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">Ctrl/⌘</kbd> +{" "}
            <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">Enter</kbd> to save
          </p>
        </motion.div>

        {/* Right Sidebar — Smart Suggestions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="panel-frost h-fit rounded-[1.8rem] border border-border/70 p-5"
        >
          <SmartSuggestions onDuplicate={handleDuplicate} />
        </motion.div>
      </div>
    </div>
  )
}
