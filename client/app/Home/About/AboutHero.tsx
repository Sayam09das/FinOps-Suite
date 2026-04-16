'use client';

import { motion } from "framer-motion";
import Link from "next/link";
// Custom buttons using Link + Tailwind

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2
    }
  }
};

const childVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }
  }
};

export default function AboutHero() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="min-h-screen flex items-center justify-center px-4 py-24 bg-gradient-to-b from-slate-50 to-blue-50/30"
    >
      <div className="max-w-6xl mx-auto text-center">
        <motion.h1 
          variants={childVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-primary bg-clip-text text-transparent mb-6 leading-tight"
        >
          Simplifying Finance,
          <br />
          <span className="text-transparent bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text">
            Empowering Decisions
          </span>
        </motion.h1>
        
        <motion.p 
          variants={childVariants}
          className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          FinOps Suite transforms complex financial tracking into intuitive insights. 
          Track expenses, analyze patterns, and make confident decisions – all in one beautiful dashboard.
        </motion.p>
        
        <motion.div 
          variants={childVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/register" className="text-lg px-10 py-7 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 text-white font-semibold rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300">
            Start Tracking Free
          </Link>
          <Link href="/dashboard" className="text-lg px-10 py-7 font-semibold border-2 border-gray-200 hover:bg-white/50 hover:border-gray-300 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
            View Dashboard
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}

