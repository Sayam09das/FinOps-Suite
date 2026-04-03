"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Globe2, RefreshCw, Users } from "lucide-react";

const fadeUp: any = {
    hidden: { opacity: 0, y: 32 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
    }),
};

const cardHover: any = {
    rest: { y: 0, boxShadow: "0 4px 24px 0 rgba(0,0,0,0.07)" },
    hover: { y: -8, boxShadow: "0 20px 48px 0 rgba(0,0,0,0.13)" },
};

/* ── Flag avatars (emoji flags) ── */
const flags = [
    { flag: "🇺🇸", label: "USA" },
    { flag: "🇪🇸", label: "Spain" },
    { flag: "🇵🇹", label: "Portugal" },
    { flag: "🇬🇧", label: "UK" },
    { flag: "🇩🇪", label: "Germany" },
];

/* ── Currency symbols ── */
const currencies = [
    { sym: "$", active: false },
    { sym: "€", active: false },
    { sym: "£", active: true },
    { sym: "₺", active: false },
    { sym: "₹", active: false },
];

/* ── Friend avatar colors ── */
const friends = [
    { bg: "#F3D5C0", initials: "AL" },
    { bg: "#C8DFF3", initials: "MR" },
    { bg: "#D5F3C8", initials: "JK" },
    { bg: "#F3C8D5", initials: "SB" },
];

export default function SendMoneySection() {
    const [activeFlag, setActiveFlag] = useState(0);
    const [activeCurrency, setActiveCurrency] = useState(2);
    const [activeFriend, setActiveFriend] = useState(0);

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
                className="text-center mb-16 max-w-xl mx-auto"
            >
                <motion.h2
                    custom={0}
                    variants={fadeUp}
                    className="text-4xl sm:text-5xl font-800 leading-tight text-slate-900 mb-4"
                    style={{ fontWeight: 800 }}
                >
                    <span className="text-blue-500">Send Money</span> Across
                    <br />
                    the Globe
                </motion.h2>
                <motion.p
                    custom={1}
                    variants={fadeUp}
                    className="text-slate-400 text-base sm:text-lg leading-relaxed"
                >
                    Experience seamless global money transfers with our cutting-edge
                    platform. Send money across continents securely.
                </motion.p>
            </motion.div>

            {/* ── Cards Grid ── */}
            <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">

                {/* ── Card 1: Country ── */}
                <motion.div
                    custom={0}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    whileHover="hover"
                    className="flex flex-col items-center gap-6"
                >
                    <motion.div
                        variants={cardHover}
                        initial="rest"
                        whileHover="hover"
                        transition={{ type: "spring", stiffness: 280, damping: 22 }}
                        className="w-full rounded-3xl overflow-hidden relative"
                        style={{ background: "#E8F1FB", minHeight: 300 }}
                    >
                        {/* dashed inner frame */}
                        <div
                            className="absolute inset-4 rounded-2xl border-2 border-dashed border-blue-200 pointer-events-none"
                            style={{ zIndex: 0 }}
                        />

                        {/* white phone card */}
                        <div className="relative z-10 mx-auto mt-10 w-[78%] bg-white rounded-2xl p-5 shadow-md">
                            <p className="text-sm font-600 text-slate-700 mb-4" style={{ fontWeight: 600 }}>
                                Country
                            </p>

                            {/* Row 1: active flag + plus */}
                            <div className="flex gap-3 mb-3 items-center">
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setActiveFlag(0)}
                                    className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-sm ring-2 ring-blue-400 ring-offset-1 transition-all"
                                    style={{ background: "#F1F5FD" }}
                                >
                                    {flags[0].flag}
                                </motion.button>
                                <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-100 transition-colors">
                                    <Plus size={16} />
                                </button>
                            </div>

                            {/* Row 2 */}
                            <div className="flex gap-3 mb-3">
                                {[1, 2].map((i) => (
                                    <motion.button
                                        key={i}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setActiveFlag(i)}
                                        className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-sm transition-all ${activeFlag === i ? "ring-2 ring-blue-400 ring-offset-1" : ""
                                            }`}
                                        style={{ background: "#F1F5FD" }}
                                    >
                                        {flags[i].flag}
                                    </motion.button>
                                ))}
                            </div>

                            {/* Row 3 */}
                            <div className="flex gap-3">
                                {[3, 4].map((i) => (
                                    <motion.button
                                        key={i}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setActiveFlag(i)}
                                        className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-sm transition-all ${activeFlag === i ? "ring-2 ring-blue-400 ring-offset-1" : ""
                                            }`}
                                        style={{ background: "#F1F5FD" }}
                                    >
                                        {flags[i].flag}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* fade bottom */}
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#E8F1FB] to-transparent z-20 pointer-events-none rounded-b-3xl" />
                    </motion.div>

                    {/* label */}
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <Globe2 size={18} className="text-blue-500" />
                            <h3 className="text-lg font-700 text-slate-900" style={{ fontWeight: 700 }}>
                                Send 100+ Country
                            </h3>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-[220px] mx-auto">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                            eiusmod tempor incididunt.
                        </p>
                    </div>
                </motion.div>

                {/* ── Card 2: Currency ── */}
                <motion.div
                    custom={1}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    className="flex flex-col items-center gap-6"
                >
                    <motion.div
                        variants={cardHover}
                        initial="rest"
                        whileHover="hover"
                        transition={{ type: "spring", stiffness: 280, damping: 22 }}
                        className="w-full rounded-3xl overflow-hidden relative"
                        style={{ background: "#E9F5E6", minHeight: 300 }}
                    >
                        <div className="absolute inset-4 rounded-2xl border-2 border-dashed border-green-200 pointer-events-none z-0" />

                        <div className="relative z-10 mx-auto mt-10 w-[78%] bg-white rounded-2xl p-5 shadow-md">
                            <p className="text-sm font-600 text-slate-700 mb-4" style={{ fontWeight: 600 }}>
                                Currency
                            </p>

                            {/* Grid of currency symbols */}
                            <div className="grid grid-cols-2 gap-3">
                                {/* Plus button first */}
                                <div className="flex gap-3">
                                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-xl text-slate-500 font-600">
                                        {currencies[0].sym}
                                    </div>
                                </div>
                                <div className="flex">
                                    <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-green-100 transition-colors">
                                        <Plus size={16} />
                                    </button>
                                </div>

                                {currencies.slice(1).map((c, i) => (
                                    <motion.button
                                        key={c.sym}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setActiveCurrency(i + 1)}
                                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                        className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-600 shadow-sm transition-all ${activeCurrency === i + 1
                                                ? "bg-green-400 text-white ring-2 ring-green-300 ring-offset-1"
                                                : "bg-slate-100 text-slate-600 hover:bg-green-100"
                                            }`}
                                        style={{ fontWeight: 600 }}
                                    >
                                        {c.sym}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#E9F5E6] to-transparent z-20 pointer-events-none rounded-b-3xl" />
                    </motion.div>

                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <RefreshCw size={18} className="text-green-500" />
                            <h3 className="text-lg font-700 text-slate-900" style={{ fontWeight: 700 }}>
                                Convert 100+ Currency
                            </h3>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-[220px] mx-auto">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                            eiusmod tempor incididunt.
                        </p>
                    </div>
                </motion.div>

                {/* ── Card 3: Add Friends ── */}
                <motion.div
                    custom={2}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    className="flex flex-col items-center gap-6"
                >
                    <motion.div
                        variants={cardHover}
                        initial="rest"
                        whileHover="hover"
                        transition={{ type: "spring", stiffness: 280, damping: 22 }}
                        className="w-full rounded-3xl overflow-hidden relative"
                        style={{ background: "#EEE8F8", minHeight: 300 }}
                    >
                        <div className="absolute inset-4 rounded-2xl border-2 border-dashed border-purple-200 pointer-events-none z-0" />

                        <div className="relative z-10 mx-auto mt-10 w-[78%] bg-white rounded-2xl p-5 shadow-md">
                            <p className="text-sm font-600 text-slate-700 mb-4" style={{ fontWeight: 600 }}>
                                Add Friends
                            </p>

                            <div className="grid grid-cols-2 gap-3">
                                {/* First avatar + plus */}
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setActiveFriend(0)}
                                    className={`w-14 h-14 rounded-full flex items-center justify-center text-sm font-600 shadow-sm transition-all ${activeFriend === 0 ? "ring-2 ring-purple-400 ring-offset-1" : ""
                                        }`}
                                    style={{ background: friends[0].bg, fontWeight: 600, color: "#555" }}
                                >
                                    {friends[0].initials}
                                </motion.button>
                                <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-purple-100 transition-colors">
                                    <Plus size={16} />
                                </button>

                                {friends.slice(1).map((f, i) => (
                                    <motion.button
                                        key={f.initials}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setActiveFriend(i + 1)}
                                        className={`w-14 h-14 rounded-full flex items-center justify-center text-sm font-600 shadow-sm transition-all ${activeFriend === i + 1 ? "ring-2 ring-purple-400 ring-offset-1" : ""
                                            }`}
                                        style={{ background: f.bg, fontWeight: 600, color: "#555" }}
                                    >
                                        {f.initials}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#EEE8F8] to-transparent z-20 pointer-events-none rounded-b-3xl" />
                    </motion.div>

                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <Users size={18} className="text-purple-500" />
                            <h3 className="text-lg font-700 text-slate-900" style={{ fontWeight: 700 }}>
                                Unlimited Transactions
                            </h3>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-[220px] mx-auto">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                            eiusmod tempor incididunt.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}