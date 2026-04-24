"use client"

import React from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"

import { Card } from "@/app/components/ui/card"
import { cn } from "@/app/lib/utils/cn"
import { formatCurrency } from "@/app/lib/utils/number"

import type { AssetItem } from "./types"

interface AssetCardProps {
  assets: AssetItem[]
  totalAssets: number
}

export default function AssetCard({ assets, totalAssets }: AssetCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
    >
      <Card variant="surface" padding="lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
              Assets
            </h3>
            <p className="mt-0.5 text-sm text-foreground/55">
              What you own
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/70 px-4 py-2 text-right">
            <p className="text-xs font-medium text-emerald-700/70">Total</p>
            <p className="text-lg font-bold tracking-tight text-emerald-700">
              ₹{formatCurrency(totalAssets, "INR", "en-IN").replace("₹", "")}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {assets.map((asset, index) => {
            const Icon = asset.icon
            const isPositive = (asset.change ?? 0) >= 0
            const ChangeIcon = isPositive ? TrendingUp : TrendingDown

            return (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.08, duration: 0.35 }}
                className="group flex items-center gap-3 rounded-2xl border border-border/60 bg-background/60 p-3.5 transition-all hover:border-emerald-200/80 hover:bg-emerald-50/40 hover:shadow-sm"
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm"
                  style={{ backgroundColor: `${asset.color}18`, color: asset.color }}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">{asset.name}</p>
                    <p className="text-sm font-bold text-foreground">
                      ₹{formatCurrency(asset.amount, "INR", "en-IN").replace("₹", "")}
                    </p>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border/60">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${asset.percentage}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: asset.color }}
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground/50">
                      {asset.percentage}%
                    </span>
                  </div>
                </div>

                {asset.change !== undefined && (
                  <div
                    className={cn(
                      "flex shrink-0 items-center gap-0.5 rounded-lg px-2 py-1 text-xs font-semibold",
                      isPositive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-600"
                    )}
                  >
                    <ChangeIcon className="h-3 w-3" />
                    {Math.abs(asset.change)}%
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </Card>
    </motion.div>
  )
}

