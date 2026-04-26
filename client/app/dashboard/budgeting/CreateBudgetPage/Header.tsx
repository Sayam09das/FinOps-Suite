"use client"

import { motion } from "framer-motion"
import { ArrowLeft, CalendarDays, PiggyBank } from "lucide-react"
import Link from "next/link"

interface HeaderProps {
  period?: string
}

export default function Header({ period = "Monthly" }: HeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl text-foreground/72 transition hover:bg-background/70 hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="primary-wash flex h-11 w-11 items-center justify-center rounded-2xl">
            <PiggyBank className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-[-0.03em] text-foreground md:text-3xl">
              Create Budget
            </h1>
            <p className="text-sm text-foreground/60">Set spending limits and stay on track</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-background/60 px-4 py-2.5">
        <CalendarDays className="h-4 w-4 text-foreground/50" />
        <span className="text-sm font-medium text-foreground/70">{period}</span>
      </div>
    </motion.div>
  )
}

