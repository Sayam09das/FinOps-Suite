"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Calendar, Repeat } from "lucide-react"

import { Button } from "@/app/components/ui/button"
import { toast } from "@/app/components/ui/use-toast"
import { cn } from "@/app/lib/utils/cn"
import CategorySelect from "../AddTransaction/CategorySelect"
import AccountSelect from "../AddTransaction/AccountSelect"

interface AddRecurringFormProps {
  onClose: () => void
}

type Frequency = "daily" | "weekly" | "monthly" | "yearly"

const frequencies: { value: Frequency; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
]

export default function AddRecurringForm({ onClose }: AddRecurringFormProps) {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [type, setType] = useState<"income" | "expense">("expense")
  const [category, setCategory] = useState("")
  const [account, setAccount] = useState("")
  const [frequency, setFrequency] = useState<Frequency>("monthly")
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0])
  const [endDate, setEndDate] = useState("")

  const handleSubmit = () => {
    if (!name.trim() || !amount || !category || !account) {
      toast({ title: "Missing fields", description: "Please fill all required fields" })
      return
    }
    toast({ title: "Recurring created", description: `${name} will repeat ${frequency}` })
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-foreground/25 backdrop-blur-[4px]"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-border/70 bg-white/95 shadow-[0_0_80px_rgba(33,49,43,0.15)] backdrop-blur-xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/40 bg-white/80 px-6 py-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
                <Repeat className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Add Recurring</h2>
                <p className="text-xs text-foreground/50">Set up automated tracking</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-foreground/50 transition hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-5 p-6">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground/40">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Netflix Subscription"
                className="w-full rounded-2xl border border-border/70 bg-background/60 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-foreground/35 focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              />
            </div>

            {/* Type + Amount */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground/40">Type</label>
                <div className="flex rounded-2xl border border-border/60 bg-background/60 p-1">
                  {(["expense", "income"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={cn(
                        "flex-1 rounded-xl py-2 text-xs font-semibold uppercase tracking-wider transition",
                        type === t
                          ? t === "income" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                          : "text-foreground/50 hover:bg-white/60"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground/40">Amount</label>
                <div className="flex items-center rounded-2xl border border-border/70 bg-background/60 px-3">
                  <span className="text-sm font-bold text-foreground/50">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-full bg-transparent px-2 py-3 text-sm text-foreground outline-none placeholder:text-foreground/35"
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground/40">Category</label>
              <CategorySelect value={category} onChange={setCategory} type={type} />
            </div>

            {/* Account */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground/40">Account</label>
              <AccountSelect value={account} onChange={setAccount} />
            </div>

            {/* Frequency */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground/40">Frequency</label>
              <div className="grid grid-cols-4 gap-2">
                {frequencies.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setFrequency(f.value)}
                    className={cn(
                      "rounded-xl border py-2.5 text-xs font-semibold uppercase tracking-wider transition",
                      frequency === f.value
                        ? "border-primary/50 bg-primary/10 text-primary"
                        : "border-border/60 bg-background/60 text-foreground/50 hover:bg-white/60 hover:text-foreground"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground/40">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-2xl border border-border/70 bg-background/60 py-3 pl-9 pr-3 text-sm text-foreground outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground/40">End Date <span className="font-normal normal-case text-foreground/35">(optional)</span></label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-2xl border border-border/70 bg-background/60 py-3 pl-9 pr-3 text-sm text-foreground outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <Button onClick={handleSubmit} className="w-full rounded-2xl py-3 shadow-lg shadow-primary/15">
                <Plus className="mr-2 h-4 w-4" />
                Create Recurring
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

