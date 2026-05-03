"use client"

import { motion } from "framer-motion"
import { Users } from "lucide-react"
import { cn } from "@/app/lib/utils/cn"
import type { ExpenseGroup } from "../types"

interface GroupsListProps {
  groups: ExpenseGroup[]
  selectedGroupId: string
  onSelect: (id: string) => void
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

export default function GroupsList({ groups, selectedGroupId, onSelect }: GroupsListProps) {
  if (groups.length === 0) {
    return (
      <div className="rounded-3xl border border-border/60 bg-background/60 p-8 text-center shadow-sm backdrop-blur-sm">
        <p className="text-foreground/50">No groups yet. Create one to track shared expenses.</p>
      </div>
    )
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
          Your Groups
        </h2>
        <span className="text-sm text-foreground/50">{groups.length} groups</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {groups.map((group) => {
          const isSelected = group.id === selectedGroupId
          const totalExpenses = group.expenses.reduce((sum, e) => sum + e.amount, 0)

          return (
            <motion.button
              key={group.id}
              variants={item}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(group.id)}
              className={cn(
                "flex min-w-[220px] flex-col rounded-2xl border p-4 text-left shadow-sm transition-all duration-300",
                isSelected
                  ? "border-primary/40 bg-primary/[0.04] ring-1 ring-primary/20"
                  : "border-border/60 bg-background/60 backdrop-blur-sm hover:border-primary/30 hover:shadow-md"
              )}
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: group.color }}
                />
                <h3 className="font-semibold text-foreground">{group.name}</h3>
              </div>
              <p className="mt-1 text-xs text-foreground/50">{group.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-foreground/50">
                  <Users className="h-3.5 w-3.5" />
                  {group.members.length}
                </div>
                <span className="text-xs font-medium text-foreground/60">
                  {group.expenses.length} expenses
                </span>
              </div>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
