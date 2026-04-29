"use client";

import { useState, useEffect, useCallback } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/app/features/auth/hooks/use-auth';
import { Landmark, ArrowUpCircle, ArrowDownCircle, PiggyBank, Wallet, Sparkles } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { cn } from '@/app/lib/utils/cn';
import { formatAmount } from '@/app/lib/utils/currency';
import { formatNumber } from '@/app/lib/utils/number';
import { api } from '@/app/lib/api/client';
import type { SummaryMetric } from '../types';
import type { DashboardOverview } from '@/app/features/dashboard/types/dashboard';

const POLL_INTERVAL = 5000;

const toneStyles = {
  positive: {
    icon: 'bg-emerald-100 text-emerald-700',
    delta: 'bg-emerald-100 text-emerald-800',
  },
  warning: {
    icon: 'bg-amber-100 text-amber-700',
    delta: 'bg-amber-100 text-amber-800',
  },
  danger: {
    icon: 'bg-rose-100 text-rose-700',
    delta: 'bg-rose-100 text-rose-800',
  },
  neutral: {
    icon: 'bg-blue-100 text-blue-700',
    delta: 'bg-blue-100 text-blue-800',
  },
} as const;

function formatMetricValue(metric: SummaryMetric) {
  if (metric.format === 'currency') {
    return formatAmount(metric.value);
  }
  if (metric.format === 'percent') {
    return (metric.value / 100).toFixed(0) + '%';
  }
  return formatNumber(metric.value, { maximumFractionDigits: 0 });
}

function transformToMetrics(data: DashboardOverview): SummaryMetric[] {
  const { income, expense, balance, budgets = {} } = data;
  const monthlySavings = income - expense;
  const totalBudgetLeft = Object.values(budgets).reduce((sum, b: any) => sum + (b.remaining || 0), 0);
  const cashFlow = income - expense;

  const getDelta = (current: number, base: number) => base > 0 ? ((current - base) / base) * 100 : 0;

  return [
    {
      title: 'Total Balance',
      value: balance,
      helper: 'Net worth snapshot',
      delta: getDelta(balance, balance * 0.93),
      tone: balance >= 0 ? 'positive' : 'danger' as const,
      format: 'currency' as const,
      icon: Landmark,
    },
    {
      title: 'Income',
      value: income,
      helper: 'This month',
      delta: getDelta(income, income * 0.88),
      tone: 'positive' as const,
      format: 'currency' as const,
      icon: ArrowUpCircle,
    },
    {
      title: 'Expenses',
      value: expense,
      helper: 'This month',
      delta: getDelta(expense, expense * 1.08),
      tone: 'warning' as const,
      format: 'currency' as const,
      icon: ArrowDownCircle,
    },
    {
      title: 'Savings',
      value: monthlySavings,
      helper: 'Available this month',
      delta: getDelta(monthlySavings, monthlySavings * 0.82),
      tone: monthlySavings >= 0 ? 'positive' : 'danger' as const,
      format: 'currency' as const,
      icon: PiggyBank,
    },
    {
      title: 'Budget Left',
      value: totalBudgetLeft,
      helper: 'Remaining spending room',
      delta: getDelta(totalBudgetLeft, totalBudgetLeft * 0.91),
      tone: totalBudgetLeft >= 0 ? 'positive' : 'danger' as const,
      format: 'currency' as const,
      icon: Wallet,
    },
    {
      title: 'Cash Flow',
      value: cashFlow,
      helper: 'Income minus expense',
      delta: getDelta(cashFlow, cashFlow * 0.86),
      tone: cashFlow >= 0 ? 'positive' : 'danger' as const,
      format: 'currency' as const,
      icon: Sparkles,
    },
  ];
}

function SummaryCard({ metric }: { metric: SummaryMetric }) {
  const Icon = metric.icon;
  const tone = toneStyles[metric.tone];
  const isPositiveDelta = metric.delta >= 0;

  return (
    <Card key={metric.title} className="surface-card surface-card-hover rounded-[1.85rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.68),rgba(255,255,255,0.34))] p-5 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", tone.icon)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold", tone.delta)}>
          {isPositiveDelta ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {Math.abs(metric.delta).toFixed(1)}%
        </div>
      </div>
      <div className="mt-6 space-y-2">
        <p className="text-sm font-medium text-foreground/62">{metric.title}</p>
        <p className="text-3xl font-semibold tracking-[-0.04em] text-foreground">{formatMetricValue(metric)}</p>
        <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">{metric.helper}</p>
      </div>
    </Card>
  );
}

export default function SummaryCards() {
  const [metrics, setMetrics] = useState<SummaryMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchDashboardData = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      setMetrics([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await api.get<DashboardOverview>('/api/dashboard/', {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      const newMetrics = transformToMetrics(data);
      setMetrics(newMetrics);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch dashboard data';
      setError(message);
      console.error('[SummaryCards] Fetch error:', err);
      setMetrics([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(fetchDashboardData, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-[1.85rem] bg-muted" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid place-items-center gap-2 rounded-[1.85rem] border border-border p-8 text-center text-destructive">
        <p>{error}</p>
        <button
          onClick={fetchDashboardData}
          className="text-sm underline underline-offset-2 hover:no-underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {metrics.map((metric) => (
        <SummaryCard key={metric.title} metric={metric} />
      ))}
    </div>
  );
}
