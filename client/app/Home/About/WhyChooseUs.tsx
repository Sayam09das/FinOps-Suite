'use client';

import { motion } from "framer-motion";
import { Users, Clock, Zap, ShieldCheck } from "lucide-react";

const stats = [
  { icon: Users, label: "Transactions Tracked", value: "10K+" },
  { icon: Clock, label: "Uptime", value: "99.9%" },
  { icon: Zap, label: "Response Time", value: "<50ms" },
  { icon: ShieldCheck, label: "Security Score", value: "A+" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const statVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 30 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }
  }
};

export default function WhyChooseUs() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="py-32 px-4 bg-gradient-to-r from-indigo-50 via-white to-emerald-50"
    >
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2 
          className="text-5xl md:text-6xl font-black text-gray-900 mb-6 bg-gradient-to-r from-gray-900 via-primary to-emerald-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Why Choose Us
        </motion.h2>
        <motion.p 
          className="text-xl text-gray-600 max-w-2xl mx-auto mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Built for speed, security, and simplicity
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={statVariants}
              whileHover={{ scale: 1.05 }}
              className="group p-8 rounded-3xl bg-white/60 backdrop-blur-md shadow-xl hover:shadow-2xl border border-white/40 hover:border-primary/30 transition-all duration-500"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl mx-auto transition-all">
                <stat.icon className="w-8 h-8 text-white drop-shadow-md" />
              </div>
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-black text-gray-900 group-hover:text-primary transition-colors">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

