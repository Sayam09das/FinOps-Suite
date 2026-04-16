'use client';

import { motion } from "framer-motion";
import Link from "next/link";

const ctaVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }
  }
};

export default function CTA() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={ctaVariants}
      className="py-32 px-4 bg-gradient-to-b from-primary via-blue-600 to-purple-600"
    >
      <div className="max-w-4xl mx-auto text-center text-white">
        <motion.h2 
          className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 drop-shadow-2xl leading-tight"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Start Managing Your Finances Today
        </motion.h2>
        
        <motion.p 
          className="text-xl md:text-2xl text-blue-100/90 max-w-2xl mx-auto mb-12 drop-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Join thousands already taking control of their financial future with FinOps Suite.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link href="/register">
            <div className="px-12 py-6 text-xl font-bold bg-white text-primary rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-105 hover:bg-white/90 transition-all duration-300">
              Get Started Free
            </div>
          </Link>
          <Link href="/dashboard" className="text-xl font-semibold hover:underline hover:underline-offset-4">
            Or try Dashboard demo →
          </Link>
        </motion.div>

        <motion.div 
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto opacity-80"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {["No credit card", "14-day trial", "Cancel anytime", "7×24 support"].map((benefit, index) => (
            <div key={benefit} className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span>{benefit}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

