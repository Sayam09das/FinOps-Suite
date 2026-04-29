"use client"

import { Calendar } from "lucide-react"

export default function UpcomingTimeline() {
  return (
    <div className="panel-frost h-fit rounded-[1.8rem] border border-border/70 p-5">
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100">
          <Calendar className="h-4 w-4 text-violet-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground">Upcoming Timeline</h3>
          <p className="text-xs text-foreground/50">Backend recurring schedule</p>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-border/60 bg-background/40 px-4 py-10 text-center">
        <p className="text-sm font-semibold text-foreground">No scheduled payments</p>
        <p className="mt-2 text-xs leading-5 text-foreground/50">
          This panel will populate when recurring transactions are stored in the database.
        </p>
      </div>
    </div>
  )
}
