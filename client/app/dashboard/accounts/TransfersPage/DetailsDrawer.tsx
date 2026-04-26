"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  ArrowRightLeft,
  Banknote,
  Calendar,
  CheckCircle2,
  Clock,
  Landmark,
  MessageSquare,
  Pencil,
  Trash2,
  Wallet,
  X,
  XCircle,
} from "lucide-react"
import { demoTransfers } from "../../accounts/demo-data"
import { formatCurrency } from "@/app/lib/utils/number"

interface DetailsDrawerProps {
  transferId: string | null
  onClose: () => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

const statusConfig = {
  completed: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/20", label: "Completed", border: "border-emerald-200 dark:border-emerald-900/30" },
  pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/20", label: "Pending", border: "border-amber-200 dark:border-amber-900/30" },
  failed: { icon: XCircle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/20", label: "Failed", border: "border-red-200 dark:border-red-900/30" },
}

export default function DetailsDrawer({ transferId, onClose, onEdit, onDelete }: DetailsDrawerProps) {
  const transfer = demoTransfers.find((t) => t.id === transferId)

  if (!transfer) return null

  const status = statusConfig[transfer.status]
  const StatusIcon = status.icon

  return (
    <AnimatePresence>
      {transferId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-full max-w-md flex-col border-l border-border/60 bg-background shadow-2xl"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <ArrowRightLeft className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Transfer Details</h2>
                  <p className="text-xs text-foreground/50">ID: {transfer.id}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-foreground/60 transition hover:bg-background/70 hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              {/* Status Badge */}
              <div className={`flex items-center gap-2 rounded-2xl border ${status.border} ${status.bg} px-4 py-3`}>
                <StatusIcon className={`h-5 w-5 ${status.color}`} />
                <span className={`text-sm font-semibold ${status.color}`}>{status.label}</span>
              </div>

              {/* Amount */}
              <div className="rounded-2xl border border-border/60 bg-background/60 p-5">
                <div className="flex items-center gap-2 text-sm text-foreground/50">
                  <Banknote className="h-4 w-4" />
                  Amount
                </div>
                <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                  {formatCurrency(transfer.amount, transfer.currency)}
                </p>
                {transfer.fee !== undefined && transfer.fee > 0 && (
                  <p className="mt-1 text-sm text-foreground/50">
                    Fee: {formatCurrency(transfer.fee, transfer.currency)}
                  </p>
                )}
              </div>

              {/* From → To */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground/70">Transfer Route</p>
                <div className="flex items-center gap-3">
                  <div className="flex flex-1 items-center gap-3 rounded-2xl border border-border/60 bg-background/60 p-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                      <Landmark className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{transfer.fromAccountName}</p>
                      <p className="text-xs capitalize text-foreground/50">{transfer.fromAccountType}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-foreground/30" />
                  <div className="flex flex-1 items-center gap-3 rounded-2xl border border-border/60 bg-background/60 p-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                      <Wallet className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{transfer.toAccountName}</p>
                      <p className="text-xs capitalize text-foreground/50">{transfer.toAccountType}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/60 p-4">
                <Calendar className="h-5 w-5 text-foreground/50" />
                <div>
                  <p className="text-xs text-foreground/50">Date</p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(transfer.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {transfer.notes && (
                <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/60 p-4">
                  <MessageSquare className="mt-0.5 h-5 w-5 text-foreground/50" />
                  <div>
                    <p className="text-xs text-foreground/50">Notes</p>
                    <p className="text-sm font-medium text-foreground">{transfer.notes}</p>
                  </div>
                </div>
              )}

              {/* Linked Transactions Placeholder */}
              <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                <p className="text-xs font-medium text-foreground/50">Linked Transactions</p>
                <p className="mt-1 text-sm text-foreground/40">No linked transactions found.</p>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="flex gap-3 border-t border-border/60 px-6 py-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onEdit?.(transfer.id)}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border/80 bg-background py-2.5 text-sm font-semibold text-foreground transition hover:bg-background/80"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onDelete?.(transfer.id)}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-900/30 dark:bg-red-950/20 dark:hover:bg-red-950/30"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

