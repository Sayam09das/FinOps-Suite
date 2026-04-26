"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import Header from "../../accounts/CreditCardsPage/Header"
import Utilization from "../../accounts/CreditCardsPage/Utilization"
import CardsList from "../../accounts/CreditCardsPage/CardsList"
import Billing from "../../accounts/CreditCardsPage/Billing"
import Payments from "../../accounts/CreditCardsPage/Payments"

export default function CreditCardsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-6 p-4 md:p-6 xl:p-8">
        {/* Header */}
        <Header
          onAddCard={() => setIsAddModalOpen(true)}
          onRefresh={() => window.location.reload()}
        />

        {/* Utilization Summary */}
        <Utilization />

        {/* Cards List */}
        <CardsList />

        {/* Billing & Due Section */}
        <Billing />

        {/* Payment Actions */}
        <Payments
          onPayBill={() => console.log("Pay Bill clicked")}
          onRecordPayment={() => console.log("Record Payment clicked")}
          onEditLimit={() => console.log("Edit Limit clicked")}
        />
      </div>

      {/* Add Card Modal Placeholder */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onClick={() => setIsAddModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl border border-border/60 bg-background p-6 shadow-xl"
            >
              <h2 className="text-xl font-semibold text-foreground">Add New Card</h2>
              <p className="mt-1 text-sm text-foreground/60">
                This feature will be implemented soon.
              </p>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

