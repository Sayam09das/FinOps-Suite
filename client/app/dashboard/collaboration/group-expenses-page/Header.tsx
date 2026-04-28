"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Receipt, Plus } from "lucide-react"
import Link from "next/link"

interface HeaderProps {
  onCreateGroup: () => void
}

export default function Header({ onCreateGroup }: HeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl text-foreground/72 transition hover:bg-background/70 hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="primary-wash flex h-11 w-11 items-center justify-center rounded-2xl">
            <Receipt className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-[-0.03em] text-foreground md:text-3xl">
              Group Expenses
            </h1>
            <p className="text-sm text-foreground/60">
              Split bills and settle up with your groups
            </p>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onCreateGroup}
        className="inline-flex items-center gap-2 self-start rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_rgba(33,49,43,0.1)] transition-all hover:bg-primary/90 hover:shadow-md sm:self-auto"
      >
        <Plus className="h-4 w-4" />
        Create Group
      </motion.button>
    </motion.div>
  )
}

