"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, TrendingUp, TrendingDown } from "lucide-react"

import { Button } from "@/app/components/ui/button"
import { toast } from "@/app/components/ui/use-toast"
import { cn } from "@/app/lib/utils/cn"
import IconPicker from "./IconPicker"

interface AddCategoryModalProps {
  onClose: () => void
}

const COLOR_PRESETS = [
  "#d27768", "#5687cc", "#8d6ad8", "#d0a24d",
  "#e85d9a", "#c66a6a", "#4f9e96", "#2f7d67",
  "#9ca3af", "#f59e0b", "#ec4899", "#6366f1",
]

export default function AddCategoryModal({ onClose }: AddCategoryModalProps) {
  const [name, setName] = useState("")
  const [selectedIcon, setSelectedIcon] = useState("Utensils")
  const [type, setType] = useState<"income" | "expense">("expense")
  const [color, setColor] = useState("#d27768")

  const handleSubmit = () => {
    if (!name.trim()) {
      toast({ title: "Name required", description: "Please enter a category name" })
      return
    }
    toast({ title: "Category added", description: `${name} created successfully` })
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/25 p-4 backdrop-blur-[4px]"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg overflow-hidden rounded-[2rem] border border-border/70 bg-white/95 shadow-[0_28px_80px_rgba(33,49,43,0.18)] backdrop-blur-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/40 px-6 py-4">
            <h2 className="text-lg font-bold text-foreground">Add Category</h2>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-foreground/50 transition hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-6 p-6">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
                Category Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Gym Membership"
                className="w-full rounded-2xl border border-border/70 bg-background/60 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-foreground/35 focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              />
            </div>

            {/* Type Toggle */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
                Type
              </label>
              <div className="flex gap-2 rounded-2xl border border-border/60 bg-background/60 p-1.5">
                {(["expense", "income"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={cn(
                      "relative flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition",
                      type === t
                        ? t === "income" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                        : "text-foreground/50 hover:bg-white/60 hover:text-foreground"
                    )}
                  >
                    {t === "income" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
                Color
              </label>
              <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map((c) => (
                  <motion.button
                    key={c}
                    type="button"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setColor(c)}
                    className={cn(
                      "h-9 w-9 rounded-xl border-2 transition",
                      color === c ? "border-foreground/40 scale-110" : "border-transparent"
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Icon */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
                Icon
              </label>
              <IconPicker selected={selectedIcon} onSelect={setSelectedIcon} />
            </div>

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              className="w-full rounded-2xl py-3 shadow-lg shadow-primary/15"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Category
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

