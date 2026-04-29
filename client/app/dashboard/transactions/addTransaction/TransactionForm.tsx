"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import {
  Calendar,
  Hash,
  FileText,
  RotateCcw,
  Paperclip,
  Check,
  Plus,
  Sparkles,
} from "lucide-react"

import { Button } from "@/app/components/ui/button"
import { toast } from "@/app/components/ui/use-toast"
import { api } from "@/app/lib/api/client"
import { ENDPOINTS } from "@/app/lib/api/endpoints"
import { cn } from "@/app/lib/utils/cn"

import TransactionTypeToggle, { type TransactionType } from "./TransactionTypeToggle"
import CategorySelect from "./CategorySelect"
import AccountSelect from "./AccountSelect"
import SmartSuggestions from "./SmartSuggestions"

import type { Transaction } from "../AllTransactions/types"

// Keyword → category mapping for smart suggestions
const KEYWORD_MAP: Record<string, string> = {
  swiggy: "Food & Dining",
  zomato: "Food & Dining",
  domino: "Food & Dining",
  starbucks: "Food & Dining",
  grocery: "Food & Dining",
  uber: "Transport",
  ola: "Transport",
  petrol: "Transport",
  metro: "Transport",
  amazon: "Shopping",
  flipkart: "Shopping",
  myntra: "Shopping",
  electricity: "Utilities",
  water: "Utilities",
  internet: "Utilities",
  netflix: "Entertainment",
  spotify: "Entertainment",
  movie: "Entertainment",
  pharmacy: "Healthcare",
  doctor: "Healthcare",
  gym: "Healthcare",
  course: "Education",
  book: "Education",
  hotel: "Travel",
  flight: "Travel",
  rent: "Rent",
  maintenance: "Rent",
  aws: "Subscriptions",
  github: "Subscriptions",
  notion: "Subscriptions",
  figma: "Subscriptions",
  salary: "Salary",
  bonus: "Salary",
  client: "Freelance",
  project: "Freelance",
  stock: "Investment",
  mutual: "Investment",
  sip: "Investment",
  crypto: "Investment",
  birthday: "Gifts",
  wedding: "Gifts",
  charity: "Gifts",
}

function suggestCategory(description: string): string | null {
  const lower = description.toLowerCase()
  for (const [keyword, category] of Object.entries(KEYWORD_MAP)) {
    if (lower.includes(keyword)) return category
  }
  return null
}

function todayISO() {
  return new Date().toISOString().split("T")[0]
}

export default function TransactionForm() {
  const [type, setType] = useState<TransactionType>("expense")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(todayISO())
  const [category, setCategory] = useState("")
  const [account, setAccount] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [note, setNote] = useState("")
  const [isRecurring, setIsRecurring] = useState(false)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const queryClient = useQueryClient()

  const amountRef = useRef<HTMLInputElement>(null)

  // Auto-focus amount on mount
  useEffect(() => {
    amountRef.current?.focus()
  }, [])

  // Smart category suggestion
  useEffect(() => {
    if (description.length > 2 && !category) {
      const suggested = suggestCategory(description)
      if (suggested) {
        setCategory(suggested)
      }
    }
  }, [description, category])

  const handleAddTag = useCallback(() => {
    const trimmed = tagInput.trim().replace(/^#/, "")
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed])
      setTagInput("")
    }
  }, [tagInput, tags])

  const handleRemoveTag = useCallback((tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag))
  }, [])

  const handleDuplicate = useCallback((txn: Transaction) => {
    setType(txn.type as TransactionType)
    setAmount(txn.amount.toString())
    setDescription(txn.description)
    setCategory(txn.category)
    setAccount(txn.account)
    setTags(txn.tags || [])
    setNote(txn.note || "")
    setIsRecurring(txn.isRecurring || false)
    toast({ title: "Form filled", description: `Duplicated: ${txn.description}` })
  }, [])

  const handleSubmit = useCallback(
    async (saveAndAdd = false) => {
      if (!amount || !description || !category || !account) {
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
          description: `${type === "income" ? "+" : "-"}₹${Number(amount).toLocaleString("en-IN")} - ${description}`,
          variant: "success",
        })

        if (saveAndAdd) {
          setAmount("")
          setDescription("")
          setCategory("")
          setAccount("")
          setTags([])
          setNote("")
          setIsRecurring(false)
          setReceiptFile(null)
          setTagInput("")
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
    [account, amount, category, date, description, note, queryClient, type]
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
            {category && suggestCategory(description) === category && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1.5 text-xs text-emerald-600"
              >
                <Sparkles className="h-3 w-3" />
                Auto-categorized as {category}
              </motion.p>
            )}
          </div>

          {/* Date & Category & Account Grid */}
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

            {/* Account */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
                Account
              </label>
              <AccountSelect value={account} onChange={setAccount} />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
              Tags
            </label>
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border/70 bg-background/60 px-3 py-2">
              <Hash className="h-4 w-4 text-foreground/40" />
              {tags.map((tag) => (
                <motion.span
                  key={tag}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-0.5 hover:text-rose-500"
                  >
                    ×
                  </button>
                </motion.span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                placeholder={tags.length ? "" : "Add tags..."}
                className="min-w-[80px] flex-1 bg-transparent text-sm outline-none placeholder:text-foreground/35"
              />
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

          {/* Recurring Toggle */}
          <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
                <RotateCcw className="h-4 w-4 text-violet-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Recurring transaction</p>
                <p className="text-xs text-foreground/50">Repeat this transaction automatically</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsRecurring(!isRecurring)}
              className={cn(
                "relative h-7 w-12 rounded-full transition",
                isRecurring ? "bg-primary" : "bg-muted"
              )}
            >
              <motion.div
                className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm"
                animate={{ left: isRecurring ? "calc(100% - 26px)" : "2px" }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          {/* Receipt Attachment */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
              Attach Receipt
            </label>
            <div
              onClick={() => document.getElementById("receipt-input")?.click()}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-border/70 bg-background/60 px-4 py-4 transition hover:border-primary/40 hover:bg-white/60",
                receiptFile && "border-solid border-primary/30 bg-primary/5"
              )}
            >
              <Paperclip className="h-5 w-5 text-foreground/40" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {receiptFile ? receiptFile.name : "Click to upload receipt"}
                </p>
                <p className="text-xs text-foreground/50">PNG, JPG, or PDF up to 5MB</p>
              </div>
              <input
                id="receipt-input"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                className="hidden"
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
