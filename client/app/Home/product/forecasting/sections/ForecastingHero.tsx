import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, CalendarDays } from "lucide-react";

import { Badge } from "@/app/components/ui/badge";
import { buttonVariants } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Reveal } from "@/app/components/ui/reveal";

const cards = [
  { title: "Scenario planning", detail: "Compare assumptions side-by-side in minutes." },
  { title: "Rolling forecast", detail: "Keep your plan fresh with live budget updates." },
  { title: "What-if analysis", detail: "Model impact across revenue, cost, and headcount." },
];

export default function ForecastingHero() {
  return (
    <section className="grid gap-10 lg:grid-cols-[1fr_0.95fr] xl:items-center">
      <Reveal className="space-y-8" variant="left">
        <Badge>
          <Sparkles className="h-4 w-4 text-accent-foreground" />
          Forecasting
        </Badge>
        <div className="space-y-5">
          <h1 className="max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
            Forecast with more confidence and less guesswork.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-foreground/72 sm:text-xl">
            Turn historical spend and budgets into actionable predictions, with clear assumptions and visual scenarios your
            team can trust.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/pricing" className={buttonVariants({ size: "lg" })}>
            Try forecasting
          </Link>
          <Link href="/product/forecasting#ai" className={buttonVariants({ variant: "secondary", size: "lg" })}>
            Explore AI
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {cards.map((card, index) => (
            <Reveal key={card.title} delay={0.05 * index} variant="scale">
              <Card variant="ghost" padding="md" className="h-full">
                <CardContent>
                  <p className="text-sm text-foreground/56">{card.title}</p>
                  <p className="mt-3 text-lg font-semibold text-foreground">{card.detail}</p>
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
              <CalendarDays className="h-5 w-5" />
              <p className="text-sm font-semibold uppercase tracking-[0.25em]">Forecast accuracy</p>
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">Move from gut feel to useful projections.</h2>
              <p className="text-sm leading-6 text-foreground/70">
                Build forecasts with historical context, scenario stress tests, and live plan variance so leaders can act.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-foreground/5 p-5">
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-foreground/70">Trend analysis</p>
                <p className="mt-2 text-lg font-semibold text-foreground">See the drivers behind every forecast.</p>
              </div>
              <div className="rounded-3xl bg-foreground/5 p-5">
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-foreground/70">Collaborative plans</p>
                <p className="mt-2 text-lg font-semibold text-foreground">Align finance and ops on one model.</p>
              </div>
            </div>
          </div>
        </Card>
      </Reveal>
    </section>
  );
}
