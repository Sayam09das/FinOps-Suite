import Link from "next/link";
import { ArrowRight, Sparkles, Table, TrendingUp } from "lucide-react";

import { Badge } from "@/app/components/ui/badge";
import { buttonVariants } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Reveal } from "@/app/components/ui/reveal";

const stats = [
  { label: "Custom dashboards", value: "Build in minutes" },
  { label: "Shared insights", value: "All teams aligned" },
  { label: "Actionable summaries", value: "Less noise, more clarity" },
];

export default function ReportingHero() {
  return (
    <section className="grid gap-10 lg:grid-cols-[1fr_0.95fr] xl:items-center">
      <Reveal className="space-y-8" variant="left">
        <Badge>
          <Sparkles className="h-4 w-4 text-accent-foreground" />
          Reporting
        </Badge>
        <div className="space-y-5">
          <h1 className="max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
            Reports that bring clarity to finance and operations.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-foreground/72 sm:text-xl">
            Build dashboards, share summary reports, and surface the metrics that matter for every close, forecast, and review.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/pricing" className={buttonVariants({ size: "lg" })}>
            See reporting
          </Link>
          <Link href="/product/reporting#charts" className={buttonVariants({ variant: "secondary", size: "lg" })}>
            View charts
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((item, index) => (
            <Reveal key={item.label} delay={0.05 * index} variant="scale">
              <Card variant="ghost" padding="md" className="h-full">
                <CardContent>
                  <p className="text-sm text-foreground/56">{item.label}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">{item.value}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal variant="scale" delay={0.08}>
        <Card variant="surface" padding="xl" className="overflow-hidden">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[2rem] border border-white/60 bg-white/50 p-6 shadow-sm backdrop-blur-sm">
              <div className="inline-flex items-center gap-3 text-emerald-700">
                <Table className="h-5 w-5" />
                <p className="text-sm font-semibold uppercase tracking-[0.25em]">Connected data</p>
              </div>
              <p className="mt-4 text-sm leading-6 text-foreground/72">
                Reports update automatically from the systems your team already uses, so the numbers stay current.
              </p>
            </div>
            <div className="rounded-[2rem] border border-white/60 bg-white/50 p-6 shadow-sm backdrop-blur-sm">
              <div className="inline-flex items-center gap-3 text-slate-900">
                <TrendingUp className="h-5 w-5" />
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-900">Visual clarity</p>
              </div>
              <p className="mt-4 text-sm leading-6 text-foreground/72">
                Use charts and tables side-by-side to tell the story behind the numbers without extra effort.
              </p>
            </div>
          </div>
        </Card>
      </Reveal>
    </section>
  );
}
