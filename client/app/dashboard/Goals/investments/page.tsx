"use client"

import { useState } from "react"

import Header from "../../Goals/InvestmentTrackingPage/Header"
import Summary from "../../Goals/InvestmentTrackingPage/Summary"
import HoldingsList from "../../Goals/InvestmentTrackingPage/HoldingsList"
import Chart from "../../Goals/InvestmentTrackingPage/Chart"
import Details from "../../Goals/InvestmentTrackingPage/Details"
import { demoInvestmentSummary, demoHoldings, portfolioHistory } from "../../Goals/InvestmentTrackingPage/demo-data"
import type { Holding } from "../../Goals/InvestmentTrackingPage/demo-data"

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
