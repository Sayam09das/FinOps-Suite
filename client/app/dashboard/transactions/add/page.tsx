"use client"

import { motion } from "framer-motion"
import { ArrowLeft, PlusCircle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/app/components/ui/button"
import TransactionForm from "../AddTransaction/TransactionForm"

export default function AddTransactionPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-6 p-4 md:p-6 xl:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-4"
        >
          <Link href="/dashboard/transactions" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl text-foreground/72 transition hover:bg-background/70 hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">
              Add Transaction
            </h1>
            <p className="mt-1 text-sm text-foreground/60">
              Log income or expense in under 5 seconds
            </p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <TransactionForm />
        </motion.div>
      </div>
    </div>
  )
}

