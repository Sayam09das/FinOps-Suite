"use client"

import { motion } from "framer-motion"
import { ArrowLeftRight } from "lucide-react"

import { Card, CardContent } from "@/app/components/ui/card"

export default function Header() {
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
        <CardContent className="flex items-center gap-4 px-6 py-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-sm">
            <ArrowLeftRight className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Income vs Expense
            </h1>
            <p className="text-sm text-foreground/60">
              Compare your income and expenses over time.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

