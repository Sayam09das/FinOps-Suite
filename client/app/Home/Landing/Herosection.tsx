"use client";

import Link from "next/link";
import {
    motion,
    useReducedMotion,
    type Variants,
} from "framer-motion";
import {
    Activity,
    ArrowDownLeft,
    ArrowUpRight,
    Check,
    ChevronsLeftRight,
    ShieldCheck,
    Sparkles,
    X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const balanceHistory = [
    { month: "Oct", value: 6200 },
    { month: "Nov", value: 7800 },
    { month: "Dec", value: 7100 },
    { month: "Jan", value: 8400 },
    { month: "Feb", value: 7600 },
    { month: "Mar", value: 9823 },
];

const spendingData = [
    { week: "W1", amount: 820 },
    { week: "W2", amount: 1240 },
    { week: "W3", amount: 4239 },
    { week: "W4", amount: 980 },
    { week: "W5", amount: 1560 },
];

const smoothEase = [0.22, 1, 0.36, 1] as const;

const stagger: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09 } },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 32 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: smoothEase },
    },
};

const slideRight: Variants = {
    hidden: { opacity: 0, x: 60, scale: 0.97 },
    show: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: { duration: 0.75, ease: smoothEase, delay: 0.2 },
    },
};

const floatAnim: Variants = {
    animate: {
        y: [0, -10, 0],
        transition: { duration: 4.5, repeat: Infinity, ease: "easeInOut" as const },
    },
};

function CustomBarTooltip({ active, payload }: any) {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-xl bg-gray-950 px-3 py-2 text-xs font-bold text-white shadow-xl">
            ${payload[0].value.toLocaleString()}
        </div>
    );
}

function CustomAreaTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-xl border border-gray-100 bg-white px-3 py-2 text-xs font-semibold text-gray-800 shadow-lg">
            <p className="mb-0.5 text-gray-400">{label}</p>
            <p className="text-blue-600">${payload[0].value.toLocaleString()}</p>
        </div>
    );
}

function Badge({ children }: { children: ReactNode }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-700">
            {children}
        </span>
    );
}

function StatPill({
    label,
    value,
    up,
}: {
    label: string;
    value: string;
    up: boolean;
}) {
    return (
        <div className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-2.5">
            <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    up ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-500"
                }`}
            >
                {up ? "↑" : "↓"}
            </span>
            <div>
                <p className="text-[10px] leading-none text-gray-400">{label}</p>
                <p className="text-sm font-black text-gray-900">{value}</p>
            </div>
        </div>
    );
}

function SubscriptionRow({
    name,
    amount,
    logo,
    color,
    note,
}: {
    name: string;
    amount: string;
    logo: ReactNode;
    color: string;
    note: string;
}) {
    return (
        <div className="flex items-center justify-between rounded-[20px] border border-slate-200/80 bg-white/85 px-3.5 py-3 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_16px_34px_rgba(15,23,42,0.08)]">
            <div className="flex items-center gap-3">
                <span
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-sm ${color}`}
                >
                    {logo}
                </span>
                <div>
                    <span className="block text-[13px] font-semibold text-gray-900">{name}</span>
                    <span className="block text-[11px] font-medium text-gray-400">{note}</span>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="text-right">
                    <span className="block text-[13px] font-bold text-gray-900">
                        {amount}
                        <span className="text-xs font-normal text-gray-400">/mo</span>
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600">Active</span>
                </div>
                <div className="flex gap-1.5">
                    <button className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-colors hover:bg-slate-200">
                        <X size={12} strokeWidth={2.5} />
                    </button>
                    <button className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white transition-colors hover:bg-emerald-600">
                        <Check size={12} strokeWidth={2.7} />
                    </button>
                </div>
            </div>
        </div>
    );
}

function ActionButton({ icon, label }: { icon: ReactNode; label: string }) {
    return (
        <button className="group flex flex-col items-center gap-1.5 rounded-2xl px-3 py-2 transition-all hover:bg-white/6">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 group-hover:bg-white group-hover:text-slate-900">
                {icon}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 transition-colors group-hover:text-white">
                {label}
            </span>
        </button>
    );
}

function OverviewMetric({
    icon,
    label,
    value,
    change,
}: {
    icon: ReactNode;
    label: string;
    value: string;
    change: string;
}) {
    return (
        <div className="rounded-[22px] border border-slate-200/80 bg-white/90 p-3.5 shadow-[0_14px_32px_rgba(15,23,42,0.05)]">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                        {label}
                    </p>
                    <p className="mt-1.5 font-display text-[22px] font-black tracking-tight text-slate-950">
                        {value}
                    </p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_12px_24px_rgba(15,23,42,0.16)]">
                    {icon}
                </span>
            </div>
            <p className="mt-2.5 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-600">
                {change}
            </p>
        </div>
    );
}

export default function FinSuiteHero() {
    const shouldReduce = useReducedMotion();
    const [chartsReady, setChartsReady] = useState(false);

    useEffect(() => {
        setChartsReady(true);
    }, []);

    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-[#f7f7fc] font-sans selection:bg-blue-200">
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-violet-200/30 blur-3xl" />
                <div className="absolute top-1/2 -right-20 h-[400px] w-[400px] rounded-full bg-blue-200/30 blur-3xl" />
                <div className="absolute bottom-0 left-1/3 h-[280px] w-[280px] rounded-full bg-emerald-100/40 blur-3xl" />
            </div>

            <div className="relative z-10 mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:gap-8 lg:px-16 xl:py-24">
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="show"
                    className="flex flex-col items-start gap-7 font-body"
                >
                    <motion.div variants={fadeUp}>
                        <Badge>Finance Solutions for You</Badge>
                    </motion.div>

                    <motion.h1
                        variants={fadeUp}
                        className="font-display text-5xl font-black leading-[1.04] tracking-tight text-gray-950 sm:text-6xl xl:text-[70px]"
                    >
                        Maximize
                        <span className="ml-3 hidden -translate-y-1 items-center gap-2 sm:inline-flex">
                            <motion.span
                                whileHover={{ rotate: 15, scale: 1.1 }}
                                className="inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-950 shadow-lg"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2.2"
                                    className="h-5 w-5"
                                >
                                    <path d="M21 21H3M21 3 3 21M21 3v7M21 3h-7" />
                                </svg>
                            </motion.span>
                            <motion.span
                                whileHover={{ rotate: -10, scale: 1.1 }}
                                className="inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-lime-400 shadow-lg"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2.5"
                                    className="h-5 w-5"
                                >
                                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                                    <polyline points="16 7 22 7 22 13" />
                                </svg>
                            </motion.span>
                        </span>
                        <br />
                        Your{" "}
                        <span className="relative inline-block">
                            <span className="text-blue-500">Financial</span>
                            <svg
                                className="absolute -bottom-1 left-0 w-full"
                                viewBox="0 0 240 8"
                                preserveAspectRatio="none"
                                fill="none"
                            >
                                <motion.path
                                    d="M2 6 Q60 1 120 5 Q180 9 238 4"
                                    stroke="#3b82f6"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.9, delay: 0.65, ease: "easeOut" }}
                                />
                            </svg>
                        </span>
                        <br />
                        Potential
                    </motion.h1>

                    <motion.p
                        variants={fadeUp}
                        className="max-w-sm text-base leading-relaxed text-gray-500"
                    >
                        Welcome to FinSuite, where financial management meets simplicity and
                        efficiency — built for the way you live.
                    </motion.p>

                    <motion.div variants={fadeUp} className="flex flex-wrap gap-2.5">
                        <StatPill label="Monthly growth" value="+$2,832" up />
                        <StatPill label="Subscriptions" value="$37/mo" up={false} />
                        <StatPill label="Saved this year" value="$14.2K" up />
                    </motion.div>

                    <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
                        <Link
                            href="/register"
                            className="group inline-flex items-center gap-2.5 rounded-full bg-gray-950 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-gray-950/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-gray-950/30 active:translate-y-0"
                        >
                            Get Started
                            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </Link>
                        <Link
                            href="/#dashboard-preview"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-gray-900"
                        >
                            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-100 bg-white text-sm text-gray-700 shadow-md">
                                ▶
                            </span>
                            Watch demo
                        </Link>
                    </motion.div>

                    <motion.div variants={fadeUp} className="flex items-center gap-3 pt-1">
                        <div className="flex -space-x-2">
                            {[
                                { c: "bg-violet-400", l: "A" },
                                { c: "bg-blue-400", l: "B" },
                                { c: "bg-emerald-400", l: "C" },
                                { c: "bg-amber-400", l: "D" },
                            ].map(({ c, l }, i) => (
                                <span
                                    key={i}
                                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white ${c}`}
                                >
                                    {l}
                                </span>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400">
                            <span className="font-semibold text-gray-700">12,000+</span> users trust
                            FinSuite
                        </p>
                    </motion.div>
                </motion.div>

                <motion.div
                    variants={slideRight}
                    initial="hidden"
                    animate="show"
                    className="relative flex justify-center lg:justify-end"
                >
                    <div className="relative w-full max-w-[460px]">
                        <motion.div
                            variants={shouldReduce ? undefined : floatAnim}
                            animate="animate"
                            className="absolute right-0 top-4 z-30 w-40 rounded-[22px] border border-white/15 bg-[linear-gradient(145deg,#3b82f6_0%,#2155d6_100%)] p-3.5 text-white shadow-[0_28px_60px_rgba(37,99,235,0.32)] sm:-right-6 sm:-top-6 sm:w-52"
                        >
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/18 ring-1 ring-white/15">
                                        <svg viewBox="0 0 24 24" fill="white" className="h-5 w-5">
                                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                                        </svg>
                                    </span>
                                    <div>
                                        <span className="font-display text-base font-bold text-white">
                                            Spotify
                                        </span>
                                        <p className="text-[11px] font-medium text-blue-100">
                                            Recurring billing
                                        </p>
                                    </div>
                                </div>
                                <span className="rounded-full bg-white/14 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-50">
                                    Live
                                </span>
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="font-display text-3xl font-black text-white">
                                        $13<span className="text-sm font-normal opacity-70">/mo</span>
                                    </p>
                                    <p className="mt-1 text-[11px] font-medium text-blue-100">
                                        Next renewal in 4 days
                                    </p>
                                </div>
                                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/16 text-white transition-colors hover:bg-white/24">
                                    <Check size={16} strokeWidth={2.8} />
                                </button>
                            </div>
                            <div className="mt-4 h-2 rounded-full bg-white/12">
                                <div className="h-2 w-[72%] rounded-full bg-white" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={shouldReduce ? undefined : { opacity: 0, y: 18 }}
                            animate={shouldReduce ? undefined : { opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.45, ease: smoothEase }}
                            className="absolute -bottom-4 left-0 z-20 hidden rounded-[20px] border border-white/80 bg-white/92 px-3.5 py-2.5 shadow-[0_18px_40px_rgba(148,163,184,0.18)] backdrop-blur-xl sm:block"
                        >
                            <div className="flex items-center gap-3">
                                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                                    <ShieldCheck size={20} strokeWidth={2.2} />
                                </span>
                                <div>
                                    <p className="text-sm font-bold text-slate-950">
                                        Protected cash flow
                                    </p>
                                    <p className="text-[11px] font-medium text-slate-400">
                                        98.2% bill success this month
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <div className="relative z-10 w-full overflow-hidden rounded-[32px] border border-white/85 bg-white/92 p-4 shadow-[0_40px_90px_rgba(148,163,184,0.24)] backdrop-blur-xl">
                            <div
                                aria-hidden
                                className="absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_55%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.14),transparent_48%)]"
                            />

                            <div className="relative space-y-3">
                                <div className="flex items-center gap-1.5">
                                    <span className="h-3 w-3 rounded-full bg-red-400" />
                                    <span className="h-3 w-3 rounded-full bg-yellow-400" />
                                    <span className="h-3 w-3 rounded-full bg-green-400" />
                                    <div className="ml-3 flex h-9 flex-1 items-center justify-between rounded-2xl border border-slate-200/80 bg-white/90 px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                                        <span className="font-mono text-[10px] text-slate-400">
                                            app.finsuite.io/dashboard
                                        </span>
                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-600">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            secure
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-slate-200/70 bg-white/80 px-4 py-3.5 shadow-[0_14px_32px_rgba(15,23,42,0.04)]">
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                                            Portfolio overview
                                        </p>
                                        <h3 className="mt-1 font-display text-[24px] font-black tracking-tight text-slate-950">
                                            Your finance cockpit
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-2 rounded-full bg-slate-950 px-3.5 py-2 text-white shadow-[0_14px_28px_rgba(15,23,42,0.16)]">
                                        <Sparkles size={14} />
                                        <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">
                                            AI synced
                                        </span>
                                    </div>
                                </div>

                                <div className="grid gap-2.5 sm:grid-cols-2">
                                    <OverviewMetric
                                        icon={<Activity size={18} strokeWidth={2.2} />}
                                        label="Available cash"
                                        value="$9.8K"
                                        change="+12.4% vs last month"
                                    />
                                    <OverviewMetric
                                        icon={<Sparkles size={18} strokeWidth={2.2} />}
                                        label="Burn rate"
                                        value="$4.2K"
                                        change="Healthy runway this quarter"
                                    />
                                </div>

                                <div className="grid gap-3 sm:grid-cols-[1.04fr_0.96fr]">
                                    <div className="rounded-[28px] border border-slate-200/70 bg-slate-50/85 p-4">
                                        <div className="mb-3 flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                                                    Active subscriptions
                                                </p>
                                                <p className="mt-1 text-sm font-semibold text-slate-900">
                                                    Recurring spend
                                                </p>
                                            </div>
                                            <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600">
                                                2 active
                                            </span>
                                        </div>
                                        <div className="space-y-2.5">
                                            <SubscriptionRow
                                                name="Netflix"
                                                amount="$24"
                                                note="Renews on 14 Apr"
                                                color="bg-red-600"
                                                logo={<span className="text-base font-black leading-none">N</span>}
                                            />
                                            <SubscriptionRow
                                                name="Amazon Prime"
                                                amount="$15"
                                                note="Family plan"
                                                color="bg-amber-500"
                                                logo={
                                                    <svg viewBox="0 0 24 24" fill="white" className="h-4 w-4">
                                                        <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.685zm3.186 7.705c-.209.189-.512.201-.745.076-1.047-.872-1.234-1.276-1.814-2.106-1.734 1.767-2.962 2.297-5.209 2.297-2.66 0-4.731-1.641-4.731-4.925 0-2.565 1.391-4.309 3.37-5.164 1.716-.754 4.11-.891 5.942-1.099v-.41c0-.753.06-1.642-.383-2.294-.385-.579-1.124-.818-1.775-.818-1.205 0-2.277.618-2.54 1.897-.054.285-.261.567-.549.582l-3.065-.333c-.259-.056-.548-.266-.472-.66.705-3.716 4.06-4.836 7.066-4.836 1.537 0 3.547.41 4.758 1.574 1.538 1.436 1.392 3.352 1.392 5.438v4.923c0 1.481.616 2.13 1.194 2.931.204.285.249.628-.012.839l-2.428 2.088z" />
                                                    </svg>
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="rounded-[28px] bg-[linear-gradient(145deg,#10131f_0%,#1f2937_100%)] p-4 text-white shadow-[0_26px_60px_rgba(15,23,42,0.26)]">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
                                                    Main balance
                                                </p>
                                                <p className="font-display text-[30px] font-black tracking-tight">
                                                    $9,823.28
                                                </p>
                                                <p className="mt-1 text-[11px] font-semibold text-emerald-400">
                                                    +$2,832.19 this month
                                                </p>
                                            </div>
                                            <span className="inline-flex items-center gap-1 rounded-full bg-white/8 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-200">
                                                <Activity size={12} />
                                                synced
                                            </span>
                                        </div>
                                        <div className="mt-3 grid grid-cols-2 gap-2.5">
                                            <div className="rounded-2xl border border-white/10 bg-white/6 p-2.5">
                                                <p className="text-[9px] uppercase tracking-[0.22em] text-slate-400">
                                                    Income
                                                </p>
                                                <p className="mt-1.5 text-base font-bold text-white">$12.4K</p>
                                            </div>
                                            <div className="rounded-2xl border border-white/10 bg-white/6 p-2.5">
                                                <p className="text-[9px] uppercase tracking-[0.22em] text-slate-400">
                                                    Saved
                                                </p>
                                                <p className="mt-1.5 text-base font-bold text-white">$4.1K</p>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex justify-around border-t border-white/10 pt-2.5">
                                            <ActionButton
                                                icon={<ArrowUpRight size={15} strokeWidth={2.5} />}
                                                label="Send"
                                            />
                                            <ActionButton
                                                icon={<ArrowDownLeft size={15} strokeWidth={2.5} />}
                                                label="Receive"
                                            />
                                            <ActionButton
                                                icon={<ChevronsLeftRight size={15} strokeWidth={2.5} />}
                                                label="Convert"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/85 p-3.5">
                                        <div className="mb-3 flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                                                    Weekly spending
                                                </p>
                                                <p className="mt-1 text-sm font-semibold text-slate-900">
                                                    Expense rhythm
                                                </p>
                                            </div>
                                            <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600">
                                                April 2026
                                            </span>
                                        </div>
                                        <div className="h-24 min-w-0 w-full">
                                            {chartsReady ? (
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart
                                                        data={spendingData}
                                                        barSize={28}
                                                        margin={{ top: 8, right: 4, bottom: 0, left: -24 }}
                                                    >
                                                        <defs>
                                                            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="0%" stopColor="#8b5cf6" />
                                                                <stop offset="100%" stopColor="#c4b5fd" />
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid
                                                            vertical={false}
                                                            strokeDasharray="3 3"
                                                            stroke="#efefef"
                                                        />
                                                        <XAxis
                                                            dataKey="week"
                                                            tick={{ fontSize: 10, fill: "#9ca3af" }}
                                                            axisLine={false}
                                                            tickLine={false}
                                                        />
                                                        <YAxis
                                                            tick={{ fontSize: 9, fill: "#d1d5db" }}
                                                            axisLine={false}
                                                            tickLine={false}
                                                        />
                                                        <Tooltip
                                                            content={<CustomBarTooltip />}
                                                            cursor={{ fill: "rgba(139,92,246,0.06)" }}
                                                        />
                                                        <Bar
                                                            dataKey="amount"
                                                            fill="url(#barGrad)"
                                                            radius={[6, 6, 0, 0]}
                                                        />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            ) : (
                                                <div className="h-full w-full animate-pulse rounded-2xl bg-gradient-to-r from-slate-100 via-white to-slate-100" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/85 p-3.5">
                                        <div className="mb-3 flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                                                    Balance trend
                                                </p>
                                                <p className="mt-1 text-sm font-semibold text-slate-900">
                                                    Growth momentum
                                                </p>
                                            </div>
                                            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-500">
                                                6 months
                                            </span>
                                        </div>
                                        <div className="h-24 min-w-0 w-full">
                                            {chartsReady ? (
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart
                                                        data={balanceHistory}
                                                        margin={{ top: 5, right: 4, bottom: 0, left: -24 }}
                                                    >
                                                        <defs>
                                                            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid
                                                            vertical={false}
                                                            strokeDasharray="3 3"
                                                            stroke="#efefef"
                                                        />
                                                        <XAxis
                                                            dataKey="month"
                                                            tick={{ fontSize: 10, fill: "#9ca3af" }}
                                                            axisLine={false}
                                                            tickLine={false}
                                                        />
                                                        <YAxis
                                                            tick={{ fontSize: 9, fill: "#d1d5db" }}
                                                            axisLine={false}
                                                            tickLine={false}
                                                        />
                                                        <Tooltip content={<CustomAreaTooltip />} />
                                                        <Area
                                                            type="monotone"
                                                            dataKey="value"
                                                            stroke="#3b82f6"
                                                            strokeWidth={2.5}
                                                            fill="url(#areaGrad)"
                                                            dot={{ r: 3, fill: "#3b82f6", strokeWidth: 0 }}
                                                            activeDot={{
                                                                r: 5,
                                                                fill: "#3b82f6",
                                                                stroke: "white",
                                                                strokeWidth: 2,
                                                            }}
                                                        />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            ) : (
                                                <div className="h-full w-full animate-pulse rounded-2xl bg-gradient-to-r from-slate-100 via-white to-slate-100" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            aria-hidden
                            className="absolute inset-4 -z-10 rounded-3xl bg-blue-200/40 blur-2xl"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
