"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { cn } from "@/app/lib/utils/cn";

import type { AlertItem } from "./types";

const alertToneStyles = {
  positive: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-rose-100 text-rose-700",
  neutral: "bg-blue-100 text-blue-700",
} as const;

export default function AlertsPanel({ items }: { items: AlertItem[] }) {
  return (
    <Card className="surface-card rounded-[1.95rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-0 backdrop-blur-xl">
      <CardHeader className="border-b border-border/70 px-5 py-5">
        <CardTitle className="text-xl">Alerts & Notifications</CardTitle>
        <CardDescription>Time-sensitive finance warnings, reminders, and anomaly detection.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 px-5 py-5">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div key={`${item.title}-${item.time}`} className="rounded-[1.35rem] border border-border/70 bg-background/72 p-4">
              <div className="flex items-start gap-3">
                <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl", alertToneStyles[item.tone])}>
                  <Icon className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <span className="rounded-full bg-white/75 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/46">
                      {item.time}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-foreground/62">{item.detail}</p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
