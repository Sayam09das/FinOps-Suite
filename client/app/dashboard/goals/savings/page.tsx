"use client"

import { useState } from "react"

import Header from "../../goals/SavingsGoalsPage/Header"
import Summary from "../../goals/SavingsGoalsPage/Summary"
import GoalsList from "../../goals/SavingsGoalsPage/GoalsList"
import DetailsDrawer from "../../goals/SavingsGoalsPage/DetailsDrawer"
import AddModal from "../../goals/SavingsGoalsPage/AddModal"
import { useToast } from "@/app/components/ui/use-toast"
import { useAccounts } from "@/app/features/accounts"
import { useCreateSavingsGoal, useSavingsGoals, type SavingsGoal } from "@/app/features/goals"

export default function SavingsGoalsPage() {
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const { toast } = useToast()
  const { data: accounts = [] } = useAccounts()
  const { data, error } = useSavingsGoals()
  const createSavingsGoal = useCreateSavingsGoal()
  const summary = data?.summary ?? { totalGoals: 0, totalSaved: 0, totalTarget: 0, currency: "INR" }
  const goals = data?.goals ?? []
  const accountOptions = accounts.map((account) => ({
    value: account.id,
    label: account.name,
  }))

  const handleAddGoal = async (goal: {
    name: string
    targetAmount: number
    currentAmount: number
    deadline: string
    linkedAccount: string
  }) => {
    await createSavingsGoal.mutateAsync(goal)
    toast({
      title: "Goal created",
      description: `${goal.name} is now tracked with live backend data.`,
    })
  }

  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      <Header onAddGoal={() => setShowAddModal(true)} />
      <Summary data={summary} />
      {error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Failed to load savings goals: {error.message}
        </div>
      ) : null}
      <GoalsList
        goals={goals}
        currency={summary.currency}
        onSelectGoal={setSelectedGoal}
      />
      <DetailsDrawer
        goal={selectedGoal}
        onClose={() => setSelectedGoal(null)}
        currency={summary.currency}
      />
      <AddModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddGoal}
        currency={summary.currency}
        accountOptions={accountOptions}
      />
    </div>
  )
}
