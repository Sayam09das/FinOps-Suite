"use client"

import { useState } from "react"

import Header from "../../goals/InvestmentTrackingPage/Header"
import Summary from "../../goals/InvestmentTrackingPage/Summary"
import HoldingsList from "../../goals/InvestmentTrackingPage/HoldingsList"
import Chart from "../../goals/InvestmentTrackingPage/Chart"
import Details from "../../goals/InvestmentTrackingPage/Details"
import AddInvestmentModal from "../../goals/InvestmentTrackingPage/AddInvestmentModal"
import { useToast } from "@/app/components/ui/use-toast"
import { useCreateInvestment, useInvestments, type Holding } from "@/app/features/goals"

export default function InvestmentTrackingPage() {
  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const { toast } = useToast()
  const { data, error } = useInvestments()
  const createInvestment = useCreateInvestment()
  const summary = data?.summary ?? { totalInvested: 0, currentValue: 0, currency: "INR" }
  const holdings = data?.holdings ?? []
  const portfolioHistory = data?.portfolioHistory ?? []

  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      <Header onAddInvestment={() => setShowAddModal(true)} />
      <Summary data={summary} />
      {error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Failed to load investments: {error.message}
        </div>
      ) : null}
      <HoldingsList
        holdings={holdings}
        currency={summary.currency}
        onSelectHolding={setSelectedHolding}
      />
      <Chart data={portfolioHistory} currency={summary.currency} />
      <Details
        holding={selectedHolding}
        onClose={() => setSelectedHolding(null)}
        currency={summary.currency}
      />
      <AddInvestmentModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={async (investment) => {
          await createInvestment.mutateAsync(investment)
          toast({
            title: "Investment created",
            description: `${investment.name} is now part of your live portfolio.`,
          })
        }}
      />
    </div>
  )
}
