"use client"

import { motion } from "framer-motion"
import { Banknote, Pencil, Receipt } from "lucide-react"

interface PaymentsProps {
  onPayBill?: () => void
  onRecordPayment?: () => void
  onEditLimit?: () => void
}

export default function Payments({ onPayBill, onRecordPayment, onEditLimit }: PaymentsProps) {
  const actions = [
    {
      label: "Pay Bill",
      description: "Make a payment towards your outstanding balance",
      icon: Banknote,
      onClick: onPayBill,
      variant: "primary" as const,
    },
    {
      label: "Record Payment",
      description: "Log a payment you've already made",
      icon: Receipt,
      onClick: onRecordPayment,
      variant: "secondary" as const,
    },
    {
      label: "Edit Limit",
      description: "Update your credit limit for any card",
      icon: Pencil,
      onClick: onEditLimit,
      variant: "secondary" as const,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="mb-4 flex items-center gap-2">
        <Banknote className="h-5 w-5 text-foreground/70" />
        <h2 className="text-lg font-semibold text-foreground">Payment Actions</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {actions.map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.onClick}
            className={`flex flex-col items-start gap-2 rounded-2xl border p-5 text-left transition-shadow hover:shadow-md ${
              action.variant === "primary"
                ? "border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/30"
                : "border-border/60 bg-background/60 hover:bg-background/80"
            }`}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                action.variant === "primary"
                  ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40"
                  : "bg-primary/10 text-primary"
              }`}
            >
              <action.icon className="h-5 w-5" />
            </div>
            <div>
              <p
                className={`font-semibold ${
                  action.variant === "primary" ? "text-emerald-700 dark:text-emerald-300" : "text-foreground"
                }`}
              >
                {action.label}
              </p>
              <p className="mt-0.5 text-xs text-foreground/50">{action.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

