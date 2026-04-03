"use client";

import { motion } from "framer-motion";
import { Users as FacebookIcon, Image as InstagramIcon, Share2 as XIcon } from "lucide-react";

const fadeUp: any = {
    hidden: { opacity: 0, y: 20 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
    }),
};

const navCols = [
    {
        title: "Company",
        links: ["Home", "About us", "Affiliate Program", "Careers"],
    },
    {
        title: "Product",
        links: ["Overview", "Features", "Integrations", "Pricing"],
    },
    {
        title: "Resources",
        links: ["Blog", "Podcast", "Webinars", "Press"],
    },
    {
        title: "Support",
        links: ["Request a Demo", "Contact Us", "Report a Bug"],
    },
];

const socials = [
{ Icon: FacebookIcon, label: "Facebook" },
{ Icon: InstagramIcon, label: "Instagram" },
{ Icon: XIcon, label: "X" },
];

/* ── FinSuite Logo ── */
function Logo() {
    return (
        <div className="flex items-center gap-2.5">
            {/* Icon mark */}
            <div className="relative w-9 h-9">
                <div
                    className="absolute inset-0 rounded-xl"
                    style={{ background: "linear-gradient(135deg, #4CAF50 0%, #2196F3 100%)" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 32 32" width="22" height="22">
                        <rect x="4" y="11" width="15" height="14" rx="3" fill="white" opacity="0.95" />
                        <rect x="11" y="5" width="15" height="14" rx="3" fill="white" opacity="0.55" />
                    </svg>
                </div>
            </div>
            <span className="text-slate-900 text-xl" style={{ fontWeight: 800, letterSpacing: "-0.01em" }}>
                FinSuite
            </span>
        </div>
    );
}

export default function LandingFooter() {
    return (
        <footer
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            className="bg-white px-4 sm:px-8 lg:px-16 pt-14 pb-0"
        >
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>

            {/* ── Main footer content ── */}
            <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14"
            >
                {/* Brand column */}
                <motion.div custom={0} variants={fadeUp} className="lg:col-span-1 flex flex-col gap-5">
                    <Logo />
                    <p className="text-slate-500 text-sm leading-relaxed max-w-[220px]">
                        Welcome to FinSuite, where financial management meets simplicity and efficiency.
                    </p>
                    {/* Social icons */}
                    <div className="flex items-center gap-2.5 mt-1">
                        {socials.map(({ Icon, label }) => (
                            <motion.a
                                key={label}
                                href="#"
                                aria-label={label}
                                whileHover={{ scale: 1.12 }}
                                whileTap={{ scale: 0.93 }}
                                className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center transition-colors hover:bg-slate-700"
                            >
                                <Icon size={15} className="text-white" />
                            </motion.a>
                        ))}
                    </div>
                </motion.div>

                {/* Nav columns */}
                {navCols.map((col, ci) => (
                    <motion.div
                        key={col.title}
                        custom={ci + 1}
                        variants={fadeUp}
                        className="flex flex-col gap-4"
                    >
                        <h4
                            className="text-slate-900 text-sm"
                            style={{ fontWeight: 700 }}
                        >
                            {col.title}
                        </h4>
                        <ul className="flex flex-col gap-3">
                            {col.links.map((link) => (
                                <li key={link}>
                                    <motion.a
                                        href="#"
                                        whileHover={{ x: 2, color: "#3B82F6" }}
                                        transition={{ duration: 0.15 }}
                                        className="text-slate-500 text-sm transition-colors hover:text-blue-500"
                                        style={{ display: "inline-block" }}
                                    >
                                        {link}
                                    </motion.a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </motion.div>

            {/* ── Bottom bar ── */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="max-w-6xl mx-auto"
            >
                <div
                    className="rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3"
                    style={{ background: "#F4F6FA" }}
                >
                    <p className="text-slate-400 text-sm">© 2024 All Rights Reserved</p>
                    <div className="flex items-center gap-6">
                        {["Terms & Conditions", "Privacy Policy"].map((item) => (
                            <motion.a
                                key={item}
                                href="#"
                                whileHover={{ color: "#3B82F6" }}
                                className="text-slate-500 text-sm transition-colors hover:text-blue-500"
                                style={{ fontWeight: 500 }}
                            >
                                {item}
                            </motion.a>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* spacing below bottom bar */}
            <div className="h-6" />
        </footer>
    );
}