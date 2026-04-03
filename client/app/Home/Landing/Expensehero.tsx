"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
    Apple,
    Home,
    Car,
    PiggyBank,
    Gamepad2,
    TrendingUp,
    ArrowRight,
    Check,
    X,
    Sparkles,
} from "lucide-react";

const categories = [
    {
        label: "Rent and Living",
        amount: "$3,838.25",
        percent: "55%",
        color: "#7C3AED",
        icon: Home,
        value: 55,
    },
    {
        label: "Transportation",
        amount: "$1,220.45",
        percent: "20%",
        color: "#22C55E",
        icon: Car,
        value: 20,
    },
    {
        label: "Saving",
        amount: "$984.93",
        percent: "15%",
        color: "#3B82F6",
        icon: PiggyBank,
        value: 15,
    },
    {
        label: "Entertainment",
        amount: "$735.12",
        percent: "10%",
        color: "#A855F7",
        icon: Gamepad2,
        value: 10,
    },
];

const COLORS = ["#7C3AED", "#22C55E", "#3B82F6", "#A855F7"];

const fadeUp: any = {
    hidden: { opacity: 0, y: 30 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { 
            delay: i * 0.12, 
            duration: 0.55, 
            ease: "easeOut" 
        },
    }),
};

const cardFloat: any = {
    animate: {
        y: [0, -10, 0],
        rotate: [-2, -4, -2],
        transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    },
};

const cardFloat2: any = {
    animate: {
        y: [0, 8, 0],
        transition: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
    },
};

export default function ExpenseHero() {
    const [toggled, setToggled] = useState(true);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [count, setCount] = useState(0);

    useEffect(() => {
        let frame: number;
        const target = 1928;
        const step = () => {
            setCount((c) => {
                if (c < target) {
                    frame = requestAnimationFrame(step);
                    return Math.min(c + Math.ceil((target - c) / 12), target);
                }
                return c;
            });
        };
        const t = setTimeout(() => {
            frame = requestAnimationFrame(step);
        }, 900);
        return () => {
            clearTimeout(t);
            cancelAnimationFrame(frame);
        };
    }, []);

    return (
        <div
            style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
            className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/40 to-blue-50/30 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16"
        >
            {/* Google Font */}
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>

            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                {/* ── LEFT: Copy ── */}
                <div className="flex flex-col gap-6 order-2 lg:order-1 text-center lg:text-left">
                    {/* Badge */}
                    <motion.div
                        custom={0}
                        variants={fadeUp}
                        initial="hidden"
                        animate="show"
                        className="inline-flex items-center gap-2 self-center lg:self-start bg-white border border-purple-200 rounded-full px-4 py-2 shadow-sm"
                    >
                        <Sparkles size={14} className="text-purple-500" />
                        <span className="text-xs font-600 text-purple-600 tracking-wide uppercase">
                            Smart Finance Tracker
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        custom={1}
                        variants={fadeUp}
                        initial="hidden"
                        animate="show"
                        className="text-4xl sm:text-5xl lg:text-[3.25rem] font-800 leading-[1.1] text-slate-900"
                        style={{ fontWeight: 800 }}
                    >
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-500">
                            Track
                        </span>{" "}
                        Your all the
                        <br />
                        Expense Easily
                    </motion.h1>

                    {/* Body */}
                    <motion.p
                        custom={2}
                        variants={fadeUp}
                        initial="hidden"
                        animate="show"
                        className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-md mx-auto lg:mx-0"
                    >
                        Effortlessly monitor and manage all your expenses with our intuitive
                        tracking system. Stay on top of your finances by easily recording and
                        categorizing expenses, ensuring you have a clear overview of your spending
                        habits.
                    </motion.p>

                    {/* Stats row */}
                    <motion.div
                        custom={3}
                        variants={fadeUp}
                        initial="hidden"
                        animate="show"
                        className="flex gap-6 justify-center lg:justify-start"
                    >
                        {[
                            { val: "98%", label: "Accuracy" },
                            { val: "10k+", label: "Users" },
                            { val: "4.9★", label: "Rating" },
                        ].map((s) => (
                            <div key={s.label} className="text-center">
                                <p className="text-xl font-700 text-slate-900" style={{ fontWeight: 700 }}>
                                    {s.val}
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        custom={4}
                        variants={fadeUp}
                        initial="hidden"
                        animate="show"
                        className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
                    >
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-7 py-3.5 rounded-2xl text-sm font-600 shadow-lg shadow-slate-900/20"
                            style={{ fontWeight: 600 }}
                        >
                            Get Started
                            <ArrowRight size={16} />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 px-7 py-3.5 rounded-2xl text-sm font-500 border border-slate-200"
                        >
                            <TrendingUp size={16} className="text-purple-500" />
                            View Demo
                        </motion.button>
                    </motion.div>
                </div>

                {/* ── RIGHT: Visual Cards ── */}
                <div className="relative h-[460px] sm:h-[500px] order-1 lg:order-2 flex items-center justify-center">
                    {/* ── Floating Purple Subscription Card ── */}
                    <motion.div
                        variants={cardFloat}
                        animate="animate"
                        className="absolute top-0 right-0 sm:right-8 lg:-right-4 z-20"
                    >
                        <div className="w-60 sm:w-64 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl p-5 shadow-2xl shadow-purple-400/40">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                                    <Apple size={20} className="text-white" />
                                </div>
                                <span className="text-white font-600 text-base" style={{ fontWeight: 600 }}>
                                    iCloud
                                </span>
                            </div>

                            {/* Toggle */}
                            <div className="flex items-center gap-3 mb-4">
                                <motion.button
                                    onClick={() => setToggled((t) => !t)}
                                    className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${toggled ? "bg-white" : "bg-white/30"
                                        }`}
                                >
                                    <motion.div
                                        animate={{ x: toggled ? 24 : 2 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                        className={`absolute top-1 w-6 h-6 rounded-full flex items-center justify-center ${toggled ? "bg-purple-600" : "bg-white"
                                            }`}
                                    >
                                        <AnimatePresence mode="wait">
                                            {toggled ? (
                                                <motion.span
                                                    key="check"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                >
                                                    <Check size={12} className="text-white" />
                                                </motion.span>
                                            ) : (
                                                <motion.span
                                                    key="x"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                >
                                                    <X size={12} className="text-purple-400" />
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                </motion.button>
                                <span className="text-white/80 text-xs">Active subscription</span>
                            </div>

                            <div className="flex items-baseline gap-1">
                                <span className="text-white text-3xl font-800" style={{ fontWeight: 800 }}>
                                    $50
                                </span>
                                <span className="text-white/70 text-sm">/month</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Main Analytics Card ── */}
                    <motion.div
                        variants={cardFloat2}
                        animate="animate"
                        className="absolute bottom-0 left-0 sm:left-4 lg:-left-4 z-10 w-[280px] sm:w-[300px]"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="bg-white rounded-3xl p-5 shadow-2xl shadow-slate-200/80 border border-slate-100"
                        >
                            {/* Donut Chart row */}
                            <div className="flex items-center gap-4 mb-4">
                                {/* Category list */}
                                <div className="flex-1 space-y-2.5">
                                    {categories.map((cat, i) => {
                                        const Icon = cat.icon;
                                        return (
                                            <motion.div
                                                key={cat.label}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.6 + i * 0.1 }}
                                                className="flex items-center gap-2 cursor-pointer"
                                                onHoverStart={() => setActiveIndex(i)}
                                                onHoverEnd={() => setActiveIndex(null)}
                                            >
                                                <div
                                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                                    style={{ background: cat.color }}
                                                />
                                                <div className="min-w-0">
                                                    <p className="text-[11px] font-500 text-slate-700 truncate leading-tight">
                                                        {cat.label}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 leading-tight">
                                                        {cat.amount} ({cat.percent})
                                                    </p>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Donut */}
                                <div className="relative w-24 h-24 flex-shrink-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={categories}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={28}
                                                outerRadius={42}
                                                dataKey="value"
                                                strokeWidth={2}
                                                stroke="#fff"
                                            >
                                                {categories.map((_, i) => (
                                                    <Cell
                                                        key={i}
                                                        fill={COLORS[i]}
                                                        opacity={activeIndex === null || activeIndex === i ? 1 : 0.4}
                                                    />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    {/* Center label */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-[10px] font-700 text-slate-900 leading-tight" style={{ fontWeight: 700 }}>
                                            ${count.toLocaleString()}.92
                                        </span>
                                        <span className="text-[8px] text-slate-400 leading-tight">Total</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom row */}
                            <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-slate-400">Total Expense</p>
                                    <motion.p
                                        key={count}
                                        className="text-base font-700 text-slate-900"
                                        style={{ fontWeight: 700 }}
                                    >
                                        ${count.toLocaleString()}.92
                                    </motion.p>
                                </div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl px-3 py-2 flex items-center gap-1 cursor-pointer"
                                >
                                    <TrendingUp size={12} className="text-white" />
                                    <span className="text-white text-[11px] font-600">+12%</span>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* ── Decorative BG Blob ── */}
                    <div className="absolute inset-0 -z-10 flex items-center justify-center">
                        <div className="w-72 h-72 bg-gradient-to-br from-purple-200/50 to-blue-200/30 rounded-full blur-3xl" />
                    </div>

                    {/* ── Mini Notification Chip ── */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                        className="absolute top-1/2 left-0 sm:left-2 -translate-y-8 z-30"
                    >
                        <div className="bg-white rounded-2xl px-3 py-2 shadow-lg border border-slate-100 flex items-center gap-2">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                <Check size={12} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-600 text-slate-700">Payment Saved</p>
                                <p className="text-[9px] text-slate-400">Just now</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}