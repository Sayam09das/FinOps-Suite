"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Trophy, Star, Sparkles, TrendingUp, Award, Heart, Users } from "lucide-react";
import { useEffect, useState } from "react";

// Extended trust data with additional metrics
const trustBadges = [
    {
        id: "chrome",
        icon: Star,
        name: "Chrome Web Store",
        rating: 4.8,
        reviews: 2847,
        users: "185K+",
        color: "from-yellow-400 to-yellow-500",
        accentColor: "#FBBC04",
        borderColor: "border-yellow-200/50",
        badge: "Most Popular",
    },
    {
        id: "producthunt",
        icon: Trophy,
        name: "ProductHunt",
        rating: 4.9,
        reviews: 1253,
        users: "89K+",
        color: "from-orange-400 to-red-500",
        accentColor: "#FF6B35",
        borderColor: "border-orange-200/50",
        badge: "Highest Rated",
    },
    {
        id: "trustpilot",
        icon: Star,
        name: "Trustpilot",
        rating: 4.8,
        reviews: 5432,
        users: "312K+",
        color: "from-emerald-400 to-teal-500",
        accentColor: "#2EC4B6",
        borderColor: "border-emerald-200/50",
        badge: "Most Reviews",
    },
];

// Stats displayed at bottom
const stats = [
    {
        icon: Users,
        label: "Total Users",
        value: "500K+",
        color: "text-blue-600",
    },
    {
        icon: Heart,
        label: "Avg. Rating",
        value: "4.83/5",
        color: "text-red-600",
    },
    {
        icon: Award,
        label: "Awards",
        value: "12+",
        color: "text-yellow-600",
    },
    {
        icon: TrendingUp,
        label: "Growth",
        value: "+45% YoY",
        color: "text-emerald-600",
    },
];

// Animation variants
const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
};

const itemVariants: any = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
    },
};

const badgeHoverVariants: any = {
    hover: {
        y: -12,
        scale: 1.05,
        transition: { duration: 0.3, type: "spring", stiffness: 300, damping: 20 },
    },
    tap: { scale: 0.96, y: -6 },
};

const iconVariants: any = {
    idle: { y: 0, rotate: 0 },
    hover: {
        y: -6,
        rotate: 8,
        transition: { duration: 0.4, type: "spring", stiffness: 400 },
    },
};

const badgeIconVariants: any = {
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0 },
};

const counterVariants: any = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
};

function AnimatedCounter({ value, delay = 0 }: { value: string; delay?: number }) {
    return (
        <motion.div
            variants={counterVariants}
            initial="initial"
            animate="animate"
            transition={{ delay, duration: 0.5 }}
            className="text-2xl sm:text-3xl font-black text-gray-900"
        >
            {value}
        </motion.div>
    );
}

function TrustBadgeAdvanced({
    badge,
    shouldReduce,
    index,
}: {
    badge: (typeof trustBadges)[0];
    shouldReduce: boolean;
    index: number;
}) {
    const IconComponent = badge.icon;
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            variants={itemVariants}
            whileHover={shouldReduce ? undefined : "hover"}
            whileTap={shouldReduce ? undefined : "tap"}
            onHoverStart={() => !shouldReduce && setIsHovered(true)}
            onHoverEnd={() => !shouldReduce && setIsHovered(false)}
            className="w-full h-full"
        >
            <motion.div
                variants={shouldReduce ? undefined : badgeHoverVariants}
                className={`group relative overflow-hidden rounded-3xl border-2 ${badge.borderColor} bg-gradient-to-br from-white via-white/98 to-white/95 p-6 sm:p-7 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer h-full flex flex-col`}
            >
                {/* Animated gradient background */}
                <motion.div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${badge.color}`}
                    style={{ opacity: isHovered ? 0.02 : 0 }}
                />

                {/* Glow effect */}
                <motion.div
                    className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                    style={{
                        background: `linear-gradient(135deg, ${badge.accentColor}22, transparent)`,
                    }}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                    {/* Header with badge */}
                    <div className="flex items-start justify-between gap-3 mb-5 sm:mb-6">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            {/* Icon */}
                            <motion.div
                                variants={shouldReduce ? undefined : iconVariants}
                                initial="idle"
                                whileHover={shouldReduce ? undefined : "hover"}
                                className={`flex h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${badge.color} shadow-lg flex-shrink-0`}
                            >
                                <IconComponent className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" strokeWidth={1.5} />
                            </motion.div>

                            {/* Name */}
                            <div className="min-w-0 flex-1">
                                <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 group-hover:text-gray-900 transition-colors">
                                    {badge.name}
                                </p>
                            </div>
                        </div>

                        {/* Special badge */}
                        <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                            className="flex-shrink-0"
                        >
                            <div className={`inline-flex items-center gap-1 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-gradient-to-r ${badge.color} text-white text-[10px] sm:text-xs font-bold shadow-md`}>
                                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-white" />
                                {badge.badge}
                            </div>
                        </motion.div>
                    </div>

                    {/* Stats section */}
                    <div className="space-y-4 sm:space-y-5 flex-1">
                        {/* Large rating with animation */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-baseline gap-2"
                        >
                            <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900">
                                {badge.rating}
                            </span>
                            <span className="text-sm sm:text-base text-gray-400 font-medium">
                                out of 5
                            </span>
                        </motion.div>

                        {/* Star rating with individual animations */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        delay: 0.3 + i * 0.06,
                                        duration: 0.4,
                                        type: "spring",
                                    }}
                                >
                                    <Star
                                        className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 fill-current transition-all duration-200"
                                        style={{
                                            color: badge.accentColor,
                                            opacity: i < Math.round(badge.rating) ? 1 : 0.2,
                                        }}
                                    />
                                </motion.div>
                            ))}
                        </div>

                        {/* Review info with counter animation */}
                        <div className="flex items-center gap-6 sm:gap-8 py-3 sm:py-4 border-t border-gray-200 group-hover:border-gray-300 transition-colors">
                            <div>
                                <p className="text-[11px] sm:text-xs lg:text-sm text-gray-500 font-medium mb-1">
                                    Reviews
                                </p>
                                <motion.p
                                    key={badge.reviews}
                                    variants={counterVariants}
                                    initial="initial"
                                    animate="animate"
                                    className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900"
                                >
                                    {badge.reviews.toLocaleString()}
                                </motion.p>
                            </div>

                            <div>
                                <p className="text-[11px] sm:text-xs lg:text-sm text-gray-500 font-medium mb-1">
                                    Active Users
                                </p>
                                <motion.p
                                    key={badge.users}
                                    variants={counterVariants}
                                    initial="initial"
                                    animate="animate"
                                    className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900"
                                >
                                    {badge.users}
                                </motion.p>
                            </div>
                        </div>

                        {/* Animated progress bar */}
                        <motion.div className="mt-4 sm:mt-5 overflow-hidden rounded-full h-2 sm:h-2.5 bg-gray-200">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${(badge.rating / 5) * 100}%` }}
                                transition={{
                                    delay: 0.4,
                                    duration: 1,
                                    ease: [0.23, 1, 0.32, 1],
                                }}
                                className={`h-full bg-gradient-to-r ${badge.color} rounded-full`}
                                viewport={{ once: true }}
                            />
                        </motion.div>
                    </div>
                </div>

                {/* Hover border effect */}
                <motion.div
                    className="absolute inset-0 rounded-3xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                        borderColor: badge.accentColor,
                        boxShadow: isHovered ? `inset 0 0 20px ${badge.accentColor}15` : "none",
                    }}
                />
            </motion.div>
        </motion.div>
    );
}

function StatCard({
    stat,
    index,
    shouldReduce,
}: {
    stat: (typeof stats)[0];
    index: number;
    shouldReduce: boolean;
}) {
    const Icon = stat.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={shouldReduce ? undefined : { y: -4, scale: 1.02 }}
            className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4 sm:p-5 lg:p-6 group"
        >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-blue-50 to-cyan-50" />

            <div className="relative z-10 flex flex-col">
                <motion.div
                    animate={{ rotate: shouldReduce ? 0 : [0, 10, -10, 0] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "easeInOut",
                    }}
                    className={`w-fit p-2 sm:p-3 rounded-lg bg-blue-50 ${stat.color} mb-3`}
                >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </motion.div>

                <p className="text-xs sm:text-sm text-gray-600 font-medium">{stat.label}</p>
                <motion.p
                    key={stat.value}
                    variants={counterVariants}
                    initial="initial"
                    animate="animate"
                    className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 mt-1"
                >
                    {stat.value}
                </motion.p>
            </div>
        </motion.div>
    );
}

function AdvancedHeader() {
    const shouldReduce = useReducedMotion() ?? false;

    return (
        <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
            <div className="mb-4 sm:mb-5 flex items-center justify-center gap-2 sm:gap-3">
                <motion.div
                    animate={{ rotate: shouldReduce ? 0 : 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="text-blue-500"
                >
                    <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
                </motion.div>
                <span className="text-xs sm:text-sm lg:text-base font-bold text-blue-600 uppercase tracking-widest">
                    Trusted Globally
                </span>
                <motion.div
                    animate={{ rotate: shouldReduce ? 0 : -360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="text-blue-500"
                >
                    <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
                </motion.div>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3 sm:mb-4">
                Trusted by{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600">
                    500K+ Users
                </span>
            </h2>

            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto">
                Our platform is rated 4.8+ stars across all major review platforms. Join thousands of satisfied users today.
            </p>
        </motion.div>
    );
}

export default function TrustSection() {
    const shouldReduce = useReducedMotion() ?? false;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <section className="w-full bg-gradient-to-b from-white via-blue-50/30 to-white py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="h-20 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-80 bg-gray-200 rounded-3xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full bg-gradient-to-b from-white via-blue-50/20 to-white py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-3xl -z-10 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-100/20 rounded-full blur-3xl -z-10 translate-x-1/2 translate-y-1/2" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <AdvancedHeader />

                {/* Trust badges grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mb-16 sm:mb-20 lg:mb-24"
                >
                    {trustBadges.map((badge, index) => (
                        <TrustBadgeAdvanced
                            key={badge.id}
                            badge={badge}
                            shouldReduce={shouldReduce}
                            index={index}
                        />
                    ))}
                </motion.div>

                {/* Stats section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mb-16 sm:mb-20 lg:mb-24"
                >
                    <div className="text-center mb-8 sm:mb-10">
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-3">
                            By The Numbers
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base">
                            Our impact in 2024
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {stats.map((stat, index) => (
                            <StatCard
                                key={stat.label}
                                stat={stat}
                                index={index}
                                shouldReduce={shouldReduce}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8">
                        Ready to join thousands of satisfied users?
                    </p>
                    <motion.button
                        whileHover={shouldReduce ? undefined : { scale: 1.05, y: -2 }}
                        whileTap={shouldReduce ? undefined : { scale: 0.95 }}
                        className="px-8 sm:px-12 lg:px-16 py-3 sm:py-4 lg:py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-sm sm:text-base lg:text-lg rounded-full shadow-xl hover:shadow-2xl transition-shadow duration-300"
                    >
                        Get Started Free Today
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
}
