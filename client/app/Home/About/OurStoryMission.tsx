'use client';

import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const childVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

export default function OurStoryMission() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="py-32 px-4 bg-white"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div variants={childVariants}>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent">
              Our Story
            </h2>
            <div className="space-y-6 text-xl text-gray-600 leading-relaxed">
              <p>
                We built <span className="font-semibold text-primary">FinOps Suite</span> to solve the chaos of tracking expenses and understanding financial health in one place.
              </p>
              <p>
                Traditional tools were either spreadsheets (too manual) or bloated enterprise software (too complex). We wanted something elegant, powerful, and{" "}
                <span className="font-semibold text-primary">intuitive</span>.
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                Our vision: Finance should feel simple, not stressful.
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            variants={childVariants}
            className="relative"
          >
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100/50 rounded-3xl p-12 shadow-2xl backdrop-blur-sm border border-blue-100/50">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900">The Problem</h4>
                  <p className="text-gray-600">Fragmented tracking across apps</p>
                </div>
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900">Our Solution</h4>
                  <p className="text-gray-600">Unified, intelligent dashboard</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

