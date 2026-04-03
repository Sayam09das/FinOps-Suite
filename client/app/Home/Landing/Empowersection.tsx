"use client";

import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";

const fadeUp: any = {
    hidden: { opacity: 0, y: 30 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
    }),
};

/* ── SVG Credit Card Component ── */
function CreditCard({
    rotate,
    translateX,
    translateY,
    zIndex,
    delay,
    gradient,
    number,
    name,
    expiry,
    floatY,
}: {
    rotate: number;
    translateX: number;
    translateY: number;
    zIndex: number;
    delay: number;
    gradient: string[];
    number: string;
    name: string;
    expiry?: string;
    floatY?: number[];
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: rotate - 10 }}
            whileInView={{ opacity: 1, scale: 1, rotate }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.7, ease: "easeOut" }}
            animate={{
                y: floatY ?? [0, -8, 0],
                transition: {
                    duration: 4 + delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: delay * 0.5,
                } as any,
            }}
            style={{
                position: "absolute",
                rotate,
                translateX,
                translateY,
                zIndex,
                transformOrigin: "center center",
            }}
            whileHover={{ scale: 1.04, zIndex: 30 }}
        >
            <div
                className="relative w-56 sm:w-64 h-36 sm:h-40 rounded-2xl overflow-hidden shadow-2xl"
                style={{
                    background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 60%, ${gradient[2]} 100%)`,
                }}
            >
                {/* Decorative wave rings */}
                <svg
                    className="absolute -right-6 -bottom-6 opacity-30"
                    width="140"
                    height="140"
                    viewBox="0 0 140 140"
                >
                    {[0, 18, 36, 54].map((r, i) => (
                        <circle
                            key={i}
                            cx="70"
                            cy="70"
                            r={30 + r}
                            fill="none"
                            stroke="white"
                            strokeWidth="1.5"
                        />
                    ))}
                </svg>
                <svg
                    className="absolute -left-4 -top-4 opacity-20"
                    width="100"
                    height="100"
                    viewBox="0 0 100 100"
                >
                    {[0, 14, 28].map((r, i) => (
                        <circle
                            key={i}
                            cx="50"
                            cy="50"
                            r={20 + r}
                            fill="none"
                            stroke="white"
                            strokeWidth="1"
                        />
                    ))}
                </svg>

                {/* Mastercard circles */}
                <div className="absolute top-4 right-5 flex">
                    <div className="w-7 h-7 rounded-full bg-red-500 opacity-90" />
                    <div className="w-7 h-7 rounded-full bg-yellow-400 opacity-90 -ml-3" />
                </div>

                {/* Card number */}
                <div className="absolute bottom-12 left-5">
                    <p className="text-white/50 text-[8px] tracking-widest uppercase mb-0.5">
                        Card Number
                    </p>
                    <p
                        className="text-white text-base sm:text-lg tracking-wider"
                        style={{ fontWeight: 600, letterSpacing: "0.08em" }}
                    >
                        {number}
                    </p>
                </div>

                {/* Name */}
                <div className="absolute bottom-4 left-5">
                    <p className="text-white/50 text-[8px] tracking-widest uppercase mb-0.5">
                        Card Name
                    </p>
                    <p className="text-white text-xs" style={{ fontWeight: 500 }}>
                        {name}
                    </p>
                </div>

                {/* Expiry */}
                {expiry && (
                    <div className="absolute bottom-4 right-5 text-right">
                        <p className="text-white/50 text-[8px] tracking-widest uppercase mb-0.5">
                            Exp Date
                        </p>
                        <p className="text-white text-xs" style={{ fontWeight: 500 }}>
                            {expiry}
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

const features = [
    {
        icon: ArrowDownLeft,
        title: "Receive Money from Card",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
    },
    {
        icon: ArrowUpRight,
        title: "Send Money from Card",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
    },
];

export default function EmpowerSection() {
    return (
        <section
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            className="bg-white min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20"
        >
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>

            {/* ── Heading ── */}
            <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="text-center mb-16 max-w-2xl mx-auto"
            >
                <motion.h2
                    custom={0}
                    variants={fadeUp}
                    className="text-4xl sm:text-5xl leading-tight text-slate-900"
                    style={{ fontWeight: 800 }}
                >
                    <span className="text-blue-500">Empower</span> Your Financial
                    <br />
                    Future with us
                </motion.h2>
            </motion.div>

            {/* ── Main Panel ── */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="w-full max-w-5xl rounded-3xl overflow-hidden"
                style={{ background: "#F4F6FA" }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[420px]">

                    {/* ── LEFT: Cards Visual ── */}
                    <div className="relative flex items-center justify-center p-10 min-h-[340px] lg:min-h-auto">
                        {/* Circle background */}
                        <div
                            className="absolute w-64 h-64 sm:w-72 sm:h-72 rounded-full"
                            style={{ background: "#E4E8F0" }}
                        />

                        {/* Card stack */}
                        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
                            {/* Back card */}
                            <CreditCard
                                rotate={-18}
                                translateX={-20}
                                translateY={20}
                                zIndex={10}
                                delay={0.1}
                                gradient={["#9B6DFF", "#7B4FD8", "#6B3FBE"]}
                                number="3455 4"
                                name="John Carter"
                                expiry="12/23"
                                floatY={[0, 10, 0]}
                            />
                            {/* Front card */}
                            <CreditCard
                                rotate={12}
                                translateX={10}
                                translateY={-10}
                                zIndex={20}
                                delay={0.25}
                                gradient={["#6B4FDE", "#7B5FE8", "#9B7FFF"]}
                                number="3455 4562 7710 3507"
                                name="John Carter"
                                floatY={[0, -8, 0]}
                            />
                        </div>
                    </div>

                    {/* ── RIGHT: Copy ── */}
                    <div className="flex flex-col justify-center px-8 sm:px-10 py-10 lg:py-12">
                        <motion.div
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.3 }}
                        >
                            <motion.h3
                                custom={0}
                                variants={fadeUp}
                                className="text-3xl sm:text-4xl text-slate-900 mb-1 leading-tight"
                                style={{ fontWeight: 800 }}
                            >
                                Achieve Financial
                            </motion.h3>
                            <motion.h3
                                custom={1}
                                variants={fadeUp}
                                className="text-3xl sm:text-4xl text-blue-500 mb-4 leading-tight"
                                style={{ fontWeight: 800 }}
                            >
                                Excellence
                            </motion.h3>
                            <motion.p
                                custom={2}
                                variants={fadeUp}
                                className="text-slate-500 text-sm sm:text-base leading-relaxed mb-8 max-w-sm"
                            >
                                Effortlessly add your credit or debit card with convenience and
                                simplicity. Our streamlined process makes it easy.
                            </motion.p>

                            {/* Feature list */}
                            <div className="flex flex-col gap-6">
                                {features.map((f, i) => {
                                    const Icon = f.icon;
                                    return (
                                        <motion.div
                                            key={f.title}
                                            custom={i + 3}
                                            variants={fadeUp}
                                            className="flex items-start gap-4"
                                        >
                                            <motion.div
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
                                                style={{ background: "#7DC832" }}
                                            >
                                                <Icon size={20} className="text-white" strokeWidth={2.5} />
                                            </motion.div>
                                            <div>
                                                <p
                                                    className="text-slate-900 text-sm sm:text-base mb-1"
                                                    style={{ fontWeight: 700 }}
                                                >
                                                    {f.title}
                                                </p>
                                                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                                                    {f.desc}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}