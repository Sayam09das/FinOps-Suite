"use client"

import React, { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { Telescope, TrendingUp } from "lucide-react"

import { Card } from "@/app/components/ui/card"
import { formatCurrency } from "@/app/lib/utils/number"

interface FutureProjectionProps {
  currentNetWorth: number
  futureValue: number
  months: number
  confidence: number
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 60,
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

export default function FutureProjection({
  currentNetWorth,
  futureValue,
  months,
  confidence,
}: FutureProjectionProps) {
  const growth = futureValue - currentNetWorth
  const growthPercent = ((growth / currentNetWorth) * 100).toFixed(1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
    >
      <Card variant="surface" padding="lg">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
              Future Projection
            </h3>
            <p className="mt-0.5 text-sm text-foreground/55">
              Where you could be in {months} months
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <Telescope className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-medium text-foreground/50">Current</p>
              <p className="text-xl font-bold text-foreground">
                {formatCurrency(currentNetWorth, "INR", "en-IN")}
              </p>
            </div>
            <div className="flex items-center gap-1 text-emerald-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-bold">+{growthPercent}%</span>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-foreground/50">Projected</p>
              <p className="text-xl font-bold text-emerald-700">
                <AnimatedNumber value={futureValue} />
              </p>
            </div>
          </div>

          {/* Projection bar */}
          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-border/40">
            <div className="flex h-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
                className="relative h-full rounded-full bg-linear-to-r from-emerald-500 to-violet-500"
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4, duration: 0.5 }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 shadow-lg">
                    <Telescope className="h-3 w-3 text-white" />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Growth breakdown */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-emerald-200/50 bg-emerald-50/40 p-3">
              <p className="text-xs text-foreground/50">Expected Growth</p>
              <p className="mt-0.5 text-sm font-bold text-emerald-700">
                +{formatCurrency(growth, "INR", "en-IN").replace("₹", "")}
              </p>
            </div>
            <div className="rounded-xl border border-violet-200/50 bg-violet-50/40 p-3">
              <p className="text-xs text-foreground/50">Confidence</p>
              <p className="mt-0.5 text-sm font-bold text-violet-700">{confidence}%</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

