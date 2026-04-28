"use client"

import { useState } from "react"

import Header from "../../goals/InvestmentTrackingPage/Header"
import Summary from "../../goals/InvestmentTrackingPage/Summary"
import HoldingsList from "../../goals/InvestmentTrackingPage/HoldingsList"
import Chart from "../../goals/InvestmentTrackingPage/Chart"
import Details from "../../goals/InvestmentTrackingPage/Details"
import { demoInvestmentSummary, demoHoldings, portfolioHistory } from "../../goals/InvestmentTrackingPage/demo-data"
import type { Holding } from "../../goals/InvestmentTrackingPage/demo-data"

export default function InvestmentTrackingPage() {
  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null)

  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      <Header onAddInvestment={() => {}} />
      <Summary data={demoInvestmentSummary} />
      <HoldingsList
        holdings={demoHoldings}
        currency={demoInvestmentSummary.currency}
        onSelectHolding={setSelectedHolding}
      />
      <Chart data={portfolioHistory} currency={demoInvestmentSummary.currency} />
      <Details
        holding={selectedHolding}
        onClose={() => setSelectedHolding(null)}
        currency={demoInvestmentSummary.currency}
      />
    </div>
  )
}
