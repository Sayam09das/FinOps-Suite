"use client"

import React, { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown, Landmark, Wallet } from "lucide-react"

import { Card } from "@/app/components/ui/card"
import { cn } from "@/app/lib/utils/cn"
import { formatCurrency } from "@/app/lib/utils/number"

import type { NetWorthData } from "./types"

function AnimatedNumber({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 80,
    duration: duration * 1000,
  })

  useEffect(() => {
    motionValue.set(value)
  }, [value, motionValue])

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplay(Math.round(latest))
    })
    return () => unsubscribe()
  }, [springValue])

  return <span>{formatCurrency(display, "INR", "en-IN")}</span>
}

interface NetWorthCardProps {
  data: NetWorthData
}

export default function NetWorthCard({ data }: NetWorthCardProps) {
  const isPositive = data.changeDirection === "up"
  const changeColor = isPositive ? "text-emerald-600" : "text-rose-500"
  const changeBg = isPositive ? "bg-emerald-50" : "bg-rose-50"
  const ChangeIcon = isPositive ? ArrowUp : ArrowDown

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card
        variant="frosted"
        padding="lg"
        className="relative overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-emerald-200/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-rose-200/15 blur-3xl" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground/60">Total Net Worth</p>
              <h2 className="mt-1 text-4xl font-bold tracking-[-0.04em] text-foreground sm:text-5xl">
                <AnimatedNumber value={data.totalNetWorth} />
              </h2>
            </div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold",
                changeBg,
                changeColor
              )}
            >
              <ChangeIcon className="h-4 w-4" />
              {isPositive ? "+" : "-"}₹{formatCurrency(data.changeAmount, "INR", "en-IN").replace("₹", "")}
              <span className="text-foreground/50">({isPositive ? "↑" : "↓"} {data.changePercent}% this month)</span>
            </motion.div>
          </div>

          {/* Asset / Liability Breakdown */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="rounded-2xl border border-emerald-200/50 bg-emerald-50/60 p-4 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Landmark className="h-4.5 w-4.5" />
                </div>
                <span className="text-sm font-medium text-foreground/70">Assets</span>
              </div>
              <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-700">
                ₹{formatCurrency(data.totalAssets, "INR", "en-IN").replace("₹", "")}
              </p>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-emerald-200/40">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full bg-emerald-500"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="rounded-2xl border border-rose-200/50 bg-rose-50/60 p-4 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                  <Wallet className="h-4.5 w-4.5" />
                </div>
                <span className="text-sm font-medium text-foreground/70">Liabilities</span>
              </div>
              <p className="mt-2 text-2xl font-bold tracking-tight text-rose-600">
                -₹{formatCurrency(data.totalLiabilities, "INR", "en-IN").replace("₹", "")}
              </p>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-rose-200/40">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(data.totalLiabilities / data.totalAssets) * 100}%` }}
                  transition={{ delay: 0.9, duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full bg-rose-500"
                />
              </div>
            </motion.div>
          </div>

          {/* Ratio indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-5 flex items-center gap-2 text-xs text-foreground/50"
          >
            {isPositive ? (
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
            )}
            <span>
              Net worth is <span className={cn("font-semibold", changeColor)}>{isPositive ? "growing" : "declining"}</span>. 
              Assets are {(data.totalAssets / data.totalLiabilities).toFixed(1)}× liabilities.
            </span>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  )
}

