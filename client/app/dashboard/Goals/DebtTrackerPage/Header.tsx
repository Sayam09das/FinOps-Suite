"use client"

import { motion } from "framer-motion"
import { Shield, Plus } from "lucide-react"

import { Card, CardContent } from "@/app/components/ui/card"

interface HeaderProps {
  onAddDebt: () => void
}

export default function Header({ onAddDebt }: HeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card
        variant="surface"
        className="rounded-[1.95rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-0 backdrop-blur-xl"
      >
        <CardContent className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-500/15 text-red-600 shadow-sm">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Debt Tracker
              </h1>
              <p className="text-sm text-foreground/60">
                Manage and eliminate your debts strategically.
              </p>
            </div>
          </div>

          <button
            onClick={onAddDebt}
            className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_rgba(33,49,43,0.1)] transition-all hover:bg-primary/90 hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            Add Debt
          </button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

