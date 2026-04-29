"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";
import { formatAmount } from "@/app/lib/utils/currency";

import type { GoalItem } from "../types";

export default function GoalsProgress({ items }: { items: GoalItem[] }) {
  return (
    <Card className="surface-card rounded-[1.95rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-0 backdrop-blur-xl">
      <CardHeader className="border-b border-border/70 px-5 py-5">
        <CardTitle className="text-xl">Goals Progress</CardTitle>
        <CardDescription>Savings and investment goals with clear progress pacing.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 px-5 py-5">
        {items.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-border/80 bg-background/55 px-6 py-10 text-center">
            <p className="text-base font-semibold text-foreground">No goals yet</p>
            <p className="mt-2 text-sm text-foreground/58">
              Savings and investment goals will appear here after a goals backend is connected.
            </p>
          </div>
        ) : items.map((item) => {
          const progress = item.target > 0 ? (item.current / item.target) * 100 : 0;

          return (
            <div key={item.name} className="rounded-[1.35rem] border border-border/70 bg-background/72 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="mt-1 text-xs text-foreground/58">{item.helper}</p>
                </div>
                <span className="rounded-full bg-primary/70 px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                  {progress.toFixed(0)}%
                </span>
              </div>

              <div className="mt-4">
                <Progress value={Math.min(progress, 100)} className="h-2.5" />
              </div>

              <div className="mt-3 flex items-center justify-between text-sm text-foreground/66">
                <span>{formatAmount(item.current)} saved</span>
                <span>{formatAmount(item.target)} target</span>
              </div>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-foreground/42">{item.deadline}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
