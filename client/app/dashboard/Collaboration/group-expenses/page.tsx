"use client"

import { useState, useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"

import Header from "../../Collaboration/GroupExpensesPage/Header"
import GroupsList from "../../Collaboration/GroupExpensesPage/GroupsList"
import Expenselist from "../../Collaboration/GroupExpensesPage/Expenselist"
import SplitDetails from "../../Collaboration/GroupExpensesPage/SplitDetails"
import Settlement from "../../Collaboration/GroupExpensesPage/Settlement"

import { demoExpenseGroups, getSettlementForGroup } from "../../Collaboration/demo-data-group-expenses"
import type { ExpenseGroup, Expense } from "../../Collaboration/types"

const CURRENT_USER_ID = "u-you"

export default function GroupExpensesPage() {
  const [selectedGroupId, setSelectedGroupId] = useState<string>(demoExpenseGroups[0].id)
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)

  const selectedGroup = useMemo(
    () => demoExpenseGroups.find((g) => g.id === selectedGroupId) || demoExpenseGroups[0],
    [selectedGroupId]
  )

  const { summaries, youOwe, youAreOwed } = useMemo(
    () => getSettlementForGroup(selectedGroup, CURRENT_USER_ID),
    [selectedGroup]
  )

  const handleCreateGroup = () => {
    alert("Create Group — demo mode")
  }

  const handleSettleUp = () => {
    alert("Settle up — demo mode")
  }

  const handleMarkAsPaid = (userId: string) => {
    alert(`Mark as paid for ${userId} — demo mode`)
  }

  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      <Header onCreateGroup={handleCreateGroup} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column — Groups + Expenses */}
        <div className="space-y-6 lg:col-span-2">
          <GroupsList
            groups={demoExpenseGroups}
            selectedGroupId={selectedGroupId}
            onSelect={setSelectedGroupId}
          />

          <AnimatePresence mode="wait">
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
                currentUserId={CURRENT_USER_ID}
                onViewSplit={(expense) => setSelectedExpense(expense)}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right column — Settlement + Split Details */}
        <div className="space-y-6">
          <Settlement
            youOwe={youOwe}
            youAreOwed={youAreOwed}
            currency="INR"
            onSettleUp={handleSettleUp}
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
    </div>
  )
}

