"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const fadeUp: any = {
    hidden: { opacity: 0, y: 28 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.13, duration: 0.6, ease: "easeOut" },
    }),
};

/* ── App Icons as SVG/emoji logos ── */
const SlackIcon = () => (
    <svg viewBox="0 0 40 40" width="28" height="28">
        <rect x="6" y="6" width="9" height="9" rx="3" fill="#E01E5A" />
        <rect x="6" y="17" width="9" height="9" rx="3" fill="#36C5F0" />
        <rect x="17" y="6" width="9" height="9" rx="3" fill="#2EB67D" />
        <rect x="17" y="17" width="9" height="9" rx="3" fill="#ECB22E" />
        <rect x="28" y="6" width="6" height="6" rx="2" fill="#E01E5A" opacity="0.5" />
        <rect x="28" y="14" width="6" height="6" rx="2" fill="#36C5F0" opacity="0.5" />
    </svg>
);

const FigmaIcon = () => (
    <svg viewBox="0 0 38 56" width="22" height="32">
        <rect x="0" y="0" width="19" height="19" rx="9.5" fill="#F24E1E" />
        <rect x="19" y="0" width="19" height="19" rx="9.5" fill="#FF7262" />
        <rect x="0" y="19" width="19" height="19" rx="9.5" fill="#A259FF" />
        <rect x="0" y="38" width="19" height="19" rx="9.5" fill="#0ACF83" />
        <circle cx="28.5" cy="28.5" r="9.5" fill="#1ABCFE" />
    </svg>
);

const FirefoxIcon = () => (
    <svg viewBox="0 0 40 40" width="30" height="30">
        <circle cx="20" cy="20" r="18" fill="#FF980E" />
        <circle cx="20" cy="20" r="12" fill="#FF6611" />
        <circle cx="20" cy="20" r="7" fill="#FFCB35" />
        <path d="M20 8 C14 8 10 13 10 20 C10 14 15 10 20 10Z" fill="#FF6611" opacity="0.6" />
    </svg>
);

const ChromeIcon = () => (
    <svg viewBox="0 0 40 40" width="30" height="30">
        <circle cx="20" cy="20" r="18" fill="#4285F4" />
        <circle cx="20" cy="20" r="10" fill="white" />
        <path d="M20 10 L38 10 A18 18 0 0 1 29 27 Z" fill="#EA4335" />
        <path d="M20 10 L2 10 A18 18 0 0 0 11 27 Z" fill="#FBBC04" />
        <path d="M11 27 A18 18 0 0 0 29 27 L20 20 Z" fill="#34A853" />
        <circle cx="20" cy="20" r="7" fill="#4285F4" />
        <circle cx="20" cy="20" r="5" fill="white" />
    </svg>
);

const MessengerIcon = () => (
    <svg viewBox="0 0 40 40" width="30" height="30">
        <circle cx="20" cy="20" r="18" fill="url(#msgGrad)" />
        <defs>
            <linearGradient id="msgGrad" x1="0" y1="0" x2="40" y2="40">
                <stop offset="0%" stopColor="#E040FB" />
                <stop offset="100%" stopColor="#448AFF" />
            </linearGradient>
        </defs>
        <path d="M20 8C13.4 8 8 13 8 19.2c0 3.4 1.5 6.4 3.9 8.5v4.3l4-2.2c1.3.3 2.7.5 4.1.5 6.6 0 12-5 12-11.2S26.6 8 20 8z" fill="white" />
        <path d="M13 22l6.5-6.5 2.5 2.5 5.5-2.5-6.5 6.5-2.5-2.5z" fill="url(#msgGrad)" />
    </svg>
);

const GmailIcon = () => (
    <svg viewBox="0 0 40 40" width="30" height="30">
        <rect x="2" y="8" width="36" height="26" rx="3" fill="white" stroke="#DADCE0" strokeWidth="1.5" />
        <path d="M2 11L20 23L38 11" stroke="#EA4335" strokeWidth="3" fill="none" />
        <path d="M2 11L14 20" stroke="#FBBC04" strokeWidth="2" fill="none" />
        <path d="M38 11L26 20" stroke="#34A853" strokeWidth="2" fill="none" />
        <text x="8" y="30" fontSize="14" fontWeight="800" fill="#EA4335">M</text>
    </svg>
);

const InstagramIcon = () => (
    <svg viewBox="0 0 40 40" width="30" height="30">
        <defs>
            <linearGradient id="igGrad" x1="0" y1="40" x2="40" y2="0">
                <stop offset="0%" stopColor="#F58529" />
                <stop offset="40%" stopColor="#DD2A7B" />
                <stop offset="100%" stopColor="#8134AF" />
            </linearGradient>
        </defs>
        <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#igGrad)" />
        <circle cx="20" cy="20" r="8" fill="none" stroke="white" strokeWidth="2.5" />
        <circle cx="29" cy="11" r="2.5" fill="white" />
    </svg>
);

const NotionIcon = () => (
    <svg viewBox="0 0 40 40" width="28" height="28">
        <rect x="2" y="2" width="36" height="36" rx="6" fill="white" stroke="#E5E5E5" strokeWidth="1.5" />
        <path d="M8 10h16l8 6v14H8V10z" fill="#F7F6F3" />
        <path d="M8 10l8 6H8z" fill="#E9E9E7" />
        <rect x="12" y="18" width="16" height="2" rx="1" fill="#37352F" />
        <rect x="12" y="23" width="12" height="2" rx="1" fill="#37352F" />
    </svg>
);

/* Central app icon */
const CentralIcon = () => (
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
        style={{ background: "linear-gradient(135deg, #4CAF50 0%, #2196F3 100%)" }}>
        <svg viewBox="0 0 40 40" width="36" height="36">
            <rect x="6" y="14" width="20" height="18" rx="3" fill="white" opacity="0.9" />
            <rect x="14" y="8" width="20" height="18" rx="3" fill="white" opacity="0.6" />
        </svg>
    </div>
);

/* ── Node positions: center + 6 orbiting icons + 2 side icons ── */
// Layout: central hub, left cluster (Firefox, Chrome), top cluster (Slack, Figma),
// bottom cluster (Instagram, Notion), right side (Messenger, Gmail)
const orbitNodes = [
    { id: "slack", Icon: SlackIcon, cx: 178, cy: 60, size: 52, delay: 0.1 },
    { id: "figma", Icon: FigmaIcon, cx: 310, cy: 60, size: 52, delay: 0.2 },
    { id: "firefox", Icon: FirefoxIcon, cx: 80, cy: 190, size: 52, delay: 0.3 },
    { id: "chrome", Icon: ChromeIcon, cx: 80, cy: 300, size: 52, delay: 0.4 },
    { id: "instagram", Icon: InstagramIcon, cx: 178, cy: 400, size: 52, delay: 0.5 },
    { id: "notion", Icon: NotionIcon, cx: 310, cy: 400, size: 52, delay: 0.6 },
    { id: "messenger", Icon: MessengerIcon, cx: 450, cy: 190, size: 56, delay: 0.7 },
    { id: "gmail", Icon: GmailIcon, cx: 450, cy: 300, size: 56, delay: 0.8 },
];

const CENTER = { x: 245, y: 245 };

/* SVG path from node center to hub center with L-shaped routing */
function buildPath(nx: number, ny: number, cx: number, cy: number) {
    const midX = nx + (cx - nx) * 0.5;
    return `M ${nx} ${ny} L ${midX} ${ny} L ${midX} ${cy} L ${cx} ${cy}`;
}

export default function IntegrateSection() {
    return (
        <section
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            className="bg-white min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16"
        >
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>

            {/* ── Outer rounded panel ── */}
            <div
                className="w-full max-w-5xl rounded-3xl overflow-hidden"
                style={{ background: "#F2F4F8" }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-0 min-h-[460px]">

                    {/* ── LEFT: Copy ── */}
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.3 }}
                        className="flex flex-col gap-6 px-8 sm:px-12 py-12 lg:py-16 order-2 lg:order-1"
                    >
                        <motion.h2
                            custom={0}
                            variants={fadeUp}
                            className="text-3xl sm:text-4xl lg:text-5xl leading-tight text-slate-900"
                            style={{ fontWeight: 800 }}
                        >
                            <span className="text-blue-500">Integrate</span> With Your
                            <br />
                            Favorite Tools
                        </motion.h2>

                        <motion.p
                            custom={1}
                            variants={fadeUp}
                            className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-sm"
                        >
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                            eiusmod tempor incididunt ut. Lorem ipsum dolor sit amet,
                            consectetur adipiscing elit, sed do
                        </motion.p>

                        <motion.div custom={2} variants={fadeUp}>
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="inline-flex items-center gap-2 bg-slate-900 text-white px-7 py-3.5 rounded-full text-sm shadow-lg"
                                style={{ fontWeight: 600 }}
                            >
                                Explore Integration
                                <ArrowRight size={16} />
                            </motion.button>
                        </motion.div>
                    </motion.div>

                    {/* ── RIGHT: Integration diagram ── */}
                    <div className="relative flex items-center justify-center order-1 lg:order-2 py-8 lg:py-0 overflow-hidden">
                        <svg
                            viewBox="0 0 530 490"
                            className="w-full max-w-sm sm:max-w-md lg:max-w-lg"
                            style={{ overflow: "visible" }}
                        >
                            {/* ── Connection lines ── */}
                            {orbitNodes.map((node, i) => {
                                const path = buildPath(node.cx + node.size / 2, node.cy + node.size / 2, CENTER.x, CENTER.y);
                                return (
                                    <motion.path
                                        key={node.id + "-line"}
                                        d={path}
                                        fill="none"
                                        stroke="#CBD5E1"
                                        strokeWidth="1.5"
                                        strokeDasharray="5 4"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        whileInView={{ pathLength: 1, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: node.delay + 0.2, duration: 0.8, ease: "easeOut" }}
                                    />
                                );
                            })}

                            {/* ── Central hub ── */}
                            <motion.g
                                initial={{ scale: 0, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                style={{ transformOrigin: `${CENTER.x}px ${CENTER.y}px` }}
                            >
                                {/* Outer glow ring */}
                                <circle cx={CENTER.x} cy={CENTER.y} r="52" fill="white" opacity="0.5" />
                                <circle cx={CENTER.x} cy={CENTER.y} r="44" fill="white" />
                                {/* Central icon */}
                                <foreignObject x={CENTER.x - 30} y={CENTER.y - 30} width="60" height="60">
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div
                                            className="w-14 h-14 rounded-2xl flex items-center justify-center"
                                            style={{ background: "linear-gradient(135deg, #4CAF50 0%, #2196F3 100%)" }}
                                        >
                                            <svg viewBox="0 0 40 40" width="30" height="30">
                                                <rect x="5" y="13" width="18" height="17" rx="3" fill="white" opacity="0.95" />
                                                <rect x="13" y="7" width="18" height="17" rx="3" fill="white" opacity="0.6" />
                                            </svg>
                                        </div>
                                    </div>
                                </foreignObject>
                            </motion.g>

                            {/* ── App icon nodes ── */}
                            {orbitNodes.map((node) => {
                                const Icon = node.Icon;
                                const half = node.size / 2;
                                return (
                                    <motion.g
                                        key={node.id}
                                        initial={{ scale: 0, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: node.delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                        style={{ transformOrigin: `${node.cx + half}px ${node.cy + half}px` }}
                                        whileHover={{ scale: 1.12 }}
                                    >
                                        {/* Shadow circle */}
                                        <circle
                                            cx={node.cx + half}
                                            cy={node.cy + half + 3}
                                            r={half + 2}
                                            fill="rgba(0,0,0,0.06)"
                                        />
                                        {/* White bg circle */}
                                        <circle
                                            cx={node.cx + half}
                                            cy={node.cy + half}
                                            r={half}
                                            fill="white"
                                        />
                                        {/* Icon */}
                                        <foreignObject x={node.cx + 8} y={node.cy + 8} width={node.size - 16} height={node.size - 16}>
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Icon />
                                            </div>
                                        </foreignObject>
                                    </motion.g>
                                );
                            })}

                            {/* ── Animated pulse dots on lines ── */}
                            {orbitNodes.slice(0, 4).map((node, i) => {
                                const path = buildPath(node.cx + node.size / 2, node.cy + node.size / 2, CENTER.x, CENTER.y);
                                return (
                                    <motion.circle
                                        key={node.id + "-dot"}
                                        r="4"
                                        fill="#3B82F6"
                                        opacity="0.8"
                                        initial={{ offsetDistance: "0%" } as any}
                                        animate={{ offsetDistance: "100%" } as any}
                                        style={{
                                            offsetPath: `path("${path}")`,
                                        } as any}
                                        transition={{
                                            delay: node.delay + 1,
                                            duration: 2.5,
                                            repeat: Infinity,
                                            repeatDelay: 2,
                                            ease: "easeInOut",
                                        }}
                                    />
                                );
                            })}
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
}