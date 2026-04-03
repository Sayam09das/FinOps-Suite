'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LockKeyhole, ShieldCheck, Wallet2 } from 'lucide-react';

type AuthShellProps = Readonly<{
  title: string;
  subtitle: string;
  alternateCta: string;
  alternateHref: string;
  alternateLabel: string;
  children: ReactNode;
}>;

const features = [
  {
    icon: ShieldCheck,
    title: 'Clerk-secured sessions',
    description: 'Production-ready auth with session verification on both the client and API.',
  },
  {
    icon: Wallet2,
    title: 'Mongo-backed identity',
    description: 'Every Clerk account is synced to Prisma so app data stays relational and queryable.',
  },
  {
    icon: LockKeyhole,
    title: 'Protected dashboard flow',
    description: 'Only signed-in users can reach the dashboard and issue authenticated backend requests.',
  },
] as const;

export function AuthShell({
  title,
  subtitle,
  alternateCta,
  alternateHref,
  alternateLabel,
  children,
}: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f8f5ff_0%,#ffffff_45%,#eef7ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(178,100,255,0.15),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(132,204,22,0.14),transparent_30%)]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.section
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[2rem] border border-white/60 bg-dark p-8 text-white shadow-[0_35px_90px_rgba(15,23,42,0.18)] sm:p-10"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/15"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
              FS
            </span>
            FinOps Suite
          </Link>

          <div className="mt-10 max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">
              Authentication Platform
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/72 sm:text-lg">
              {subtitle}
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.article
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.18 + index * 0.12, duration: 0.5 }}
                  className="rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">{feature.title}</h2>
                      <p className="mt-1 text-sm leading-6 text-white/68">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-[0_30px_80px_rgba(80,12,176,0.12)] backdrop-blur-xl sm:p-8"
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary">{alternateLabel}</p>
              <p className="mt-1 text-sm text-slate-600">{alternateCta}</p>
            </div>
            <Link
              href={alternateHref}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
            >
              Switch
            </Link>
          </div>

          <div className="rounded-[1.75rem] border border-slate-100 bg-white p-2 shadow-inner shadow-slate-100">
            {children}
          </div>
        </motion.section>
      </div>
    </main>
  );
}
