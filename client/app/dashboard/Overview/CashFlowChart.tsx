"use client";

import { useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { cn } from "@/app/lib/utils/cn";
import { formatAmount } from "@/app/lib/utils/currency";

import type { CashFlowPoint, ChartRange } from "./types";

const ranges: ChartRange[] = ["Weekly", "Monthly", "Yearly"];

export default function CashFlowChart({
  seriesByRange,
}: {
  seriesByRange: Record<ChartRange, CashFlowPoint[]>;
}) {
  const [activeRange, setActiveRange] = useState<ChartRange>("Monthly");
  const data = seriesByRange[activeRange];

  return (
    <Card className="surface-card rounded-[1.95rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-0 backdrop-blur-xl">
      <CardHeader className="flex flex-col gap-4 border-b border-border/70 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-xl">Cash Flow Over Time</CardTitle>
          <CardDescription>
            Track whether your income curve is outpacing your spend curve.
          </CardDescription>
        </div>

        <div className="flex flex-wrap gap-2">
          {ranges.map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setActiveRange(range)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold transition",
                activeRange === range
                  ? "border-primary/80 bg-primary text-primary-foreground shadow-[0_10px_30px_rgba(33,49,43,0.08)]"
                  : "border-border/80 bg-background/75 text-foreground/65 hover:bg-white/90",
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="h-[360px] px-3 pb-4 pt-4 sm:px-5">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="rgba(91,107,100,0.12)" strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "rgba(33,49,43,0.55)", fontSize: 12 }} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "rgba(33,49,43,0.55)", fontSize: 12 }}
              tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "1rem",
                border: "1px solid rgba(211,221,210,0.9)",
                background: "rgba(255,255,255,0.92)",
                boxShadow: "0 20px 60px rgba(33,49,43,0.12)",
              }}
              formatter={(value, name) => [
                formatAmount(Number(value ?? 0)),
                name === "income" ? "Income" : "Expense",
              ]}
              labelStyle={{ color: "rgba(33,49,43,0.62)", fontWeight: 600 }}
            />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#2f7d67"
              strokeWidth={3}
              dot={{ r: 0 }}
              activeDot={{ r: 5, strokeWidth: 0, fill: "#2f7d67" }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#d27768"
              strokeWidth={3}
              dot={{ r: 0 }}
              activeDot={{ r: 5, strokeWidth: 0, fill: "#d27768" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
