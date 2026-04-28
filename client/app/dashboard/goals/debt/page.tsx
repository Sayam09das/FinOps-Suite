"use client"

import { useState } from "react"

import Header from "../../goals/DebtTrackerPage/Header"
import Summary from "../../goals/DebtTrackerPage/Summary"
import DebtList from "../../goals/DebtTrackerPage/DebtList"
import Timeline from "../../goals/DebtTrackerPage/Timeline"
import Payments from "../../goals/DebtTrackerPage/Payments"
import { demoDebtSummary, demoDebts } from "../../goals/DebtTrackerPage/demo-data"
import type { Debt } from "../../goals/DebtTrackerPage/demo-data"

export default function DebtTrackerPage() {
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null)

  const handleRecordPayment = (debtId: string, amount: number) => {
    console.log("Record payment", debtId, amount)
  }

  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      <Header onAddDebt={() => {}} />
      <Summary data={demoDebtSummary} />
      <DebtList
        debts={demoDebts}
        currency={demoDebtSummary.currency}
        onSelectDebt={setSelectedDebt}
      />
      <Timeline debts={demoDebts} currency={demoDebtSummary.currency} />
      <Payments
        debts={demoDebts}
        currency={demoDebtSummary.currency}
        onRecordPayment={handleRecordPayment}
      />
    </div>
  )
}
