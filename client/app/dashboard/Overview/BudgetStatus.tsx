"use client";

import { AlertTriangle } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";
import { formatAmount } from "@/app/lib/utils/currency";
import { cn } from "@/app/lib/utils/cn";

import type { BudgetHealthItem } from "./types";

const toneClasses = {
  positive: "text-emerald-700",
  warning: "text-amber-700",
  danger: "text-rose-700",
  neutral: "text-foreground",
} as const;

export default function BudgetStatus({ items }: { items: BudgetHealthItem[] }) {
  return (
    <Card className="surface-card rounded-[1.95rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-0 backdrop-blur-xl">
      <CardHeader className="border-b border-border/70 px-5 py-5">
        <CardTitle className="text-xl">Budget Status</CardTitle>
        <CardDescription>Visual control bars for spending health across live budget categories.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 px-5 py-5">
        {items.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-border/80 bg-background/55 px-6 py-10 text-center">
            <p className="text-base font-semibold text-foreground">No budgets created yet</p>
            <p className="mt-2 text-sm text-foreground/58">
              Create category budgets to watch usage, overages, and runway in one place.
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.name} className="rounded-[1.35rem] border border-border/70 bg-background/72 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="mt-1 text-xs text-foreground/58">
                    {formatAmount(item.spent)} of {formatAmount(item.budget)}
                  </p>
                </div>

                <div className={cn("text-right text-sm font-semibold", toneClasses[item.tone])}>
                  <p>{Math.round(item.utilization * 100)}%</p>
                  {item.note ? (
                    <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      {item.note}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="mt-4">
                <Progress value={Math.min(item.utilization * 100, 100)} className="h-2.5" />
              </div>

              <div className="mt-3 flex items-center justify-between text-sm text-foreground/64">
                <span>Left: {formatAmount(item.remaining)}</span>
                <span>{item.utilization >= 1 ? "Action needed" : "Within guardrails"}</span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
