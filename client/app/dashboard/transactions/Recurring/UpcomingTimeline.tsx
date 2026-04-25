"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, TrendingDown, TrendingUp } from "lucide-react"

import { cn } from "@/app/lib/utils/cn"
import { CATEGORY_CONFIG } from "../AllTransactions/view-model"

interface UpcomingItem {
  id: string
  name: string
  amount: number
  category: string
  nextDate: string
  type: "income" | "expense"
}

const UPCOMING_ITEMS: UpcomingItem[] = [
  { id: "u1", name: "Mutual Fund SIP", amount: 5000, category: "Investment", nextDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], type: "expense" },
  { id: "u2", name: "Weekly Grocery", amount: 3500, category: "Food & Dining", nextDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], type: "expense" },
  { id: "u3", name: "Netflix Subscription", amount: 649, category: "Subscriptions", nextDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], type: "expense" },
  { id: "u4", name: "Salary Credit", amount: 85000, category: "Salary", nextDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], type: "income" },
  { id: "u5", name: "Spotify Premium", amount: 199, category: "Subscriptions", nextDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], type: "expense" },
  { id: "u6", name: "Monthly Rent", amount: 25000, category: "Rent", nextDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], type: "expense" },
  { id: "u7", name: "Gym Membership", amount: 1200, category: "Healthcare", nextDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], type: "expense" },
  { id: "u8", name: "AWS Bill", amount: 3500, category: "Subscriptions", nextDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], type: "expense" },
]

export default function UpcomingTimeline() {
  const now = new Date()
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  const thisWeek = useMemo(
    () => UPCOMING_ITEMS.filter((i) => new Date(i.nextDate) <= weekFromNow),
    []
  )
  const thisMonth = useMemo(
    () => UPCOMING_ITEMS.filter((i) => new Date(i.nextDate) > weekFromNow && new Date(i.nextDate) <= monthFromNow),
    []
  )

  const weekTotal = thisWeek.reduce((sum, i) => sum + (i.type === "expense" ? i.amount : -i.amount), 0)
  const monthTotal = thisMonth.reduce((sum, i) => sum + (i.type === "expense" ? i.amount : -i.amount), 0)

  return (
    <div className="panel-frost h-fit rounded-[1.8rem] border border-border/70 p-5">
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100">
          <Calendar className="h-4 w-4 text-violet-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground">Upcoming Timeline</h3>
          <p className="text-xs text-foreground/50">Scheduled payments ahead</p>
        </div>
      </div>

      {/* This Week */}
      <section className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/40">This Week</h4>
          <span className={cn("text-xs font-bold", weekTotal > 0 ? "text-rose-600" : "text-emerald-600")}>
            {weekTotal > 0 ? "-" : "+"}₹{Math.abs(weekTotal).toLocaleString("en-IN")}
          </span>
        </div>
        <div className="relative space-y-3">
          {/* Timeline line */}
          <div className="absolute left-[17px] top-2 bottom-2 w-px bg-border/60" />

          {thisWeek.map((item, i) => {
            const config = CATEGORY_CONFIG[item.category]
            const daysLeft = Math.ceil((new Date(item.nextDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative flex items-center gap-3 pl-1"
              >
                {/* Dot */}
                <div
                  className={cn(
                    "relative z-10 flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border-2",
                    item.type === "income"
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-rose-200 bg-rose-50"
                  )}
                >
                  {config ? (
                    <config.icon className="h-3.5 w-3.5" style={{ color: config.color }} />
                  ) : (
                    <Clock className="h-3.5 w-3.5 text-foreground/40" />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-foreground">{item.name}</p>
                  <p className="text-[10px] text-foreground/45">
                    {daysLeft === 0 ? "Today" : daysLeft === 1 ? "Tomorrow" : `In ${daysLeft} days`}
                  </p>
                </div>
                <p className={cn("text-xs font-bold", item.type === "income" ? "text-emerald-600" : "text-rose-600")}>
                  {item.type === "income" ? "+" : "-"}₹{item.amount.toLocaleString("en-IN")}
                </p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* This Month */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/40">This Month</h4>
          <span className={cn("text-xs font-bold", monthTotal > 0 ? "text-rose-600" : "text-emerald-600")}>
            {monthTotal > 0 ? "-" : "+"}₹{Math.abs(monthTotal).toLocaleString("en-IN")}
          </span>
        </div>
        <div className="relative space-y-3">
          <div className="absolute left-[17px] top-2 bottom-2 w-px bg-border/40" />

          {thisMonth.map((item, i) => {
            const config = CATEGORY_CONFIG[item.category]
            const daysLeft = Math.ceil((new Date(item.nextDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 + 0.2 }}
                className="relative flex items-center gap-3 pl-1"
              >
                <div
                  className={cn(
                    "relative z-10 flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border-2",
                    item.type === "income"
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-rose-200 bg-rose-50"
                  )}
                >
                  {config ? (
                    <config.icon className="h-3.5 w-3.5" style={{ color: config.color }} />
                  ) : (
                    <Clock className="h-3.5 w-3.5 text-foreground/40" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-foreground">{item.name}</p>
                  <p className="text-[10px] text-foreground/45">In {daysLeft} days</p>
                </div>
                <p className={cn("text-xs font-bold", item.type === "income" ? "text-emerald-600" : "text-rose-600")}>
                  {item.type === "income" ? "+" : "-"}₹{item.amount.toLocaleString("en-IN")}
                </p>
              </motion.div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

