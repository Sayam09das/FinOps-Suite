"use client"

import { useState } from "react"

import Header from "../../goals/SavingsGoalsPage/Header"
import Summary from "../../goals/SavingsGoalsPage/Summary"
import GoalsList from "../../goals/SavingsGoalsPage/GoalsList"
import DetailsDrawer from "../../goals/SavingsGoalsPage/DetailsDrawer"
import AddModal from "../../goals/SavingsGoalsPage/AddModal"
import { demoSavingsSummary, demoSavingsGoals } from "../../goals/SavingsGoalsPage/demo-data"
import type { SavingsGoal } from "../../goals/SavingsGoalsPage/demo-data"

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
