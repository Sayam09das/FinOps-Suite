"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Bell, Bot, FileDown, ShieldAlert, Sparkles, TrendingUp, X } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { cn } from "@/app/lib/utils/cn";
import { useDashboardOverviewQuery } from "@/app/lib/api/queries";
import { useNotifications } from "@/app/features/notifications";
import { formatCurrency } from "@/app/lib/utils/number";

export type AIInsightPanelProps = {
  open: boolean;
  onClose: () => void;
};

type InsightTone = "positive" | "warning" | "danger" | "neutral";

type LiveInsight = {
  id: string;
  icon: typeof Bot;
  title: string;
  text: string;
  tone: InsightTone;
};

const toneCardStyles: Record<InsightTone, string> = {
  positive: "border-emerald-400/18 bg-emerald-500/8",
  warning: "border-amber-400/18 bg-amber-500/8",
  danger: "border-rose-400/18 bg-rose-500/8",
  neutral: "border-white/8 bg-white/5",
};

const toneIconStyles: Record<InsightTone, string> = {
  positive: "bg-emerald-400/15 text-emerald-300",
  warning: "bg-amber-400/15 text-amber-300",
  danger: "bg-rose-400/15 text-rose-300",
  neutral: "bg-white/10 text-white/75",
};

function useTypingText(text: string, active: boolean, speedMs = 18) {
  const [displayed, setDisplayed] = useState("");
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active) {
      setDisplayed("");
      return;
    }

    setDisplayed("");
    let i = 0;

    function tick() {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i < text.length) {
        frameRef.current = setTimeout(tick, speedMs);
      }
    }

    frameRef.current = setTimeout(tick, speedMs);
    return () => {
      if (frameRef.current) clearTimeout(frameRef.current);
    };
  }, [text, active, speedMs]);

  return displayed;
}

function InsightCard({
  insight,
  delay = 0,
}: {
  insight: LiveInsight;
  delay?: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const Icon = insight.icon;

  return (
    <div
      className={cn(
        "rounded-2xl border p-3.5 transition-all duration-500",
        toneCardStyles[insight.tone],
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl", toneIconStyles[insight.tone])}>
          <Icon className="h-[14px] w-[14px]" />
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/35">
            {insight.title}
          </p>
          <p className="mt-1 text-[12.5px] leading-[1.65] text-white/70">{insight.text}</p>
        </div>
      </div>
    </div>
  );
}

function GeneratedCard({ insight }: { insight: LiveInsight }) {
  const typed = useTypingText(insight.text, true, 16);
  const Icon = insight.icon;

  return (
    <div className={cn("rounded-2xl border p-3.5", toneCardStyles[insight.tone])}>
      <div className="flex items-start gap-3">
        <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl", toneIconStyles[insight.tone])}>
          <Icon className="h-[14px] w-[14px]" />
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/35">
            {insight.title}
          </p>
          <p className="mt-1 text-[12.5px] leading-[1.65] text-white/80">
            {typed}
            {typed.length < insight.text.length && (
              <span className="ml-0.5 inline-block h-[13px] w-[2px] translate-y-[1px] animate-pulse rounded-sm bg-emerald-300" />
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/5 p-3.5">
      <div className="h-8 w-8 shrink-0 animate-pulse rounded-xl bg-white/10" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-2.5 w-4/5 animate-pulse rounded-full bg-white/10" />
        <div className="h-2.5 w-3/5 animate-pulse rounded-full bg-white/8" />
        <div className="h-2.5 w-2/3 animate-pulse rounded-full bg-white/6" />
      </div>
    </div>
  );
}

function buildLiveInsights(overview: any, notifications: Array<{ title: string; message: string; read: boolean }>): LiveInsight[] {
  const income = Number(overview?.income ?? 0);
  const expense = Number(overview?.expense ?? 0);
  const balance = Number(overview?.balance ?? income - expense);
  const budgets = Object.entries(overview?.budgets ?? {}) as Array<[string, { budget: number; spent: number; remaining: number; alert?: string }]>;
  const categoryAnalytics = Object.entries(overview?.categoryAnalytics ?? {}) as Array<[string, number]>;
  const topCategory = [...categoryAnalytics].sort((a, b) => b[1] - a[1])[0];
  const highestBudgetRisk = [...budgets].sort(([, left], [, right]) => {
    const leftUse = left.budget > 0 ? left.spent / left.budget : 0;
    const rightUse = right.budget > 0 ? right.spent / right.budget : 0;
    return rightUse - leftUse;
  })[0];
  const unreadNotifications = notifications.filter((item) => !item.read);

  const insights: LiveInsight[] = [];

  if (topCategory) {
    insights.push({
      id: "top-category",
      icon: TrendingUp,
      title: "Category pressure",
      text: `${topCategory[0]} is your hottest expense lane right now at ${formatCurrency(topCategory[1], "INR")} of tracked outflow.`,
      tone: "warning",
    });
  }

  if (highestBudgetRisk) {
    const [name, status] = highestBudgetRisk;
    const utilization = status.budget > 0 ? Math.round((status.spent / status.budget) * 100) : 0;
    insights.push({
      id: `budget-${name}`,
      icon: utilization >= 100 ? ShieldAlert : AlertTriangle,
      title: "Budget watch",
      text: `${name} is at ${utilization}% utilization with ${formatCurrency(status.remaining, "INR")} remaining.`,
      tone: utilization >= 100 ? "danger" : utilization >= 80 ? "warning" : "neutral",
    });
  }

  insights.push({
    id: "cash-flow",
    icon: balance >= 0 ? Sparkles : ShieldAlert,
    title: "Cash flow",
    text: `Income is ${formatCurrency(income, "INR")} and expenses are ${formatCurrency(expense, "INR")}, leaving a live balance of ${formatCurrency(balance, "INR")}.`,
    tone: balance >= 0 ? "positive" : "danger",
  });

  if (unreadNotifications.length > 0) {
    insights.push({
      id: "notification-feed",
      icon: Bell,
      title: "Alert feed",
      text: `${unreadNotifications.length} unread backend notification(s). Latest: ${unreadNotifications[0]?.message ?? "No details yet."}`,
      tone: "neutral",
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: "warmup",
      icon: Bot,
      title: "Warm-up",
      text: "Add transactions and budgets to unlock live AI-style signals in this deck.",
      tone: "neutral",
    });
  }

  return insights;
}

export default function AIInsightPanel({ open, onClose }: AIInsightPanelProps) {
  const { data: overview, isLoading: overviewLoading, error } = useDashboardOverviewQuery(open);
  const { data: notificationsData } = useNotifications();
  const notifications = notificationsData?.notifications ?? [];
  const liveInsights = useMemo(
    () => buildLiveInsights(overview, notifications),
    [notifications, overview],
  );

  const [loading, setLoading] = useState(false);
  const [generatedInsights, setGeneratedInsights] = useState<LiveInsight[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (generatedInsights.length > 0) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [generatedInsights]);

  useEffect(() => {
    if (!open) {
      setGeneratedInsights([]);
      setLoading(false);
    }
  }, [open]);

  const availableGeneratedInsights = useMemo(() => {
    return liveInsights.filter(
      (insight) => !generatedInsights.some((existing) => existing.id === insight.id),
    );
  }, [generatedInsights, liveInsights]);

  const handleGenerate = async () => {
    if (loading || availableGeneratedInsights.length === 0) return;
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 450));

    setGeneratedInsights((prev) => [...prev, availableGeneratedInsights[0]]);
    setLoading(false);
  };

  const handleExport = () => {
    const exportRows = [...liveInsights, ...generatedInsights].map((insight) => ({
      title: insight.title,
      insight: insight.text,
      tone: insight.tone,
    }));

    const csv = [
      "title,insight,tone",
      ...exportRows.map((row) =>
        [row.title, row.insight, row.tone]
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ai-insight-deck.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={cn(
        "fixed bottom-[5.5rem] right-4 z-50 w-[min(calc(100vw-2rem),340px)]",
        "transition-all duration-300 ease-out",
        open
          ? "pointer-events-auto translate-y-0 opacity-100 scale-100"
          : "pointer-events-none translate-y-4 opacity-0 scale-95",
      )}
      role="dialog"
      aria-label="AI Insight Deck"
      aria-modal="true"
    >
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0d1117] shadow-[0_32px_80px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04)]">
        <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-48 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 right-0 h-24 w-32 rounded-full bg-blue-500/8 blur-2xl" />

        <div className="relative flex items-start justify-between gap-3 border-b border-white/6 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/8 ring-1 ring-white/10">
              <Sparkles className="h-4 w-4 text-white/80" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
                Pro add-ons
              </p>
              <h2 className="text-[14px] font-semibold leading-tight text-white">
                AI Insight Deck
              </h2>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Badge className="border-emerald-400/25 bg-emerald-500/12 text-[10px] font-semibold text-emerald-300">
              ● Live
            </Badge>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/6 text-white/45 transition hover:bg-white/12 hover:text-white/80"
              aria-label="Close AI panel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="max-h-[360px] space-y-2.5 overflow-y-auto overscroll-contain p-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10"
        >
          <p className="px-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/28">
            Current signals
          </p>

          {(overviewLoading || loading) && generatedInsights.length === 0 ? <LoadingSkeleton /> : null}

          {!overviewLoading && error ? (
            <InsightCard
              insight={{
                id: "load-error",
                icon: ShieldAlert,
                title: "Data unavailable",
                text: `Live insight data could not be loaded: ${error.message}`,
                tone: "danger",
              }}
            />
          ) : null}

          {liveInsights.map((item, i) => (
            <InsightCard key={item.id} insight={item} delay={i * 80} />
          ))}

          {generatedInsights.length > 0 && (
            <>
              <p className="mt-1 px-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/28">
                Generated
              </p>
              {generatedInsights.map((item) => (
                <GeneratedCard key={`generated-${item.id}`} insight={item} />
              ))}
            </>
          )}

          {loading && generatedInsights.length > 0 ? <LoadingSkeleton /> : null}
        </div>

        <div className="flex gap-2 border-t border-white/6 p-4">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || availableGeneratedInsights.length === 0}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-2.5",
              "bg-linear-to-r from-emerald-500 to-emerald-400 text-[13px] font-semibold text-white",
              "shadow-[0_0_20px_rgba(52,211,153,0.28)] transition-all duration-200",
              "hover:shadow-[0_0_28px_rgba(52,211,153,0.42)] hover:brightness-110",
              "active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-55",
            )}
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            {loading ? "Analyzing…" : availableGeneratedInsights.length === 0 ? "Up to date" : "Generate Insight"}
          </button>

          <button
            type="button"
            onClick={handleExport}
            className={cn(
              "flex items-center gap-2 rounded-2xl border border-white/10 bg-white/6 px-4 py-2.5",
              "text-[13px] font-semibold text-white/58",
              "transition hover:border-white/18 hover:bg-white/10 hover:text-white/80",
              "active:scale-[0.97]",
            )}
          >
            <FileDown className="h-3.5 w-3.5 shrink-0" />
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}
