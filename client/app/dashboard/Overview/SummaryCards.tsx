"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Card } from "@/app/components/ui/card";
import { cn } from "@/app/lib/utils/cn";
import { formatAmount, formatPercent } from "@/app/lib/utils/currency";
import { formatNumber } from "@/app/lib/utils/number";

import type { SummaryMetric } from "./types";

const toneStyles = {
  positive: {
    icon: "bg-emerald-100 text-emerald-700",
    delta: "bg-emerald-100 text-emerald-800",
  },
  warning: {
    icon: "bg-amber-100 text-amber-700",
    delta: "bg-amber-100 text-amber-800",
  },
  danger: {
    icon: "bg-rose-100 text-rose-700",
    delta: "bg-rose-100 text-rose-800",
  },
  neutral: {
    icon: "bg-blue-100 text-blue-700",
    delta: "bg-blue-100 text-blue-800",
  },
} as const;

function formatMetricValue(metric: SummaryMetric) {
  if (metric.format === "currency") {
    return formatAmount(metric.value);
  }

  if (metric.format === "percent") {
    return formatPercent(metric.value / 100, 0);
  }

  return formatNumber(metric.value, { maximumFractionDigits: 0 });
}

export default function SummaryCards({ items }: { items: SummaryMetric[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {items.map((item) => {
        const Icon = item.icon;
        const tone = toneStyles[item.tone];
        const isPositiveDelta = item.delta >= 0;

        return (
          <Card
            key={item.title}
            className="surface-card surface-card-hover rounded-[1.85rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.68),rgba(255,255,255,0.34))] p-5 backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", tone.icon)}>
                <Icon className="h-5 w-5" />
              </div>
              <div className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold", tone.delta)}>
                {isPositiveDelta ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                {Math.abs(item.delta).toFixed(1)}%
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <p className="text-sm font-medium text-foreground/62">{item.title}</p>
              <p className="text-3xl font-semibold tracking-[-0.04em] text-foreground">{formatMetricValue(item)}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">{item.helper}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
