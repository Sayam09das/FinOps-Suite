"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, FileDown, Sparkles, X } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/lib/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AIInsightPanelProps = {
    open: boolean;
    onClose: () => void;
};

// ─── Static insight data ──────────────────────────────────────────────────────

const STATIC_INSIGHTS = [
    {
        id: "dining",
        icon: Bot,
        text: "You overspent on dining this week vs. your four-week average.",
    },
    {
        id: "categorize",
        icon: Sparkles,
        text: "Smart categorization can auto-tag low-confidence transactions.",
    },
    {
        id: "subscriptions",
        icon: Bot,
        text: "Two subscriptions haven't been used in 60+ days — possible savings.",
    },
] as const;

const GENERATED_INSIGHTS = [
    "Your cash flow is 18% stronger than last month — consider increasing savings allocation.",
    "Peak spending occurs on Fridays — setting a daily limit could reduce leakage by ~12%.",
    "3 vendors have raised prices silently in the last 90 days. Review recurring charges.",
    "Your income-to-expense ratio improved to 1.42 — ahead of your Q2 target.",
];

// ─── Typing animation hook ────────────────────────────────────────────────────

function useTypingText(text: string, active: boolean, speedMs = 22) {
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
            i++;
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

// ─── Insight card ─────────────────────────────────────────────────────────────

function InsightCard({
    icon: Icon,
    text,
    delay = 0,
}: {
    icon: typeof Bot;
    text: string;
    delay?: number;
}) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(t);
    }, [delay]);

    return (
        <div
            className={cn(
                "flex items-start gap-3 rounded-2xl border border-white/8 bg-white/5 p-3.5 transition-all duration-500",
                visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
            )}
        >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <Icon className="h-[14px] w-[14px] text-white/75" />
            </div>
            <p className="text-[12.5px] leading-[1.65] text-white/65">{text}</p>
        </div>
    );
}

// ─── Generated insight card ───────────────────────────────────────────────────

function GeneratedCard({ text }: { text: string }) {
    const typed = useTypingText(text, true, 18);

    return (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/8 p-3.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15">
                <Sparkles className="h-[14px] w-[14px] text-emerald-300" />
            </div>
            <p className="text-[12.5px] leading-[1.65] text-emerald-200/80">
                {typed}
                {typed.length < text.length && (
                    <span className="ml-0.5 inline-block h-[13px] w-[2px] translate-y-[1px] animate-pulse rounded-sm bg-emerald-300" />
                )}
            </p>
        </div>
    );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

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

// ─── Main panel ───────────────────────────────────────────────────────────────

export default function AIInsightPanel({ open, onClose }: AIInsightPanelProps) {
    const [loading, setLoading] = useState(false);
    const [generatedInsights, setGeneratedInsights] = useState<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll when new insight added
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

    const handleGenerate = async () => {
        if (loading) return;
        setLoading(true);

        await new Promise((r) => setTimeout(r, 1400));

        const next =
            GENERATED_INSIGHTS[generatedInsights.length % GENERATED_INSIGHTS.length];
        setGeneratedInsights((prev) => [...prev, next]);
        setLoading(false);
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
            {/* Panel shell */}
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0d1117] shadow-[0_32px_80px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04)]">

                {/* Ambient glow */}
                <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-48 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-8 right-0 h-24 w-32 rounded-full bg-blue-500/8 blur-2xl" />

                {/* Header */}
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

                {/* Scrollable body */}
                <div
                    ref={scrollRef}
                    className="max-h-[360px] space-y-2.5 overflow-y-auto overscroll-contain p-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10"
                >
                    {/* Static insights */}
                    <p className="px-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/28">
                        Current signals
                    </p>
                    {STATIC_INSIGHTS.map((item, i) => (
                        <InsightCard
                            key={item.id}
                            icon={item.icon}
                            text={item.text}
                            delay={i * 80}
                        />
                    ))}

                    {/* Generated insights */}
                    {generatedInsights.length > 0 && (
                        <>
                            <p className="mt-1 px-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/28">
                                Generated
                            </p>
                            {generatedInsights.map((text, i) => (
                                <GeneratedCard key={i} text={text} />
                            ))}
                        </>
                    )}

                    {/* Loading skeleton */}
                    {loading && <LoadingSkeleton />}
                </div>

                {/* Actions */}
                <div className="flex gap-2 border-t border-white/6 p-4">
                    <button
                        type="button"
                        onClick={handleGenerate}
                        disabled={loading}
                        className={cn(
                            "flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-2.5",
                            "bg-linear-to-r from-emerald-500 to-emerald-400 text-[13px] font-semibold text-white",
                            "shadow-[0_0_20px_rgba(52,211,153,0.28)] transition-all duration-200",
                            "hover:shadow-[0_0_28px_rgba(52,211,153,0.42)] hover:brightness-110",
                            "active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-55",
                        )}
                    >
                        <Sparkles className="h-3.5 w-3.5 shrink-0" />
                        {loading ? "Generating…" : "Generate Insight"}
                    </button>

                    <button
                        type="button"
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