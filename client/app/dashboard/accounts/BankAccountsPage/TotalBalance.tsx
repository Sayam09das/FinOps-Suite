"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Wallet } from "lucide-react"
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts"

import { formatCurrency } from "@/app/lib/utils/number"

interface TotalBalanceProps {
  total: number
  changePercent: number
  history: { date: string; balance: number }[]
  currency?: string
}

export default function TotalBalance({ total, changePercent, history, currency = "INR" }: TotalBalanceProps) {
  const isPositive = changePercent >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="surface-card rounded-[1.95rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-6 backdrop-blur-xl"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="primary-wash flex h-12 w-12 items-center justify-center rounded-2xl">
            <Wallet className="h-6 w-6 text-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground/60">Total Bank Balance</p>
            <p className="mt-1 text-4xl font-semibold tracking-[-0.04em] text-foreground">
              {formatCurrency(total, currency, "en-IN")}
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold">
              {isPositive ? (
                <>
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700">+{changePercent.toFixed(1)}% vs last month</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3.5 w-3.5 text-rose-600" />
                  <span className="text-rose-700">{changePercent.toFixed(1)}% vs last month</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="h-24 w-full lg:w-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id="totalBalanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                formatter={(value: number) => [formatCurrency(value, currency, "en-IN"), "Balance"]}
                contentStyle={{ borderRadius: "1rem", border: "1px solid #e5e7eb" }}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#totalBalanceGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}
