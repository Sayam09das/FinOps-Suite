"use client"

import React from "react"
import { Sparkles } from "lucide-react"

import { Badge } from "@/app/components/ui/badge"
import {
  AssetCard,
  AssetDistributionChart,
  FinancialHealthScore,
  FutureProjection,
  LiabilityCard,
  LiabilityList,
  NetWorthCard,
  NetWorthInsights,
  NetWorthTrend,
  NetworthSkeleton,
  QuickActions,
} from "@/app/dashboard/Overview/Networth"
import { useNetWorthQuery } from "@/app/lib/api/queries"
import { buildNetWorthViewModel } from "@/app/dashboard/Overview/Networth/view-model"
import type { NetWorthViewModel } from "@/app/dashboard/Overview/Networth/types"

export default function NetWorthPage() {
  const { data, isLoading } = useNetWorthQuery()

// Use transformed data from query or fallback to empty view model
  const viewData: NetWorthViewModel = data || buildNetWorthViewModel()

  if (isLoading || !viewData) {
    return (
      <div className="min-h-screen">
        <div className="border-b border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.6),rgba(255,255,255,0.24))] backdrop-blur-xl">
          <div className="px-4 py-6 md:px-6 xl:px-8">
            <Badge variant="accent" className="bg-accent/18 text-accent-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              Net Worth
            </Badge>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground md:text-4xl">
              Your Wealth Snapshot
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/64 md:text-base">
              Track your total net worth, asset distribution, liabilities, and growth trends in one place.
            </p>
          </div>
        </div>
        <NetworthSkeleton />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.6),rgba(255,255,255,0.24))] backdrop-blur-xl">
        <div className="px-4 py-6 md:px-6 xl:px-8">
          <Badge variant="accent" className="bg-accent/18 text-accent-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            Net Worth
          </Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground md:text-4xl">
            Your Wealth Snapshot
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/64 md:text-base">
            Track your total net worth, asset distribution, liabilities, and growth trends in one place.
            See what is helping vs hurting your wealth in seconds.
          </p>
        </div>
      </div>

{/* Content */}
      <div className="space-y-6 p-4 md:p-6 xl:p-8">
        {/* Row 1: Net Worth Hero + Trend */}
        <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
          <NetWorthCard data={viewData.netWorth} />
          <NetWorthTrend series={viewData.trendSeries} />
        </div>

        {/* Row 2: Assets + Liabilities */}
        <div className="grid gap-6 md:grid-cols-2">
          <AssetCard assets={viewData.assets} totalAssets={viewData.netWorth.totalAssets} />
          <LiabilityCard liabilities={viewData.liabilities} totalLiabilities={viewData.netWorth.totalLiabilities} />
        </div>

        {/* Row 3: Asset Chart + Liability Breakdown + Health Score + Projection */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="xl:col-span-1">
            <AssetDistributionChart data={viewData.assetDistribution} />
          </div>
          <div className="xl:col-span-1">
            <LiabilityList liabilities={viewData.liabilities} />
          </div>
          <div className="xl:col-span-1">
            <FinancialHealthScore score={viewData.healthScore} />
          </div>
          <div className="xl:col-span-1">
            <FutureProjection
              currentNetWorth={viewData.netWorth.totalNetWorth}
              futureValue={viewData.projection.futureValue}
              months={viewData.projection.months}
              confidence={viewData.projection.confidence}
            />
          </div>
        </div>

        {/* Row 4: Insights */}
        <NetWorthInsights insights={viewData.insights} />

        {/* Row 5: Quick Actions */}
        <QuickActions />
      </div>
    </div>
  )
}

