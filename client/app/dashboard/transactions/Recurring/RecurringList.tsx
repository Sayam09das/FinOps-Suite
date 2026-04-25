"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ListFilter, Search } from "lucide-react"

import { cn } from "@/app/lib/utils/cn"
import { toast } from "@/app/components/ui/use-toast"
import RecurringItem, { type RecurringTransaction } from "./RecurringItem"

const MOCK_RECURRING: RecurringTransaction[] = [
  { id: "rec_1", name: "Netflix Subscription", amount: 649, category: "Subscriptions", account: "Credit Card", frequency: "monthly", nextDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], status: "active", type: "expense" },
  { id: "rec_2", name: "Monthly Rent", amount: 25000, category: "Rent", account: "Primary Bank", frequency: "monthly", nextDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], status: "active", type: "expense" },
  { id: "rec_3", name: "Spotify Premium", amount: 199, category: "Subscriptions", account: "Credit Card", frequency: "monthly", nextDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], status: "active", type: "expense" },
  { id: "rec_4", name: "Salary Credit", amount: 85000, category: "Salary", account: "Primary Bank", frequency: "monthly", nextDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], status: "active", type: "income" },
  { id: "rec_5", name: "Gym Membership", amount: 1200, category: "Healthcare", account: "Credit Card", frequency: "monthly", nextDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], status: "paused", type: "expense" },
  { id: "rec_6", name: "AWS Bill", amount: 3500, category: "Subscriptions", account: "Credit Card", frequency: "monthly", nextDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], status: "active", type: "expense" },
  { id: "rec_7", name: "Mutual Fund SIP", amount: 5000, category: "Investment", account: "Primary Bank", frequency: "monthly", nextDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], status: "active", type: "expense" },
  { id: "rec_8", name: "Weekly Grocery", amount: 3500, category: "Food & Dining", account: "Cash Wallet", frequency: "weekly", nextDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], status: "active", type: "expense" },
]

type FilterTab = "all" | "active" | "paused"

export default function RecurringList() {
  const [filter, setFilter] = useState<FilterTab>("all")
  const [search, setSearch] = useState("")
  const [items, setItems] = useState(MOCK_RECURRING)

  const filtered = useMemo(() => {
    let result = items
    if (filter !== "all") result = result.filter((i) => i.status === filter)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      )
    }
    return result.sort(
      (a, b) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime()
    )
  }, [items, filter, search])

  const handleToggleStatus = (id: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, status: i.status === "active" ? "paused" : "active" as const }
          : i
      )
    )
    const item = items.find((i) => i.id === id)
    toast({
      title: item?.status === "active" ? "Paused" : "Activated",
      description: `${item?.name} is now ${item?.status === "active" ? "paused" : "active"}`,
    })
  }

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
    toast({ title: "Deleted", description: "Recurring transaction removed" })
  }

  const handleEdit = (item: RecurringTransaction) => {
    toast({ title: "Edit mode", description: `Editing ${item.name} — coming soon` })
  }

  return (
    <div className="space-y-4">
      {/* Tabs + Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-2xl border border-border/60 bg-background/60 p-1">
          {(["all", "active", "paused"] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={cn(
                "rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition",
                filter === tab
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground/50 hover:bg-white/60 hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-background/60 px-3 py-2">
          <Search className="h-4 w-4 text-foreground/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recurring..."
            className="bg-transparent text-sm outline-none placeholder:text-foreground/35"
          />
        </div>
      </div>

      {/* List */}
      <motion.div layout className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((item) => (
            <RecurringItem
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
            />
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border/60 bg-background/40 py-12 text-center">
            <ListFilter className="mx-auto h-8 w-8 text-foreground/30" />
            <p className="mt-3 text-sm font-medium text-foreground/50">No recurring transactions found</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

