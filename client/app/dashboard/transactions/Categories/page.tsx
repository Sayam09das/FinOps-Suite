"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Plus, Tag } from "lucide-react"
import Link from "next/link"

import { Button } from "@/app/components/ui/button"
import CategoryList from "../Categories/CategoryList"
import AddCategoryModal from "../Categories/AddCategoryModal"

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

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

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="rounded-2xl shadow-lg shadow-primary/10"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </motion.div>
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

      {/* Add Category Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <AddCategoryModal onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

