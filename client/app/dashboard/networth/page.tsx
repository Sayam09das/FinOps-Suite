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
import { useNetWorthData } from "@/app/dashboard/Overview/Networth/view-model"

export default function NetWorthPage() {
  const { data, isLoading } = useNetWorthData()

  if (isLoading || !data) {
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
          <NetWorthCard data={data.netWorth} />
          <NetWorthTrend series={data.trendSeries} />
        </div>

        {/* Row 2: Assets + Liabilities */}
        <div className="grid gap-6 md:grid-cols-2">
          <AssetCard assets={data.assets} totalAssets={data.netWorth.totalAssets} />
          <LiabilityCard liabilities={data.liabilities} totalLiabilities={data.netWorth.totalLiabilities} />
        </div>

        {/* Row 3: Asset Chart + Liability Breakdown + Health Score + Projection */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="xl:col-span-1">
            <AssetDistributionChart data={data.assetDistribution} />
          </div>
          <div className="xl:col-span-1">
            <LiabilityList liabilities={data.liabilities} />
          </div>
          <div className="xl:col-span-1">
            <FinancialHealthScore score={data.healthScore} />
          </div>
          <div className="xl:col-span-1">
            <FutureProjection
              currentNetWorth={data.netWorth.totalNetWorth}
              futureValue={data.projection.futureValue}
              months={data.projection.months}
              confidence={data.projection.confidence}
            />
          </div>
        </div>

        {/* Row 4: Insights */}
        <NetWorthInsights insights={data.insights} />

        {/* Row 5: Quick Actions */}
        <QuickActions />
      </div>
    </div>
  )
}

