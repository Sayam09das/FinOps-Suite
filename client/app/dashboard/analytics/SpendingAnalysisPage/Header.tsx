"use client"

import { motion } from "framer-motion"
import { Download, FileSpreadsheet, FileText, Share2 } from "lucide-react"
import { useState } from "react"

import { Card, CardContent } from "@/app/components/ui/card"
import { cn } from "@/app/lib/utils/cn"

const exportOptions = [
  { label: "Export CSV", icon: FileSpreadsheet, value: "csv" },
  { label: "Export PDF", icon: FileText, value: "pdf" },
  { label: "Share Report", icon: Share2, value: "share" },
]

export default function Header() {
  const [open, setOpen] = useState(false)

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
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Spending Analysis
            </h1>
            <p className="text-sm text-foreground/60">
              Track, analyze, and optimize your spending habits.
            </p>
          </div>

          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all",
                "border-border/80 bg-background/75 text-foreground/80 hover:bg-white/90 hover:shadow-md",
                open && "bg-white shadow-md ring-2 ring-primary/20"
              )}
            >
              <Download className="h-4 w-4" />
              Export
            </button>

            {open && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-border/80 bg-white/95 p-1.5 shadow-[0_20px_60px_rgba(33,49,43,0.14)] backdrop-blur-xl"
              >
                {exportOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    <opt.icon className="h-4 w-4" />
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

