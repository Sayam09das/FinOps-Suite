"use client"

import { motion } from "framer-motion"
import { Coins, Users, Wallet } from "lucide-react"
import { formatCurrency } from "@/app/lib/utils/number"

interface SummaryProps {
  totalSharedBalance: number
  totalMembers: number
  yourShare: number
  currency: string
}

export default function Summary({ totalSharedBalance, totalMembers, yourShare, currency }: SummaryProps) {
  const items = [
    {
      label: "Total Shared Balance",
      value: formatCurrency(totalSharedBalance, currency),
      icon: Coins,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Number of Members",
      value: totalMembers.toString(),
      icon: Users,
      color: "bg-sky-100 text-sky-600",
    },
    {
      label: "Your Share",
      value: formatCurrency(yourShare, currency),
      icon: Wallet,
      color: "bg-emerald-100 text-emerald-600",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-3xl border border-border/60 bg-background/60 p-6 shadow-sm backdrop-blur-sm"
    >
      <div className="grid gap-6 sm:grid-cols-3">
        {items.map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + idx * 0.08 }}
            className="flex items-start gap-3"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.color}`}>
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-foreground/50">
                {item.label}
              </p>
              <p className="mt-1 text-2xl font-bold text-foreground">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
