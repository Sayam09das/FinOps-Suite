'use client';

import { motion } from "framer-motion";
import { TrendingUp, BarChart3, Lightbulb, Shield } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Expense Tracking",
    description: "Track every transaction in real-time with automatic categorization and receipt scanning.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Visualize spending patterns with interactive charts and AI-powered insights.",
  },
  {
    icon: Lightbulb,
    title: "Smart Insights",
    description: "Get actionable recommendations and anomaly detection to optimize your finances.",
  },
  {
    icon: Shield,
    title: "Secure Data",
    description: "Bank-grade encryption with biometric auth and automatic backups.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }
  }
};

export default function WhatWeOffer() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="py-32 px-4 bg-gradient-to-b from-slate-50/50 to-white"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          className="text-center text-5xl md:text-6xl font-black text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          What We Offer
        </motion.h2>
        <motion.p 
          className="text-center text-xl text-gray-600 max-w-3xl mx-auto mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Powerful features built for real financial control
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl p-8 shadow-xl border border-white/50 hover:shadow-2xl hover:border-primary/30 transition-all duration-500"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-blue-500/10 group-hover:from-primary/20 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-primary/25 transition-all duration-300">
                <feature.icon className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

