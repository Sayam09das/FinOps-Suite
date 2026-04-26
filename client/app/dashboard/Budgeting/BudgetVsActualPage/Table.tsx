"use client"

import { motion } from "framer-motion"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { formatCurrency } from "@/app/lib/utils/number"
import type { Budget } from "../types"

interface TableProps {
  budgets: Budget[]
}

export default function Table({ budgets }: TableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="rounded-3xl border border-border/60 bg-background/60 p-6 shadow-sm backdrop-blur-sm"
    >
      <h2 className="mb-5 text-lg font-semibold text-foreground">Budget Breakdown</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/40 text-left text-xs font-semibold uppercase tracking-wider text-foreground/50">
              <th className="pb-3 pl-2">Category</th>
              <th className="pb-3 text-right">Budget</th>
              <th className="pb-3 text-right">Spent</th>
              <th className="pb-3 text-right">Difference</th>
              <th className="pb-3 text-right pr-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {budgets.map((b, i) => {
              const diff = b.budgetAmount - b.spentAmount
              const isOver = diff < 0

              return (
                <motion.tr
                  key={b.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="group hover:bg-background/40"
                >
                  <td className="py-3.5 pl-2 text-sm font-medium text-foreground">{b.category}</td>
                  <td className="py-3.5 text-right text-sm text-foreground/70">
                    {formatCurrency(b.budgetAmount, b.currency, "en-IN")}
                  </td>
                  <td className="py-3.5 text-right text-sm text-foreground/70">
                    {formatCurrency(b.spentAmount, b.currency, "en-IN")}
                  </td>
                  <td className="py-3.5 text-right">
                    <span className={`inline-flex items-center gap-1 text-sm font-semibold ${isOver ? "text-rose-500" : "text-emerald-600"}`}>
                      {isOver ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                      {formatCurrency(Math.abs(diff), b.currency, "en-IN")}
                    </span>
                  </td>
                  <td className="py-3.5 pr-2 text-right">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      isOver
                        ? "bg-rose-50 text-rose-600"
                        : diff > b.budgetAmount * 0.3
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    }`}>
                      {isOver ? "Over" : diff > b.budgetAmount * 0.3 ? "Under" : "Caution"}
                    </span>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

