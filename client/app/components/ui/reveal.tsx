"use client";

import type { ReactNode } from "react";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/utils";

type RevealVariant = "fade" | "up" | "left" | "right" | "scale";

type RevealProps = Omit<HTMLMotionProps<"div">, "children"> & {
  amount?: number;
  children: ReactNode;
  delay?: number;
  duration?: number;
  variant?: RevealVariant;
};

const revealOffsets: Record<RevealVariant, { opacity: number; scale?: number; x?: number; y?: number }> = {
  fade: { opacity: 0 },
  left: { opacity: 0, x: -28 },
  right: { opacity: 0, x: 28 },
  scale: { opacity: 0, scale: 0.96, y: 18 },
  up: { opacity: 0, y: 28 },
};

export function Reveal({
  amount = 0.25,
  children,
  className,
  delay = 0,
  duration = 0.6,
  variant = "up",
  ...props
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? { opacity: 1, x: 0, y: 0, scale: 1 } : revealOffsets[variant];

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount }}
      transition={{ duration: reduceMotion ? 0 : duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
