"use client"

import { useState } from "react"

import Header from "../../Goals/SavingsGoalsPage/Header"
import Summary from "../../Goals/SavingsGoalsPage/Summary"
import GoalsList from "../../Goals/SavingsGoalsPage/GoalsList"
import DetailsDrawer from "../../Goals/SavingsGoalsPage/DetailsDrawer"
import AddModal from "../../Goals/SavingsGoalsPage/AddModal"
import { demoSavingsSummary, demoSavingsGoals } from "../../Goals/SavingsGoalsPage/demo-data"
import type { SavingsGoal } from "../../Goals/SavingsGoalsPage/demo-data"

export default function SavingsGoalsPage() {
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [goals, setGoals] = useState(demoSavingsGoals)

  const handleAddGoal = (goal: {
    name: string
    targetAmount: number
    currentAmount: number
    deadline: string
    linkedAccount: string
  }) => {
    setGoals((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).slice(2),
        name: goal.name,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        deadline: goal.deadline,
        linkedAccount: goal.linkedAccount,
        color: "#3B82F6",
        icon: "Shield",
        contributions: [],
      },
    ])
  }

  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      <Header onAddGoal={() => setShowAddModal(true)} />
      <Summary data={demoSavingsSummary} />
      <GoalsList
        goals={goals}
        currency={demoSavingsSummary.currency}
        onSelectGoal={setSelectedGoal}
      />
      <DetailsDrawer
        goal={selectedGoal}
        onClose={() => setSelectedGoal(null)}
        currency={demoSavingsSummary.currency}
      />
      <AddModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddGoal}
        currency={demoSavingsSummary.currency}
      />
    </div>
  )
}
