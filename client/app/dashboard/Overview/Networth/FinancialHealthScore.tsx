"use client"

import React, { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { HeartPulse } from "lucide-react"

import { Card } from "@/app/components/ui/card"
import { cn } from "@/app/lib/utils/cn"

interface FinancialHealthScoreProps {
  score: number
}

function CircularProgress({ score }: { score: number }) {
  const [displayScore, setDisplayScore] = useState(0)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 60,
  })

  useEffect(() => {
    motionValue.set(score)
  }, [score, motionValue])

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayScore(Math.round(latest))
    })
    return () => unsubscribe()
  }, [springValue])

  const radius = 52
  const circumference = 2 * Math.PI * radius
  const progress = (displayScore / 100) * circumference

  const getColor = () => {
    if (score >= 80) return "#2f7d67"
    if (score >= 60) return "#d0a24d"
    if (score >= 40) return "#d27768"
    return "#c66a6a"
  }

  const getLabel = () => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Needs Work"
  }

  const color = getColor()

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative h-32 w-32">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="rgba(211,221,210,0.5)"
            strokeWidth="10"
          />
          {/* Progress circle */}
          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground">{displayScore}</span>
          <span className="text-[10px] font-medium text-foreground/50">/ 100</span>
        </div>
      </div>
      <div
        className={cn(
          "mt-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold",
          score >= 80
            ? "bg-emerald-100 text-emerald-800"
            : score >= 60
            ? "bg-amber-100 text-amber-800"
            : score >= 40
            ? "bg-orange-100 text-orange-800"
            : "bg-rose-100 text-rose-800"
        )}
      >
        <HeartPulse className="h-3 w-3" />
        {getLabel()}
      </div>
    </div>
  )
}

export default function FinancialHealthScore({ score }: FinancialHealthScoreProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
    >
      <Card variant="surface" padding="lg" className="flex flex-col items-center justify-center text-center">
        <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
          Financial Health Score
        </h3>
        <p className="mt-0.5 text-sm text-foreground/55">
          Overall wellness rating
        </p>

        <div className="mt-5">
          <CircularProgress score={score} />
        </div>

        <div className="mt-4 w-full space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-foreground/50">Asset Coverage</span>
            <span className="font-semibold text-emerald-700">Strong</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/40">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "85%" }}
              transition={{ delay: 0.8, duration: 1 }}
              className="h-full rounded-full bg-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-foreground/50">Debt Ratio</span>
            <span className="font-semibold text-amber-700">Moderate</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/40">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "60%" }}
              transition={{ delay: 1, duration: 1 }}
              className="h-full rounded-full bg-amber-500"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-foreground/50">Growth Momentum</span>
            <span className="font-semibold text-emerald-700">Positive</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/40">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "72%" }}
              transition={{ delay: 1.2, duration: 1 }}
              className="h-full rounded-full bg-emerald-500"
            />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

