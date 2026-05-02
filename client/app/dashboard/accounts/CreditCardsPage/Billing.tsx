"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Calendar, Clock, CreditCard, Receipt } from "lucide-react"
import { formatCurrency } from "@/app/lib/utils/number"
import type { CreditCard as CreditCardType } from "../../accounts/types"

interface BillingProps {
  cards: CreditCardType[]
}

function getDaysUntilDue(dueDate: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dueDate)
  due.setHours(0, 0, 0, 0)
  const diffMs = due.getTime() - today.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

function formatDueDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function Billing({ cards }: BillingProps) {
  const cardsWithDueInfo = cards.map((card) => ({
    ...card,
    daysUntilDue: getDaysUntilDue(card.dueDate),
  }))

  const upcomingDueCards = cardsWithDueInfo.filter((c) => c.daysUntilDue <= 7 && c.daysUntilDue >= 0)
  const sortedCards = [...cardsWithDueInfo].sort((a, b) => a.daysUntilDue - b.daysUntilDue)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="mb-4 flex items-center gap-2">
        <Receipt className="h-5 w-5 text-foreground/70" />
        <h2 className="text-lg font-semibold text-foreground">Billing & Due Dates</h2>
      </div>

      {/* Alert Banner */}
      {upcomingDueCards.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
              Upcoming Due Dates
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-300/80">
              {upcomingDueCards.length} card{upcomingDueCards.length > 1 ? "s" : ""} due within 7 days
            </p>
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        {sortedCards.map((card, index) => {
          const isUrgent = card.daysUntilDue <= 7 && card.daysUntilDue >= 0
          const isOverdue = card.daysUntilDue < 0

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className={`flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
                isUrgent
                  ? "border-amber-200 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/20"
                  : isOverdue
                    ? "border-red-200 bg-red-50/50 dark:border-red-900/30 dark:bg-red-950/20"
                    : "border-border/60 bg-background/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    isUrgent
                      ? "bg-amber-100 text-amber-600"
                      : isOverdue
                        ? "bg-red-100 text-red-600"
                        : "bg-primary/10 text-primary"
                  }`}
                >
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{card.cardName}</p>
                  <p className="text-xs text-foreground/50">{card.bankName}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 sm:text-right">
                <div>
                  <div className="flex items-center gap-1 text-xs text-foreground/50 sm:justify-end">
                    <Calendar className="h-3 w-3" />
                    Due Date
                  </div>
                  <p className={`text-sm font-semibold ${isOverdue ? "text-red-600" : "text-foreground"}`}>
                    {formatDueDate(card.dueDate)}
                  </p>
                  {isUrgent && (
                    <p className="text-xs font-medium text-amber-600">
                      {card.daysUntilDue === 0 ? "Due today" : `${card.daysUntilDue} day${card.daysUntilDue > 1 ? "s" : ""} left`}
                    </p>
                  )}
                  {isOverdue && (
                    <p className="text-xs font-medium text-red-600">
                      {Math.abs(card.daysUntilDue)} day{Math.abs(card.daysUntilDue) > 1 ? "s" : ""} overdue
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1 text-xs text-foreground/50 sm:justify-end">
                    <Receipt className="h-3 w-3" />
                    Min. Due
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {formatCurrency(card.minimumDue, card.currency)}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-xs text-foreground/50 sm:justify-end">
                    <Clock className="h-3 w-3" />
                    Last Payment
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {card.lastPaymentDate ? formatDueDate(card.lastPaymentDate) : "—"}
                  </p>
                  {card.lastPaymentAmount && (
                    <p className="text-xs text-foreground/50">
                      {formatCurrency(card.lastPaymentAmount, card.currency)}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
