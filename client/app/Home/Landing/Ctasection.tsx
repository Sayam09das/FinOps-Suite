"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Apple,
  MessageCircle,
  ShieldCheck,
  ArrowRight,
  Home,
  Car,
  PiggyBank,
  Gamepad2,
  Users,
  Plus,
  Check,
  X,
} from "lucide-react";

const fadeUp: any = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.13, duration: 0.6, ease: "easeOut" },
  }),
};

const float = (y: number[], dur: number, delay = 0): any => ({
  animate: {
    y,
    transition: { duration: dur, repeat: Infinity, ease: "easeInOut", delay },
  },
});

/* ── Left floating card: iCloud subscription ── */
function ICloudCard() {
  return (
    <motion.div
      {...float([-6, 6, -6], 4, 0)}
      className="absolute left-4 top-8 w-44 rounded-2xl p-4 shadow-xl"
      style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.25)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
          <Apple size={14} className="text-white" />
        </div>
        <span className="text-white text-xs font-600" style={{ fontWeight: 600 }}>Icloud</span>
      </div>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-white text-2xl font-800" style={{ fontWeight: 800 }}>$50</span>
        <span className="text-white/60 text-xs">/month</span>
      </div>
      <div className="flex gap-2">
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
          <X size={10} className="text-white/70" />
        </div>
        <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center">
          <Check size={10} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
}

/* ── Left lower: Add Friends card ── */
function AddFriendsCard() {
  const friends = ["AL", "MR", "JK", "SB", "TN"];
  const colors = ["#F3D5C0", "#C8DFF3", "#D5F3C8", "#F3C8D5", "#E8D5F3"];
  return (
    <motion.div
      {...float([4, -4, 4], 5, 0.8)}
      className="absolute left-0 bottom-8 w-40 rounded-2xl p-4 shadow-xl"
      style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.2)" }}
    >
      <p className="text-white/80 text-xs mb-3 font-500" style={{ fontWeight: 500 }}>Add Friends</p>
      <div className="grid grid-cols-3 gap-2">
        {friends.slice(0, 4).map((f, i) => (
          <div key={f} className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-600"
            style={{ background: colors[i], color: "#555", fontWeight: 600 }}>
            {f}
          </div>
        ))}
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
          <Plus size={12} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
}

/* ── Right floating card: Netflix ── */
function NetflixCard() {
  return (
    <motion.div
      {...float([-8, 4, -8], 4.5, 0.3)}
      className="absolute right-4 top-6 w-40 rounded-2xl p-4 shadow-xl"
      style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.2)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-red-400 font-900 text-lg" style={{ fontWeight: 900, fontFamily: "Georgia, serif" }}>N</span>
        <span className="text-white/80 text-xs">Net...</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-white text-2xl font-800" style={{ fontWeight: 800 }}>$24</span>
        <span className="text-white/60 text-xs">/month</span>
      </div>
    </motion.div>
  );
}

/* ── Right lower: Expense Allocation ── */
function ExpenseCard() {
  const items = [
    { label: "Rent and Living", amount: "$3,838.25", color: "#9B7FFF", pct: "55%" },
    { label: "Transportation", amount: "$1,220.45", color: "#6B6B6B", pct: "20%" },
    { label: "Saving", amount: "$984.93", color: "#3B82F6", pct: "15%" },
    { label: "Entertainment", amount: "$735.12", color: "#A855F7", pct: "10%" },
  ];
  return (
    <motion.div
      {...float([5, -5, 5], 5.5, 0.5)}
      className="absolute right-0 bottom-4 w-48 rounded-2xl p-4 shadow-xl"
      style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.2)" }}
    >
      <p className="text-white/80 text-xs mb-3 font-600" style={{ fontWeight: 600 }}>Expense Alloc...</p>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: item.color }} />
            <div className="flex-1 min-w-0">
              <p className="text-white/80 text-[9px] truncate leading-tight">{item.label}</p>
              <p className="text-white/50 text-[8px]">{item.amount} ({item.pct})</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function CTASection() {
  return (
    <section
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="bg-white px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-5 items-center"
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');`}</style>

      {/* ── TOP: Hero Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-5xl relative overflow-hidden rounded-3xl"
        style={{ background: "linear-gradient(135deg, #5B4FE8 0%, #6C63FF 50%, #7B6FF0 100%)", minHeight: 340 }}
      >
        {/* Subtle dot grid overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        {/* Floating app cards */}
        <ICloudCard />
        <AddFriendsCard />
        <NetflixCard />
        <ExpenseCard />

        {/* Centre copy */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16 sm:py-20 min-h-[340px]">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-4 max-w-xl"
            style={{ fontWeight: 800 }}
          >
            Ready to Run your
            <br />
            Business{" "}
            <span
              className="relative inline-block"
              style={{ color: "#A8E63D" }}
            >
              Better
              {/* underline squiggle */}
              <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 100 6" preserveAspectRatio="none">
                <path d="M0 4 Q25 0 50 4 Q75 8 100 4" stroke="#A8E63D" strokeWidth="2" fill="none" />
              </svg>
            </span>{" "}
            with us
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-white/70 text-sm sm:text-base max-w-xs mb-8 leading-relaxed"
          >
            Welcome to FinSuite, where financial management meets simplicity and efficiency.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              href="/sign-up"
              prefetch={false}
              className="inline-flex rounded-full px-8 py-3.5 text-sm text-white shadow-lg"
              style={{ background: "#4DA8FF", fontWeight: 600, boxShadow: "0 8px 32px rgba(77,168,255,0.45)" }}
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* ── BOTTOM: Two cards ── */}
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 gap-5">

        {/* Live Chat */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          custom={0}
          variants={fadeUp}
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="rounded-3xl p-8 flex flex-col gap-5"
          style={{ background: "#EDE8FF" }}
        >
          {/* Icon */}
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm">
            <MessageCircle size={22} className="text-purple-600" fill="#7C3AED" />
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl text-slate-900 mb-2" style={{ fontWeight: 800 }}>
              Live Chat
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="self-start px-6 py-2.5 rounded-full border-2 border-slate-900 text-slate-900 text-sm bg-transparent"
            style={{ fontWeight: 700 }}
          >
            Book a Call
          </motion.button>
        </motion.div>

        {/* Watch a Demo */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          custom={1}
          variants={fadeUp}
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="rounded-3xl p-8 flex flex-col gap-5"
          style={{ background: "#E6F5D8" }}
        >
          {/* Icon */}
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm">
            <ShieldCheck size={22} className="text-green-500" fill="#86EFAC" strokeWidth={1.5} />
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl text-slate-900 mb-2" style={{ fontWeight: 800 }}>
              Watch a Demo
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="self-start px-6 py-2.5 rounded-full border-2 border-slate-900 text-slate-900 text-sm bg-transparent"
            style={{ fontWeight: 700 }}
          >
            Watch Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
