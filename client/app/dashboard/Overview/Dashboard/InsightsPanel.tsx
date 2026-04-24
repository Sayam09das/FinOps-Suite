"use client";

import { Card } from "@/app/components/ui/card";
import { cn } from "@/app/lib/utils/cn";

import type { InsightItem } from "../types";

const insightToneStyles = {
  positive: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-rose-100 text-rose-700",
  neutral: "bg-blue-100 text-blue-700",
} as const;

export default function InsightsPanel({ items }: { items: InsightItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Card
            key={item.title}
            className="surface-card surface-card-hover rounded-[1.8rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.34))] p-5 backdrop-blur-xl"
          >
            <div className="flex items-start gap-3">
              <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl", insightToneStyles[item.tone])}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.18em] text-foreground/42">{item.helper}</p>
                <h3 className="mt-2 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-foreground/62">{item.detail}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
