"use client"

import { useState, useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"

import Header from "../group-expenses-page/Header"
import CreateExpenseGroupModal from "../group-expenses-page/CreateExpenseGroupModal"
import GroupsList from "../group-expenses-page/GroupsList"
import Expenselist from "../group-expenses-page/Expenselist"
import SplitDetails from "../group-expenses-page/SplitDetails"
import Settlement from "../group-expenses-page/Settlement"
import { getSettlementForGroup } from "../../collaboration/utils"
import type { ExpenseGroup, Expense } from "../../collaboration/types"
import { useToast } from "@/app/components/ui/use-toast"
import { useCreateExpenseGroup, useGroupExpensesDashboard } from "@/app/features/collaboration"
import { useAuth } from "@/app/features/auth"

export default function GroupExpensesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const { data, error } = useGroupExpensesDashboard()
  const createExpenseGroup = useCreateExpenseGroup()
  const groups = data?.groups ?? []
  const [selectedGroupId, setSelectedGroupId] = useState<string>("")
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const currentUserId = user?.id || ""

  const selectedGroup = useMemo(
    () => groups.find((g) => g.id === selectedGroupId) || groups[0] || null,
    [groups, selectedGroupId]
  )
  const settlementCurrency = selectedGroup?.expenses[0]?.currency || "INR"

  const { youOwe, youAreOwed } = useMemo(
    () => selectedGroup
      ? getSettlementForGroup(selectedGroup, currentUserId)
      : { summaries: [], youOwe: 0, youAreOwed: 0 },
    [selectedGroup, currentUserId]
  )

  const handleCreateGroup = async (payload: { name: string; description: string }) => {
    const group = await createExpenseGroup.mutateAsync(payload)
    setSelectedGroupId(group.id)
    toast({
      title: "Expense group created",
      description: `${payload.name} is now backed by live data.`,
    })
  }

  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      <Header onCreateGroup={() => setShowCreateModal(true)} />
      {error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Failed to load group expenses: {error.message}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column — Groups + Expenses */}
        <div className="space-y-6 lg:col-span-2">
          <GroupsList
            groups={groups}
            selectedGroupId={selectedGroupId || groups[0]?.id || ""}
            onSelect={setSelectedGroupId}
          />

          <AnimatePresence mode="wait">
            {selectedGroup ? (
              <motion.div
                key={selectedGroup.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Expenselist
                  group={selectedGroup}
                  currentUserId={currentUserId}
                  onViewSplit={(expense) => setSelectedExpense(expense)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="empty-group"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-3xl border border-border/60 bg-background/60 p-8 text-center shadow-sm backdrop-blur-sm"
              >
                <p className="text-foreground/50">Create your first group to start tracking shared expenses.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right column — Settlement + Split Details */}
        <div className="space-y-6">
          <Settlement
            youOwe={youOwe}
            youAreOwed={youAreOwed}
            currency={settlementCurrency}
          />

          <AnimatePresence mode="wait">
            {selectedExpense ? (
              <motion.div
                key={selectedExpense.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <SplitDetails
                  expense={selectedExpense}
                  members={selectedGroup.members}
                  onClose={() => setSelectedExpense(null)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="empty-split"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-3xl border border-border/60 bg-background/60 p-8 text-center shadow-sm backdrop-blur-sm"
              >
                <p className="text-sm text-foreground/50">
                  Tap an expense to view split details
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <CreateExpenseGroupModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateGroup}
      />
    </div>
  )
}
