import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Clock4 } from "lucide-react";

import { Badge } from "@/app/components/ui/badge";
import { buttonVariants } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Reveal } from "@/app/components/ui/reveal";

const stats = [
  { label: "Match rate", value: "98%" },
  { label: "Reconciliation speed", value: "3x faster" },
  { label: "Exception volume", value: "60% less manual review" },
];

export default function ReconciliationHero() {
  return (
    <section className="grid gap-10 lg:grid-cols-[1fr_0.95fr] xl:items-center">
      <Reveal className="space-y-8" variant="left">
        <Badge>
          <Sparkles className="h-4 w-4 text-accent-foreground" />
          Reconciliation
        </Badge>
        <div className="space-y-5">
          <h1 className="max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
            Reconcile spend, invoices, and balances with less manual effort.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-foreground/72 sm:text-xl">
            Automate the heavy lifting for your month-end close, surface exceptions quickly, and keep stakeholders aligned with
            a consistent reconciliation workflow.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/pricing" className={buttonVariants({ size: "lg" })}>
            Start reconciling
          </Link>
          <Link href="/product/reconciliation#workflow" className={buttonVariants({ variant: "secondary", size: "lg" })}>
            See workflow
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((item, index) => (
            <Reveal key={item.label} delay={0.05 * index} variant="scale">
              <Card variant="ghost" padding="md" className="h-full">
                <CardContent>
                  <p className="text-sm text-foreground/56">{item.label}</p>
                  <p className="text-3xl font-semibold tracking-[-0.04em] text-foreground">{item.value}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal variant="scale" delay={0.08}>
        <Card variant="surface" padding="xl" className="overflow-hidden">
          <div className="space-y-6 rounded-[2rem] border border-white/60 bg-white/50 p-8 shadow-sm backdrop-blur-sm">
            <div className="inline-flex items-center gap-3 rounded-2xl bg-emerald-100 px-4 py-3 text-emerald-700">
              <ShieldCheck className="h-5 w-5" />
              <p className="text-sm font-semibold uppercase tracking-[0.25em]">Audit-ready control</p>
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">Run a tighter reconciliation process</h2>
              <p className="text-sm leading-6 text-foreground/70">
                Use automated matching, status tracking, and exception workflows to keep every close consistent and fast.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-foreground/5 p-5">
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-foreground/70">Faster closes</p>
                <p className="mt-2 text-lg font-semibold text-foreground">Get more done before quarter-end.</p>
              </div>
              <div className="rounded-3xl bg-foreground/5 p-5">
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-foreground/70">Less risk</p>
                <p className="mt-2 text-lg font-semibold text-foreground">Keep every entry traceable and verified.</p>
              </div>
            </div>
          </div>
        </Card>
      </Reveal>
    </section>
  );
}
