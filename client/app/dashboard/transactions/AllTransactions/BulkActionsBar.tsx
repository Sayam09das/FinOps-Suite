"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, X, FolderOpen } from "lucide-react"

import { cn } from "@/app/lib/utils/cn"

interface BulkActionsBarProps {
  selectedCount: number
  onDeleteAll: () => void
  onCategorize?: () => void
  onClear: () => void
}

export default function BulkActionsBar({
  selectedCount,
  onDeleteAll,
  onCategorize,
  onClear,
}: BulkActionsBarProps) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-emerald-200/70 bg-emerald-50/95 px-5 py-3 shadow-[0_20px_60px_rgba(33,49,43,0.18)] backdrop-blur-xl"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
            {selectedCount}
          </div>
          <span className="text-sm font-medium text-emerald-900">
            {selectedCount} selected
          </span>

          <div className="mx-2 h-5 w-px bg-emerald-200" />

          {onCategorize && (
            <button
              onClick={onCategorize}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100/80"
            >
              <FolderOpen className="h-3.5 w-3.5" />
              Categorize
            </button>
          )}

          <button
            onClick={onDeleteAll}
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100/80"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete All
          </button>

          <button
            onClick={onClear}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-emerald-700/60 transition hover:bg-emerald-100/80"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

