"use client"

import React from "react"
import { motion } from "framer-motion"
import { Plus, Download, FileDown } from "lucide-react"

import { Card } from "@/app/components/ui/card"

interface TransactionsHeaderProps {
  onAddTransaction?: () => void
  onExportCSV?: () => void
  onExportPDF?: () => void
}

export default function TransactionsHeader({
  onAddTransaction,
  onExportCSV,
  onExportPDF,
}: TransactionsHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-foreground md:text-4xl">
          All Transactions
        </h1>
        <p className="mt-1 text-sm text-foreground/60">
          View, search, and manage every money event
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onExportCSV}
          className="inline-flex items-center gap-2 rounded-2xl border border-border/80 bg-background/75 px-4 py-2.5 text-sm font-semibold text-foreground/80 shadow-sm transition hover:bg-white/90"
        >
          <FileDown className="h-4 w-4" />
          CSV
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onExportPDF}
          className="inline-flex items-center gap-2 rounded-2xl border border-border/80 bg-background/75 px-4 py-2.5 text-sm font-semibold text-foreground/80 shadow-sm transition hover:bg-white/90"
        >
          <Download className="h-4 w-4" />
          PDF
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onAddTransaction}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Add Transaction
        </motion.button>
      </div>
    </motion.div>
  )
}

