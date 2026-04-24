"use client"

import React from "react"
import { motion } from "framer-motion"
import { Plus, Minus, RefreshCw, Calculator, TrendingUp, PiggyBank } from "lucide-react"

import { Card } from "@/app/components/ui/card"
import { cn } from "@/app/lib/utils/cn"

interface ActionButtonProps {
  icon: React.ElementType
  label: string
  description: string
  color: string
  hoverColor: string
  onClick?: () => void
  delay?: number
}

function ActionButton({
  icon: Icon,
  label,
  description,
  color,
  hoverColor,
  onClick,
  delay = 0,
}: ActionButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.5 + delay, duration: 0.35 }}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all",
        "border-border/60 bg-background/50 hover:shadow-lg",
        hoverColor
      )}
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm transition-transform group-hover:scale-110"
        style={{ backgroundColor: color }}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-foreground/50">{description}</p>
      </div>
    </motion.button>
  )
}

export default function QuickActions() {
  const actions: Omit<ActionButtonProps, "delay">[] = [
    {
      icon: Plus,
      label: "Add Asset",
      description: "Log a new bank, investment, or property",
      color: "#2f7d67",
      hoverColor: "hover:border-emerald-200/80 hover:bg-emerald-50/40",
    },
    {
      icon: Minus,
      label: "Add Liability",
      description: "Record a loan, credit card, or EMI",
      color: "#d27768",
      hoverColor: "hover:border-rose-200/80 hover:bg-rose-50/40",
    },
    {
      icon: RefreshCw,
      label: "Update Balance",
      description: "Sync latest account balances",
      color: "#5687cc",
      hoverColor: "hover:border-blue-200/80 hover:bg-blue-50/40",
    },
    {
      icon: Calculator,
      label: "Debt Simulator",
      description: "Model payoff timelines & savings",
      color: "#8d6ad8",
      hoverColor: "hover:border-violet-200/80 hover:bg-violet-50/40",
    },
    {
      icon: TrendingUp,
      label: "Add Investment",
      description: "Track stocks, mutual funds, crypto",
      color: "#d0a24d",
      hoverColor: "hover:border-amber-200/80 hover:bg-amber-50/40",
    },
    {
      icon: PiggyBank,
      label: "Set Savings Goal",
      description: "Create a target & auto-track progress",
      color: "#4f9e96",
      hoverColor: "hover:border-teal-200/80 hover:bg-teal-50/40",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
    >
      <Card variant="surface" padding="lg">
        <div>
          <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
            Quick Actions
          </h3>
          <p className="mt-0.5 text-sm text-foreground/55">
            Manage your wealth in one tap
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {actions.map((action, index) => (
            <ActionButton key={action.label} {...action} delay={index * 0.06} />
          ))}
        </div>
      </Card>
    </motion.div>
  )
}

