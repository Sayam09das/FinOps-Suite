'use client';

import { MessageSquareText, Sparkles } from 'lucide-react';
import type { DashboardData } from '@/lib/api/types';
import { formatCurrency } from '../dashboard-helpers';

type DashchatProps = {
  dashboard: DashboardData | null;
  displayName: string;
  searchValue?: string;
};

export default function Dashchat({
  dashboard,
  displayName,
  searchValue = '',
}: DashchatProps) {
  const prompts = [
    {
      question: 'What changed in my dashboard?',
      answer: `Your latest balance is ${formatCurrency(
        dashboard?.balance ?? 0,
      )} with ${formatCurrency(dashboard?.income ?? 0)} income and ${formatCurrency(
        dashboard?.expense ?? 0,
      )} expenses.`,
    },
    {
      question: 'Which category should I watch?',
      answer: Object.entries(dashboard?.categoryAnalytics ?? {}).sort(
        ([, leftAmount], [, rightAmount]) => rightAmount - leftAmount,
      )[0]
        ? `${Object.entries(dashboard?.categoryAnalytics ?? {}).sort(
            ([, leftAmount], [, rightAmount]) => rightAmount - leftAmount,
          )[0]?.[0]} is currently your largest tracked category.`
        : 'Add some transactions and I can highlight your biggest category.',
    },
    {
      question: 'Do I have any budget alerts?',
      answer:
        Object.values(dashboard?.budgets ?? {}).find((budget) => budget.alert)?.alert ??
        'No active budget alerts right now.',
    },
  ].filter((item) =>
    searchValue.trim()
      ? item.question.toLowerCase().includes(searchValue.trim().toLowerCase()) ||
        item.answer.toLowerCase().includes(searchValue.trim().toLowerCase())
      : true,
  );

  return (
    <section className="rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <MessageSquareText className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-slate-950">
            Assistant panel for {displayName}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            This section is now connected into the dashboard layout and can answer
            quick questions from the current dashboard data.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          {searchValue.trim()
            ? `Filtered with "${searchValue.trim()}"`
            : 'Use the navbar search to narrow these assistant cards.'}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {prompts.length ? (
          prompts.map((item) => (
            <article
              key={item.question}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-950">
                {item.question}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{item.answer}</p>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-12 text-center text-sm text-slate-500 lg:col-span-3">
            No assistant cards match the current search.
          </div>
        )}
      </div>
    </section>
  );
}
