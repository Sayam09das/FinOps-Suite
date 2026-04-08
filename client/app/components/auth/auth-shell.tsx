'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

type AuthShellProps = Readonly<{
  children: ReactNode;
}>;

const entranceEase = [0.22, 1, 0.36, 1] as const;

function FloatingAccent({
  className,
  delay,
}: Readonly<{
  className: string;
  delay: number;
}>) {
  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      animate={{
        x: [0, 24, -12, 0],
        y: [0, -18, 16, 0],
        scale: [1, 1.06, 0.96, 1],
      }}
      transition={{
        duration: 14,
        delay,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: entranceEase,
      }}
    />
  );
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, color-mix(in srgb, var(--background) 90%, var(--secondary) 10%) 0%, color-mix(in srgb, var(--background) 95%, var(--primary) 5%) 48%, var(--background) 100%)',
        }}
      />

      <FloatingAccent className="left-[-5rem] top-10 h-40 w-40 bg-primary/12" delay={0} />
      <FloatingAccent className="right-[-4rem] top-24 h-44 w-44 bg-secondary/14" delay={1.1} />
      <FloatingAccent className="bottom-[-4rem] left-1/3 h-36 w-36 bg-accent/12" delay={2} />

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 26, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: entranceEase }}
          className="w-full rounded-[2rem] border border-primary/10 bg-background/95 p-4 shadow-[0_24px_80px_color-mix(in_srgb,var(--dark)_14%,transparent)] backdrop-blur-xl sm:p-5"
        >
          <div className="rounded-[1.5rem] border border-primary/8 bg-background p-4 sm:p-5 lg:p-6">
            {children}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
