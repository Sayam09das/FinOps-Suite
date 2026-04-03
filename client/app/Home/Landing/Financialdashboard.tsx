'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowUp,
    ArrowDown,
    Send,
    Download,
    Plus,
    TrendingUp,
    Wallet,
    Eye,
    EyeOff,
    ChevronRight,
    CreditCard,
    PieChart,
    Settings,
} from 'lucide-react';

const FinancialDashboard = () => {
    const [balance, setBalance] = useState(9823.28);
    const [showBalance, setShowBalance] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const containerVariants: any = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants: any = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut' },
        },
    };

    const balanceCardVariants: any = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.6, ease: 'easeOut' },
        },
        hover: {
            y: -8,
            transition: { duration: 0.3 },
        },
    };

    const buttonVariants: any = {
        hover: {
            scale: 1.05,
            transition: { duration: 0.2 },
        },
        tap: {
            scale: 0.95,
        },
    };

    const features = [
        {
            icon: Wallet,
            title: 'Keep tracking balance',
            desc: 'Monitor all accounts',
            color: 'from-blue-100 to-blue-50'
        },
        {
            icon: Send,
            title: 'Send money easily',
            desc: 'Quick transfers',
            color: 'from-purple-100 to-purple-50'
        },
        {
            icon: Download,
            title: 'Receive money easily',
            desc: 'Multiple channels',
            color: 'from-pink-100 to-pink-50'
        },
        {
            icon: TrendingUp,
            title: 'Convert currency',
            desc: 'Live rates',
            color: 'from-orange-100 to-orange-50'
        },
    ];

    const Users = () => <div />;
    const Transactions = () => <div />;
    const Globe = () => <div />;

    const stats = [
        { label: 'Users', value: '50K+', icon: Users },
        { label: 'Transactions', value: '1M+', icon: Transactions },
        { label: 'Countries', value: '180+', icon: Globe },
    ];

    const ActionButton = ({ icon: Icon, label, color }: { icon: any; label: string; color: string }) => (
        <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className={`${color} rounded-full p-3 md:p-4 flex flex-col items-center justify-center gap-2 group transition-all`}
        >
            <Icon className="w-5 h-5 md:w-6 md:h-6 text-gray-900 dark:text-white group-hover:scale-110 transition-transform" />
            <span className="text-xs md:text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                {label}
            </span>
        </motion.button>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-8 overflow-hidden">
            {/* Animated background elements */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.15, 0.1],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.1, 0.15, 0.1],
                    }}
                    transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                    className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl"
                />
            </div>

            {/* Header */}
            <motion.div
                className="max-w-7xl mx-auto mb-8 md:mb-12 relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants}>
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                        <span className="text-blue-600 dark:text-blue-400">Empower</span> Your Financial Future with us
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm md:text-lg max-w-2xl">
                        Take control of your finances with intelligent insights and real-time analytics
                    </p>
                </motion.div>
            </motion.div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 relative z-10">
                {/* Left Column - Balance Card & Chart */}
                <motion.div
                    className="space-y-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Balance Card */}
                    <motion.div
                        variants={balanceCardVariants}
                        whileHover="hover"
                        className="bg-gradient-to-br from-green-400 via-emerald-400 to-green-300 dark:from-green-600 dark:via-emerald-600 dark:to-green-500 rounded-3xl p-6 md:p-8 shadow-xl"
                    >
                        <div className="mb-8">
                            <p className="text-green-900 dark:text-green-100 text-sm md:text-base font-semibold mb-3 uppercase tracking-wide">
                                My Balance
                            </p>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-baseline gap-3">
                                    <motion.span
                                        key={String(showBalance)}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white"
                                    >
                                        {showBalance ? '$9,823.28' : '••••••'}
                                    </motion.span>
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 10 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowBalance(!showBalance)}
                                        className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                                    >
                                        {showBalance ? (
                                            <Eye className="w-6 h-6 text-gray-900 dark:text-white" />
                                        ) : (
                                            <EyeOff className="w-6 h-6 text-gray-900 dark:text-white" />
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                            <p className="text-green-900 dark:text-green-100 text-xs md:text-sm mt-4 font-medium">
                                You made an extra <span className="font-bold">$2,832.19</span> this month 🎉
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-3 gap-3">
                            <ActionButton icon={ArrowUp} label="Send" color="bg-white/30 dark:bg-white/20" />
                            <ActionButton icon={ArrowDown} label="Receive" color="bg-white/30 dark:bg-white/20" />
                            <ActionButton icon={TrendingUp} label="Convert" color="bg-white/30 dark:bg-white/20" />
                        </div>
                    </motion.div>

                    {/* Chart */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700"
                    >
                        <div className="space-y-6">
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <motion.div
                                    whileHover={{ rotate: 20 }}
                                    className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg"
                                >
                                    <PieChart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </motion.div>
                                Monthly Overview
                            </h3>

                            {/* Animated Bar Chart */}
                            <div className="flex items-end justify-center gap-2 md:gap-3 h-56 md:h-64 px-2">
                                {[20, 35, 65, 45, 80, 55, 70, 90, 60, 75, 85, 95].map((height, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(height / 100) * 100}%` }}
                                        transition={{
                                            delay: idx * 0.05,
                                            duration: 0.8,
                                            ease: 'easeOut',
                                            type: 'spring',
                                            stiffness: 100,
                                        }}
                                        className="flex-1 bg-gradient-to-t from-blue-500 via-blue-400 to-blue-300 dark:from-blue-600 dark:via-blue-500 dark:to-blue-400 rounded-t-lg hover:from-blue-600 hover:to-blue-500 transition-all cursor-pointer group relative shadow-md"
                                        whileHover={{ scale: 1.05, y: -5 }}
                                    >
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            whileHover={{ opacity: 1, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-semibold px-2 py-1 rounded whitespace-nowrap"
                                        >
                                            ${(height * 1000).toLocaleString()}
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Chart Legend */}
                            <div className="flex items-center justify-center gap-4 text-xs text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded bg-blue-500" />
                                    <span>Monthly Balance</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded bg-blue-300" />
                                    <span>Peak</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right Column - Features */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                >
                    {/* Feature Header */}
                    <motion.div variants={itemVariants} className="space-y-3">
                        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                            Comprehensive <br />
                            <span className="text-blue-600 dark:text-blue-400">Financial Analytics</span>
                            <br />
                            Dashboard
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed">
                            Gain real-time visibility into your financial performance with intuitive dashboards and actionable insights.
                        </p>
                    </motion.div>

                    {/* Feature Grid */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-5 md:p-6 border border-gray-100 dark:border-gray-700 group cursor-pointer transition-all shadow-sm hover:shadow-md"
                            >
                                <div className="flex items-start gap-4">
                                    <motion.div
                                        whileHover={{ scale: 1.15, rotate: 10 }}
                                        className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 rounded-xl group-hover:shadow-md transition-all flex-shrink-0"
                                    >
                                        <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </motion.div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">
                                            {feature.title}
                                        </h3>
                                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {feature.desc}
                                        </p>
                                    </div>
                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        className="text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-shrink-0"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 md:gap-4">
                        {[
                            { icon: Wallet, label: 'Balance', value: '$9.8K' },
                            { icon: CreditCard, label: 'Cards', value: '2' },
                            { icon: TrendingUp, label: 'Growth', value: '+28%' },
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.08, y: -4 }}
                                className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-100 dark:border-gray-700 group"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.2, rotate: 10 }}
                                    className="flex justify-center mb-2"
                                >
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <stat.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </motion.div>
                                <p className="text-base md:text-lg font-bold text-blue-600 dark:text-blue-400">
                                    {stat.value}
                                </p>
                                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {stat.label}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* CTA Section */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 dark:from-blue-600 dark:via-blue-700 dark:to-blue-800 rounded-2xl p-6 md:p-8 shadow-lg"
                    >
                        <div className="space-y-4">
                            <h3 className="font-bold text-white text-lg md:text-xl">
                                Ready to get started?
                            </h3>
                            <p className="text-white/90 text-sm md:text-base">
                                Join thousands of users taking control of their finances today.
                            </p>
                            <motion.button
                                whileHover="hover"
                                whileTap="tap"
                                variants={buttonVariants}
                                className="w-full bg-white hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 text-blue-600 dark:text-blue-400 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 group shadow-md"
                            >
                                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                                Open Account
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Footer */}
            <motion.footer
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.8 }}
                className="max-w-7xl mx-auto mt-12 md:mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400 relative z-10"
            >
                <p>© 2026 Financial Dashboard. All rights reserved. | Secure • Fast • Reliable</p>
            </motion.footer>
        </div>
    );
};

export default FinancialDashboard;
