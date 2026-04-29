"use client"

import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import CategoryList from "./CategoryList"

export default function CategoriesPage() {
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
                Categories
              </h1>
              <p className="mt-1 text-sm text-foreground/60">
                Organize your spending with custom categories
              </p>
            </div>
          </div>

          <p className="rounded-2xl border border-border/70 bg-background/60 px-4 py-2.5 text-sm text-foreground/60">
            Categories are derived from saved backend transactions.
          </p>
        </motion.div>

        {/* Category List */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <CategoryList />
        </motion.div>
      </div>

    </div>
  )
}
