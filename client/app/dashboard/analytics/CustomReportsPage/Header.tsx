"use client"

import { motion } from "framer-motion"
import { FileText, Plus } from "lucide-react"

import { Card, CardContent } from "@/app/components/ui/card"

interface HeaderProps {
  onCreateReport?: () => void
}

export default function Header({ onCreateReport }: HeaderProps) {
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
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-sm">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Custom Reports
              </h1>
              <p className="text-sm text-foreground/60">
                Build, save, and export personalized financial reports.
              </p>
            </div>
          </div>

          <button
            onClick={onCreateReport}
            className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/75 px-5 py-2.5 text-sm font-semibold text-foreground/80 transition-all hover:bg-white/90 hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            Create Report
          </button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

