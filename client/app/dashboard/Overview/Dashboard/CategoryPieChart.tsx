"use client";

import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { formatAmount } from "@/app/lib/utils/currency";

import type { CategorySlice } from "../types";

export default function CategoryPieChart({ items }: { items: CategorySlice[] }) {
  return (
    <Card className="surface-card rounded-[1.95rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-0 backdrop-blur-xl">
      <CardHeader className="border-b border-border/70 px-5 py-5">
        <CardTitle className="text-xl">Category Breakdown</CardTitle>
        <CardDescription>Spending distribution by category with the highest pressure zones.</CardDescription>
      </CardHeader>

      <CardContent className="px-5 py-5">
        {items.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-border/80 bg-background/55 px-6 py-10 text-center">
            <p className="text-base font-semibold text-foreground">No category data yet</p>
            <p className="mt-2 text-sm text-foreground/58">
              Start tracking expenses to unlock category-level breakdowns and insights.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-[1fr_0.95fr]">
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={items}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={68}
                    outerRadius={94}
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {items.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatAmount(Number(value ?? 0))} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.name} className="rounded-[1.2rem] border border-border/70 bg-background/72 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <p className="text-sm font-semibold text-foreground">{item.name}</p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{item.percentage.toFixed(0)}%</p>
                  </div>
                  <p className="mt-2 text-sm text-foreground/58">{formatAmount(item.value)} spent</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
