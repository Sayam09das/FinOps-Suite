"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Plus, Repeat } from "lucide-react"
import Link from "next/link"

import { Button } from "@/app/components/ui/button"
import RecurringList from "../Recurring/RecurringList"
import UpcomingTimeline from "../Recurring/UpcomingTimeline"
import AddRecurringForm from "../Recurring/AddRecurringForm"

export default function RecurringPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-6 p-4 md:p-6 xl:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-4">
            <Link href="/dashboard/transactions" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl text-foreground/72 transition hover:bg-background/70 hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                Recurring Transactions
              </h1>
              <p className="mt-1 text-sm text-foreground/60">
                Automate tracking of subscriptions, EMIs, and salaries
              </p>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => setIsDrawerOpen(true)}
              className="rounded-2xl shadow-lg shadow-primary/10"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Recurring
            </Button>
          </motion.div>
        </motion.div>

        {/* Timeline + List Grid */}
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <UpcomingTimeline />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <RecurringList />
          </motion.div>
        </div>
      </div>

      {/* Add Recurring Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <AddRecurringForm onClose={() => setIsDrawerOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

