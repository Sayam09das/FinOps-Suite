import { BarChart3, CircleDot, Grid, LineChart } from "lucide-react";

import { Card, CardContent } from "@/app/components/ui/card";
import { Reveal } from "@/app/components/ui/reveal";

const chartBlocks = [
  {
    title: "Revenue trend",
    value: "$8.4M",
    detail: "Monthly revenue growth over the last six months.",
    icon: LineChart,
  },
  {
    title: "Expense breakdown",
    value: "23% ops spend",
    detail: "Clear categories for faster review and budgeting.",
    icon: Grid,
  },
  {
    title: "Close readiness",
    value: "92% complete",
    detail: "Track the metrics that matter before month end.",
    icon: CircleDot,
  },
];

export default function ReportingCharts() {
  return (
    <section id="charts" className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-foreground/50">Reporting charts</p>
        <h2 className="max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
          Visual insights for every review and decision.
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-foreground/72">
          Keep the story simple with charts, scorecards, and summary views that help teams act faster.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {chartBlocks.map((block, index) => (
          <Reveal key={block.title} delay={0.05 * index} variant="scale">
            <Card className="h-full rounded-[2rem] border border-border/60 bg-background/95 p-6 shadow-sm">
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-foreground/50">{block.title}</p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">{block.value}</p>
                  </div>
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700">
                    <block.icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-sm leading-6 text-foreground/70">{block.detail}</p>
                <div className="space-y-2">
                  <div className="h-2 rounded-full bg-muted/50">
                    <div className="h-2 w-3/4 rounded-full bg-emerald-700" />
                  </div>
                  <div className="h-2 rounded-full bg-muted/50">
                    <div className="h-2 w-1/2 rounded-full bg-slate-500/70" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal variant="scale" delay={0.08}>
        <Card className="rounded-[2rem] border border-border/60 bg-emerald-950/5 p-6 shadow-sm">
          <CardContent className="space-y-4">
            <div className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-700">Reporting snapshot</div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-background/90 p-4 text-sm text-foreground/80">
                <p className="font-semibold text-foreground">Finance score</p>
                <p className="mt-2 text-lg font-semibold text-foreground">87/100</p>
              </div>
              <div className="rounded-3xl bg-background/90 p-4 text-sm text-foreground/80">
                <p className="font-semibold text-foreground">Report delivery</p>
                <p className="mt-2 text-lg font-semibold text-foreground">Daily + weekly</p>
              </div>
              <div className="rounded-3xl bg-background/90 p-4 text-sm text-foreground/80">
                <p className="font-semibold text-foreground">Review readiness</p>
                <p className="mt-2 text-lg font-semibold text-foreground">Office hours ready</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Reveal>
    </section>
  );
}
