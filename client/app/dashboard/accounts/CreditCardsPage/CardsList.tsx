"use client"

import { motion } from "framer-motion"
import { Landmark, Trash2 } from "lucide-react"
import { formatCurrency } from "@/app/lib/utils/number"
import type { CreditCard as CreditCardType } from "../../accounts/types"

interface CardsListProps {
  cards: CreditCardType[]
  onDelete?: (id: string) => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function CardsList({ cards, onDelete }: CardsListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="mb-4 flex items-center gap-2">
        <svg
          className="h-5 w-5 text-foreground/70"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
        <h2 className="text-lg font-semibold text-foreground">Your Cards</h2>
        <span className="ml-2 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {cards.length}
        </span>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2"
      >
        {cards.map((card) => {
          const available = card.limit - card.used
          const utilization = (card.used / card.limit) * 100

          return (
            <motion.div
              key={card.id}
              variants={cardVariants}
              whileHover={{ scale: 1.01, y: -2 }}
              className="group relative overflow-hidden rounded-3xl border border-border/60 bg-background/60 p-5 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md"
            >
              {/* Card Header */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Landmark className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{card.cardName}</h3>
                    <p className="text-xs text-foreground/50">{card.bankName}</p>
                  </div>
                </div>
                <div className="rounded-lg bg-primary/5 px-2 py-1 text-xs font-medium text-foreground/70">
                  **** {card.cardNumberLast4}
                </div>
              </div>

              {/* Card Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-xs text-foreground/50">Limit</p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatCurrency(card.limit, card.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-foreground/50">Used</p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatCurrency(card.used, card.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-foreground/50">Available</p>
                  <p className="text-sm font-semibold text-emerald-600">
                    {formatCurrency(available, card.currency)}
                  </p>
                </div>
              </div>

              {/* Mini Progress Bar */}
              <div className="mt-4">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/40">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(utilization, 100)}%` }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className={`h-full rounded-full ${
                      utilization >= 80
                        ? "bg-red-500"
                        : utilization >= 50
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                    }`}
                  />
                </div>
                <div className="mt-1 flex justify-between">
                  <span className="text-xs text-foreground/40">{utilization.toFixed(0)}% used</span>
                  <span
                    className={`text-xs font-medium ${
                      utilization >= 80
                        ? "text-red-500"
                        : utilization >= 50
                          ? "text-amber-500"
                          : "text-emerald-500"
                    }`}
                  >
                    {utilization >= 80 ? "High" : utilization >= 50 ? "Moderate" : "Low"}
                  </span>
                </div>
              </div>

              {/* Delete Button */}
              {onDelete && (
                <button
                  onClick={() => onDelete(card.id)}
                  className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-xl text-foreground/50 opacity-0 transition hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
