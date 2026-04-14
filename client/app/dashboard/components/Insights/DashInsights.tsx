'use client';

import { AlertTriangle, Lightbulb, PiggyBank, Wallet } from 'lucide-react';
import type { DashboardData } from '@/lib/api/types';
import { formatCurrency, formatPercent } from '../dashboard-helpers';

type DashInsightsProps = {
  dashboard: DashboardData | null;
};

export default function DashInsights({ dashboard }: DashInsightsProps) {
  const income = dashboard?.income ?? 0;
  const expense = dashboard?.expense ?? 0;
  const balance = dashboard?.balance ?? 0;
  const savingsRate = income > 0 ? (balance / income) * 100 : 0;

  const topCategory = Object.entries(dashboard?.categoryAnalytics ?? {}).sort(
    ([, leftAmount], [, rightAmount]) => rightAmount - leftAmount,
  )[0];

  const budgetAlerts = Object.entries(dashboard?.budgets ?? {}).filter(
    ([, budget]) => Boolean(budget.alert),
  );

  const cards = [
    {
      title: 'Net balance insight',
      value: formatCurrency(balance),
      description:
        balance >= 0
          ? 'You are operating with a positive balance right now.'
          : 'Expenses are currently outpacing income.',
      icon: Wallet,
      accent: 'bg-blue-50 text-blue-700',
    },
    {
      title: 'Savings rate',
      value: formatPercent(savingsRate),
      description: 'Share of income left after expenses.',
      icon: PiggyBank,
      accent: 'bg-emerald-50 text-emerald-700',
    },
    {
      title: 'Top category',
      value: topCategory?.[0] ?? 'No category yet',
      description: topCategory
        ? `${formatCurrency(topCategory[1])} tracked in this category.`
        : 'Add some transactions to generate insight cards.',
      icon: Lightbulb,
      accent: 'bg-amber-50 text-amber-700',
    },
  ];

  return (
    <section className="rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="grid gap-4 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
          >
            <div
              className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${card.accent}`}
            >
              <card.icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-medium text-slate-500">{card.title}</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">{card.value}</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {card.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-slate-950">Budget attention</h2>
            <p className="text-sm text-slate-500">
              Categories that currently need a closer look.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {budgetAlerts.length ? (
            budgetAlerts.map(([category, budget]) => (
              <div
                key={category}
                className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
              >
                <span className="font-semibold">{category}</span>
                <span className="text-amber-800"> {budget.alert}</span>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
              No active budget alerts right now. Income is {formatCurrency(income)}
              {' '}and expenses are {formatCurrency(expense)}.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
