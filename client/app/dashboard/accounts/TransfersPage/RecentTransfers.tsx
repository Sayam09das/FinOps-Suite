"use client"

import { motion } from "framer-motion"
import { ArrowRight, ArrowRightLeft, CheckCircle2, Clock, XCircle, Loader2 } from "lucide-react"
import { useRecentTransfers, type Transfer } from "@/app/features/transfers"
import { formatCurrency } from "@/app/lib/utils/number"

interface RecentTransfersProps {
  onSelectTransfer?: (id: string) => void
}

const statusConfig = {
  completed: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/20", label: "Completed" },
  pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/20", label: "Pending" },
  failed: { icon: XCircle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/20", label: "Failed" },
}

export default function RecentTransfers({ onSelectTransfer }: RecentTransfersProps) {
  const { data: transfers, isLoading, error } = useRecentTransfers(10)

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="mb-4 flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5 text-foreground/70" />
          <h2 className="text-lg font-semibold text-foreground">Recent Transfers</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </motion.div>
    )
  }

  if (error || !transfers || transfers.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="mb-4 flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5 text-foreground/70" />
          <h2 className="text-lg font-semibold text-foreground">Recent Transfers</h2>
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 py-8 text-center">
          <ArrowRightLeft className="h-8 w-8 text-foreground/20" />
          <p className="mt-2 text-sm font-medium text-foreground/50">No transfers yet</p>
          <p className="text-xs text-foreground/40">Create a transfer to see it here</p>
        </div>
      </motion.div>
    )
  }

  const sorted = [...transfers].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="mb-4 flex items-center gap-2">
        <ArrowRightLeft className="h-5 w-5 text-foreground/70" />
        <h2 className="text-lg font-semibold text-foreground">Recent Transfers</h2>
        <span className="ml-2 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {sorted.length}
        </span>
      </div>

      <div className="space-y-2">
        {sorted.map((transfer, index) => {
          const status = statusConfig[transfer.status]
          const StatusIcon = status.icon

          return (
            <motion.button
              key={transfer.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
              whileHover={{ scale: 1.005, x: 2 }}
              whileTap={{ scale: 0.995 }}
              onClick={() => onSelectTransfer?.(transfer.id)}
              className="flex w-full flex-col gap-2 rounded-2xl border border-border/60 bg-background/60 p-4 text-left transition hover:bg-background/80 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              {/* From → To */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <ArrowRightLeft className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <span>{transfer.fromAccountName || "Unknown"}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-foreground/30" />
                    <span>{transfer.toAccountName || "Unknown"}</span>
                  </div>
                  <p className="text-xs text-foreground/50">
                    {new Date(transfer.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    {transfer.notes && ` · ${transfer.notes}`}
                  </p>
                </div>
              </div>

              {/* Amount & Status */}
              <div className="flex items-center gap-4 sm:text-right">
                <div>
                  <p className="text-sm font-bold text-foreground">
                    {formatCurrency(transfer.amount, transfer.currency)}
                  </p>
                  {transfer.fee && transfer.fee > 0 && (
                    <p className="text-xs text-foreground/40">Fee: {formatCurrency(transfer.fee, transfer.currency)}</p>
                  )}
                </div>
                <div className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${status.bg} ${status.color}`}>
                  <StatusIcon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{status.label}</span>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
