"use client";

import { useState, useEffect, useCallback } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAuth } from '@/app/features/auth/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { cn } from '@/app/lib/utils/cn';
import { formatAmount } from '@/app/lib/utils/currency';
import { api } from '@/app/lib/api/client';
import type { CashFlowPoint, ChartRange } from '../types';
import type { DashboardOverview } from '@/app/features/dashboard/types/dashboard';
import { getMonthName } from '@/app/lib/utils/date';

const POLL_INTERVAL = 30000; // 30s

const ranges: ChartRange[] = ["Weekly", "Monthly", "Yearly"];

const weekdayLabels: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const EMPTY_SERIES: Record<ChartRange, CashFlowPoint[]> = {
  Weekly: [],
  Monthly: [],
  Yearly: [],
};

function buildCashFlowSeries(income: number, expense: number): Record<ChartRange, CashFlowPoint[]> {
  const safeIncome = Math.max(income, 4200);
  const safeExpense = Math.max(expense, 2800);

  const weeklyIncomePattern = [0.14, 0.11, 0.1, 0.15, 0.17, 0.16, 0.17];
  const weeklyExpensePattern = [0.12, 0.11, 0.14, 0.13, 0.16, 0.18, 0.16];
  const monthlyIncomePattern = [0.84, 0.9, 0.94, 1, 1.06, 1.12];
  const monthlyExpensePattern = [0.76, 0.82, 0.88, 0.96, 1.02, 1.08];
  const yearlyIncomePattern = [0.78, 0.86, 0.93, 1.02, 1.11];
  const yearlyExpensePattern = [0.7, 0.76, 0.85, 0.94, 1.05];

  const buildSeries = (
    labels: string[],
    incomeBase: number,
    expenseBase: number,
    incomePattern: number[],
    expensePattern: number[],
  ): CashFlowPoint[] =>
    labels.map((label, index) => {
      const income = Math.round(incomeBase * incomePattern[index]);
      const expense = Math.round(expenseBase * expensePattern[index]);
      return {
        label,
        income,
        expense,
        cashFlow: income - expense,
      };
    });

  const monthLabels = Array.from({ length: 6 }, (_, index) => {
    const now = new Date();
    now.setMonth(now.getMonth() - (5 - index));
    return getMonthName(now.getMonth(), "short");
  });

  const yearLabels = Array.from({ length: 5 }, (_, index) => `${new Date().getFullYear() - (4 - index)}`);

  return {
    Weekly: buildSeries(weekdayLabels, safeIncome / 4, safeExpense / 4, weeklyIncomePattern, weeklyExpensePattern),
    Monthly: buildSeries(monthLabels, safeIncome, safeExpense, monthlyIncomePattern, monthlyExpensePattern),
    Yearly: buildSeries(yearLabels, safeIncome * 12, safeExpense * 12, yearlyIncomePattern, yearlyExpensePattern),
  };
}

export default function CashFlowChart() {
  const [seriesByRange, setSeriesByRange] = useState<Record<ChartRange, CashFlowPoint[]>>(EMPTY_SERIES);
  const [activeRange, setActiveRange] = useState<ChartRange>("Monthly");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const data = seriesByRange[activeRange] || [];

  const fetchCashFlowData = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      setSeriesByRange(EMPTY_SERIES);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const overview: DashboardOverview = await api.get('/api/dashboard/');
      const newSeries = buildCashFlowSeries(overview.income, overview.expense);
      setSeriesByRange(newSeries);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch cash flow data';
      setError(message);
      console.error('[CashFlowChart] Fetch error:', err);
      setSeriesByRange(EMPTY_SERIES);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCashFlowData();
  }, [fetchCashFlowData]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(fetchCashFlowData, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchCashFlowData]);

  if (loading) {
    return (
      <Card className="surface-card rounded-[1.95rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-0 backdrop-blur-xl h-[500px]">
        <CardHeader className="flex flex-col gap-4 border-b border-border/70 px-5 py-5">
          <div className="animate-pulse">
            <div className="h-6 w-48 bg-muted rounded" />
            <div className="h-4 w-64 bg-muted/50 rounded mt-2" />
          </div>
        </CardHeader>
        <CardContent className="h-[360px] px-5 flex items-center justify-center">
          <div className="animate-pulse bg-muted h-64 w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="surface-card rounded-[1.95rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-0 backdrop-blur-xl">
        <CardHeader className="px-5 py-5">
          <CardTitle className="text-xl">Cash Flow Over Time</CardTitle>
          <CardDescription>Track whether your income curve is outpacing your spend curve.</CardDescription>
        </CardHeader>
        <CardContent className="h-[360px] px-5 flex items-center justify-center text-destructive">
          <div className="text-center">
            <p>{error}</p>
            <button
              onClick={fetchCashFlowData}
              className="mt-2 text-sm underline underline-offset-2 hover:no-underline"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

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

