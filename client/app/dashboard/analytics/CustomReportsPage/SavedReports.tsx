"use client"

import { motion } from "framer-motion"
import { Play, Pencil, Trash2, FileText, Clock } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { cn } from "@/app/lib/utils/cn"
import type { SavedReport } from "./types"

interface SavedReportsProps {
  reports: SavedReport[]
  onRun: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function SavedReports({ reports, onRun, onEdit, onDelete }: SavedReportsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
    >
      <Card
        variant="surface"
        className="rounded-[1.95rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-0 backdrop-blur-xl"
      >
        <CardHeader className="border-b border-border/70 px-5 py-5">
          <CardTitle className="text-xl">Saved Reports</CardTitle>
          <CardDescription>Quick access to your frequently used reports.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 px-5 py-5">
          {reports.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-border/80 bg-background/55 px-6 py-10 text-center">
              <p className="text-base font-semibold text-foreground">No saved reports yet</p>
              <p className="mt-2 text-sm text-foreground/58">
                Build a report and save it for quick access later.
              </p>
            </div>
          ) : (
            reports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.25 + index * 0.06 }}
                className="flex flex-col gap-4 rounded-[1.2rem] border border-border/60 bg-background/60 p-4 transition-colors hover:bg-background/90 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{report.name}</p>
                    <p className="text-xs text-foreground/55">{report.description}</p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-foreground/50">
                      <Clock className="h-3 w-3" />
                      Last run {report.lastRun}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRun(report.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all",
                      "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    <Play className="h-3.5 w-3.5" />
                    Run
                  </button>
                  <button
                    onClick={() => onEdit(report.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background/75 px-3 py-2 text-xs font-semibold text-foreground/80 transition-all hover:bg-white/90"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(report.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition-all hover:bg-red-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

