"use client"

import { ListFilter } from "lucide-react"

export default function RecurringList() {
  return (
    <div className="rounded-2xl border border-dashed border-border/60 bg-background/40 py-16 text-center">
      <ListFilter className="mx-auto h-8 w-8 text-foreground/30" />
      <p className="mt-3 text-sm font-semibold text-foreground">No recurring transactions in backend</p>
      <p className="mt-2 text-sm text-foreground/50">
        Add a recurring transactions API/model to show live recurring payments here.
      </p>
    </div>
  )
}
