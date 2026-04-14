'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { DashboardData, Transaction } from '@/lib/api/types';
import { formatCurrency } from './dashboard-helpers';

const C = {
  primary: '#500cb0',
  secondary: '#b264ff',
  textPrimary: '#121212',
  textSecondary: '#6b7280',
};

interface Props {
  dashboard?: DashboardData | null;
  isLoading?: boolean;
}

const aggregateChartData = (
  transactions: Transaction[],
  view: 'monthly' | 'yearly',
): Array<{ month: string; earning: number; spending: number; savings: number }> => {
  const dataMap = new Map<string, { earning: number; spending: number }>();

  transactions.forEach((txn) => {
    const date = new Date(txn.date);
    const key =
      view === 'monthly'
        ? date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : date.toLocaleDateString('en-US', { month: 'short' });

    if (!dataMap.has(key)) dataMap.set(key, { earning: 0, spending: 0 });
    const entry = dataMap.get(key)!;
    if (txn.type === 'income') entry.earning += txn.amount;
    else entry.spending += txn.amount;
  });

  return Array.from(dataMap.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 12)
    .map(([month, values]) => ({
      month,
      earning: values.earning,
      spending: values.spending,
      savings: values.earning - values.spending,
    }));
};

const fallbackYearlyData = [
  { month: 'Jan', earning: 2000, spending: 1000, savings: 500 },
  { month: 'Feb', earning: 8000, spending: 3000, savings: 1500 },
  { month: 'Mar', earning: 5000, spending: 2500, savings: 1200 },
  { month: 'Apr', earning: 6500, spending: 3200, savings: 1800 },
];

const fallbackMonthlyData = [
  { month: 'W1', earning: 4000, spending: 2000, savings: 1200 },
  { month: 'W2', earning: 7000, spending: 3500, savings: 2100 },
  { month: 'W3', earning: 3500, spending: 1800, savings: 900 },
  { month: 'W4', earning: 5500, spending: 2800, savings: 1500 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-3 py-2 text-white text-sm shadow-lg"
      style={{ background: C.primary }}
    >
      <p className="font-medium mb-1">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.dataKey} className="text-xs opacity-90">
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
};

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-1.5">
    <span className="w-2 h-2 rounded-full inline-block" style={{ background: color }} />
    <span className="text-xs" style={{ color: C.textSecondary }}>
      {label}
    </span>
  </div>
);

const CreditCard = ({ balance = 0 }: { balance?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.2, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    className="rounded-2xl p-4 text-white relative overflow-hidden"
    style={{ background: `linear-gradient(135deg, ${C.primary} 0%, ${C.secondary} 100%)` }}
  >
    <div
      className="absolute -right-6 -top-6 w-28 h-28 rounded-full opacity-20"
      style={{ background: '#fff' }}
    />
    <div className="flex justify-between items-center mb-4">
      <div
        className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
        style={{ background: 'rgba(255,255,255,0.22)' }}
      >
        <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
        Active
      </div>
      <div className="flex">
        <div className="w-6 h-6 rounded-full bg-red-400 opacity-90" />
        <div
          className="w-6 h-6 rounded-full -ml-2.5"
          style={{ background: '#fbbf24', opacity: 0.85 }}
        />
      </div>
    </div>
    <div className="w-8 h-6 rounded-sm mb-3" style={{ background: 'rgba(255,255,255,0.35)' }} />
    <div className="grid grid-cols-3 gap-2 text-xs">
      <div>
        <p className="opacity-60 text-[10px] mb-0.5">Balance</p>
        <p className="font-medium tracking-wide">{formatCurrency(balance)}</p>
      </div>
      <div>
        <p className="opacity-60 text-[10px] mb-0.5">Card</p>
        <p className="font-medium">•••• 6782</p>
      </div>
      <div>
        <p className="opacity-60 text-[10px] mb-0.5">EXP</p>
        <p className="font-medium">09/29</p>
      </div>
    </div>
  </motion.div>
);

const SpendingLimit = ({ used = 0, total = 20000 }: { used?: number; total?: number }) => {
  const pct = total > 0 ? (used / total) * 100 : 0;

  return (
    <div>
      <p className="text-xs mb-1" style={{ color: C.textSecondary }}>
        Spending limit
      </p>
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-lg font-medium" style={{ color: C.textPrimary }}>
          {formatCurrency(used)}
        </span>
        <span className="text-xs" style={{ color: C.textSecondary }}>
          of {formatCurrency(total)}
        </span>
      </div>
      <div className="mt-2 h-1.5 rounded-full overflow-hidden bg-gray-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(pct, 100)}%` }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${C.primary}, ${C.secondary})` }}
        />
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4 p-4 sm:p-6 bg-white rounded-2xl border border-gray-100">
    <div className="h-4 bg-gray-200 rounded w-1/3" />
    <div className="h-52 bg-gray-200 rounded-2xl" />
  </div>
);

const CHART_HEIGHT = 200;

const ChartPane = ({
  data,
  visible,
}: {
  data: typeof fallbackYearlyData;
  visible: boolean;
}) => (
  <div
    className="transition-opacity duration-200"
    style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none', height: CHART_HEIGHT }}
  >
    <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="gradEarning" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={C.primary} stopOpacity={0.18} />
            <stop offset="95%" stopColor={C.primary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="4 4" stroke="#f0f0f0" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: C.textSecondary }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: C.textSecondary }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : String(v))}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: C.primary, strokeWidth: 1, strokeDasharray: '4 4' }} />
        <Area
          type="monotone"
          dataKey="earning"
          name="Earning"
          stroke={C.primary}
          strokeWidth={2.5}
          fill="url(#gradEarning)"
          dot={false}
          activeDot={{ r: 5, fill: C.primary, stroke: '#fff', strokeWidth: 2 }}
        />
        <Area
          type="monotone"
          dataKey="spending"
          name="Spending"
          stroke="#86efac"
          strokeWidth={2}
          fill="transparent"
          dot={false}
          activeDot={{ r: 4, fill: '#86efac' }}
        />
        <Area
          type="monotone"
          dataKey="savings"
          name="Savings"
          stroke="#bbf7d0"
          strokeWidth={2}
          fill="transparent"
          dot={false}
          activeDot={{ r: 4, fill: '#bbf7d0' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default function Transactioncards({ dashboard, isLoading }: Props) {
  const [view, setView] = useState<'monthly' | 'yearly'>('yearly');
  const [transitioning, setTransitioning] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const transactions = useMemo(() => dashboard?.recentTransactions ?? [], [dashboard]);
  const chartData = useMemo(() => aggregateChartData(transactions, view), [transactions, view]);
  const data =
    chartData.length > 0
      ? chartData
      : view === 'yearly'
        ? fallbackYearlyData
        : fallbackMonthlyData;

  const totalIncome = useMemo(
    () => transactions.reduce((sum, t) => (t.type === 'income' ? sum + t.amount : sum), 0),
    [transactions],
  );
  const totalExpense =
    dashboard?.expense ??
    transactions.reduce((sum, t) => (t.type === 'expense' ? sum + t.amount : sum), 0);
  const totalBalance = dashboard?.balance ?? 0;
  const spendingTotal = useMemo(
    () => Object.values(dashboard?.budgets ?? {}).reduce((sum, b) => sum + b.budget, 0) || 20638,
    [dashboard],
  );

  const handleViewChange = (next: 'monthly' | 'yearly') => {
    if (next === view) return;
    setTransitioning(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setView(next);
      setTransitioning(false);
    }, 180);
  };

  if (isLoading) return <LoadingSkeleton />;

  if (!isMounted) {
    return (
      <div className="px-0 font-sans">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <LoadingSkeleton />
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-0 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">

        {/* Left: Transactions Overview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-2xl border border-gray-100 p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-sm mb-1" style={{ color: C.textSecondary }}>
                Transactions Overview
              </p>
              <div className="flex items-center gap-2">
                <span
                  className="text-2xl sm:text-3xl font-semibold"
                  style={{ color: C.textPrimary }}
                >
                  {formatCurrency(totalIncome)}
                </span>
                <span className="text-xs font-medium rounded-full px-2 py-0.5 bg-green-50 text-green-600">
                  ↑ {transactions.length > 0 ? 'Live data' : 'Demo'}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              {/* Toggle pill — always rendered, no conditional AnimatePresence */}
              <div className="relative flex items-center gap-0 rounded-full p-1 bg-gray-50 border border-gray-100">
                {(['monthly', 'yearly'] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => handleViewChange(v)}
                    className="relative z-10 rounded-full px-4 py-1 text-xs font-medium transition-colors duration-150"
                    style={{ color: view === v ? '#fff' : C.textSecondary }}
                  >
                    {v === view && (
                      <motion.span
                        layoutId="chart-toggle-pill"
                        className="absolute inset-0 rounded-full -z-10"
                        style={{ background: C.primary }}
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 flex-wrap justify-end">
                <LegendDot color={C.primary} label="Earning" />
                <LegendDot color="#86efac" label="Spending" />
                <LegendDot color="#bbf7d0" label="Savings" />
              </div>
            </div>
          </div>

          {/* Chart — always mounted, opacity-only transition avoids -1 dimension bug */}
          <ChartPane data={data} visible={!transitioning} />
        </motion.div>

        {/* Right: My Cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[15px] font-medium" style={{ color: C.textPrimary }}>
                My Cards
              </p>
              <p className="text-xs" style={{ color: C.textSecondary }}>
                Total balance {formatCurrency(totalBalance)}
              </p>
            </div>
            <button
              type="button"
              className="text-lg tracking-widest leading-none"
              style={{ color: C.textSecondary }}
              aria-label="More options"
            >
              ···
            </button>
          </div>

          <CreditCard balance={totalBalance} />
          <SpendingLimit used={totalExpense} total={spendingTotal} />
        </motion.div>
      </div>
    </div>
  );
}
