"use client"

import { useState } from "react"

import Header from "../../goals/DebtTrackerPage/Header"
import Summary from "../../goals/DebtTrackerPage/Summary"
import DebtList from "../../goals/DebtTrackerPage/DebtList"
import Timeline from "../../goals/DebtTrackerPage/Timeline"
import Payments from "../../goals/DebtTrackerPage/Payments"
import AddDebtModal from "../../goals/DebtTrackerPage/AddDebtModal"
import { useToast } from "@/app/components/ui/use-toast"
import { useCreateDebt, useDebts, useRecordDebtPayment, type Debt } from "@/app/features/goals"
import { formatCurrency } from "@/app/lib/utils/number"

export default function DebtTrackerPage() {
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const { toast } = useToast()
  const { data, error } = useDebts()
  const createDebt = useCreateDebt()
  const recordDebtPayment = useRecordDebtPayment()
  const summary = data?.summary ?? { totalDebt: 0, totalPaid: 0, remaining: 0, currency: "INR" }
  const debts = data?.debts ?? []

  const handleRecordPayment = async (debtId: string, amount: number) => {
    await recordDebtPayment.mutateAsync({ id: debtId, amount, type: amount > 0 ? "extra" : "regular" })
    toast({
      title: "Payment recorded",
      description: `Debt payment of ${formatCurrency(amount, summary.currency)} synced to backend.`,
    })
  }

  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      <Header onAddDebt={() => setShowAddModal(true)} />
      <Summary data={summary} />
      {error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Failed to load debts: {error.message}
        </div>
      ) : null}
      <DebtList
        debts={debts}
        currency={summary.currency}
        onSelectDebt={setSelectedDebt}
      />
      <Timeline debts={debts} currency={summary.currency} />
      <Payments
        debts={debts}
        currency={summary.currency}
        onRecordPayment={handleRecordPayment}
      />
      <AddDebtModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={async (debt) => {
          await createDebt.mutateAsync(debt)
          toast({
            title: "Debt created",
            description: `${debt.name} is now tracked with live backend data.`,
          })
        }}
      />
    </div>
  )
}
