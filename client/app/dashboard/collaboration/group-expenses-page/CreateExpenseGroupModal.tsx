"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Users, X } from "lucide-react"

import { Card, CardContent } from "@/app/components/ui/card"

interface CreateExpenseGroupModalProps {
  open: boolean
  onClose: () => void
  onCreate: (data: { name: string; description: string }) => void
}

export default function CreateExpenseGroupModal({ open, onClose, onCreate }: CreateExpenseGroupModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onCreate({ name, description })
    setName("")
    setDescription("")
    onClose()
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-lg"
          >
            <Card variant="surface" className="rounded-[1.95rem] border-border/80 bg-white/95 p-0 shadow-2xl">
              <CardContent className="space-y-5 px-6 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">Create Expense Group</h2>
                      <p className="text-xs text-foreground/60">Track real shared expenses with your group</p>
                    </div>
                  </div>
                  <button onClick={onClose} className="rounded-full p-2 text-foreground/60 hover:bg-muted">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Group name" className="w-full rounded-xl border border-border/80 bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                  <textarea required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={4} className="w-full rounded-xl border border-border/80 bg-background/60 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-border/80 bg-background px-4 py-2.5 text-sm font-semibold hover:bg-muted">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                      Create Group
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
