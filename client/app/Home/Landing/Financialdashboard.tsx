import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Target } from "lucide-react";

import { Badge } from "@/app/components/ui/badge";
import { buttonVariants } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionHeading } from "@/app/components/ui/section-heading";

const dashboardHighlights = [
  {
    title: "Variance watch",
    description: "Surface unusual movement quickly with calmer visual cues and less noisy reporting.",
  },
  {
    title: "Forecast confidence",
    description: "Keep the planning team aligned with always-on trend summaries and shared commentary.",
  },
];

const months = [
  { label: "Jan", height: "h-16" },
  { label: "Feb", height: "h-24" },
  { label: "Mar", height: "h-20" },
  { label: "Apr", height: "h-28" },
  { label: "May", height: "h-22" },
  { label: "Jun", height: "h-32" },
  { label: "Jul", height: "h-24" },
];

const sideCards = [
  { label: "Cash position", value: "$2.4M", detail: "Healthy runway across current plans" },
  { label: "Open actions", value: "12", detail: "Team reviews, renewals, and policy checks" },
  { label: "Budget health", value: "93%", detail: "Most departments remain inside target bands" },
];

export default function Financialdashboard() {
  return (
    <section id="dashboard" className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      <Reveal className="space-y-8" variant="left">
        <SectionHeading
          eyebrow="Financial Dashboard"
          title={
            <>
              One view for financial movement,
              <span className="block text-accent-foreground">without the usual reporting friction.</span>
            </>
          }
          description="The dashboard is designed to feel steady and legible on every screen size, so operators can scan key signals fast while leadership still gets enough depth for confident decisions."
        />

        <div className="grid gap-4">
          {dashboardHighlights.map((item, index) => (
            <Reveal key={item.title} delay={0.08 * index} variant="up">
              <Card variant="surface" padding="lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="primary-wash flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl">
                      {index === 0 ? <Target className="h-5 w-5 text-foreground" /> : <ShieldCheck className="h-5 w-5 text-foreground" />}
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardDescription>{item.description}</CardDescription>
              </Card>
            </Reveal>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/about" className={buttonVariants({ size: "lg" })}>
            Learn the approach
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/blog" className={buttonVariants({ size: "lg", variant: "secondary" })}>
            Explore product thinking
          </Link>
        </div>
      </Reveal>

      <Reveal variant="scale" delay={0.1}>
        <Card variant="surface" padding="xl" className="overflow-hidden">
          {/* ── Inner grid: stacks on mobile/tablet, side-by-side on xl ── */}
          <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">

            {/* ── Left column ── */}
            <div className="space-y-5">
              <Badge variant="accent" className="w-fit">
                <Sparkles className="h-4 w-4" />
                Live command center
              </Badge>

              {/* Budget performance card */}
              <Card variant="frosted" padding="lg">
                <CardContent>
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-foreground/55">Monthly budget performance</p>
                      <p className="text-2xl font-semibold tracking-[-0.05em] text-foreground sm:text-3xl">
                        $247k within plan
                      </p>
                    </div>
                    <p className="text-sm font-medium text-accent-foreground">+12% forecast confidence</p>
                  </div>

                  {/* Metric tiles: 1-col on xs, 3-col from sm */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {[
                      { label: "Revenue", value: "$1.9M" },
                      { label: "Spend", value: "$612k" },
                      { label: "Savings", value: "$84k" },
                    ].map((metric) => (
                      <div key={metric.label} className="rounded-[1.3rem] border border-white/55 bg-white/45 p-4">
                        <p className="text-sm text-foreground/52">{metric.label}</p>
                        <p className="mt-2 text-xl font-semibold text-foreground">{metric.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Bar chart card — bars scale down on xs */}
              <Card variant="ghost" padding="lg" className="bg-background/72">
                <CardContent>
                  <div className="flex items-end justify-between gap-1 sm:gap-3">
                    {months.map((month, index) => (
                      <Reveal key={month.label} delay={0.04 * index} variant="up" className="flex flex-1 flex-col items-center gap-2 sm:gap-3">
                        <div className="flex h-28 w-full items-end sm:h-36">
                          <div className={`w-full rounded-t-[0.75rem] bg-gradient-to-t from-foreground via-primary to-primary/40 sm:rounded-t-[1rem] ${month.height}`} />
                        </div>
                        <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-foreground/45 sm:text-xs sm:tracking-[0.16em]">
                          {month.label}
                        </span>
                      </Reveal>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ── Right column: 2-col grid on sm–lg, single-col elsewhere ── */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
              {sideCards.map((item, index) => (
                <Reveal key={item.label} delay={0.12 + index * 0.06} variant="right">
                  <Card variant={index === 1 ? "accent" : "surface"} padding="lg" className="h-full">
                    <CardContent>
                      <p className="text-sm text-foreground/54">{item.label}</p>
                      <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">{item.value}</p>
                      <p className="mt-3 text-sm leading-6 text-foreground/68">{item.detail}</p>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}

              {/* Contrast card: full width, spans both columns on sm–lg */}
              <div className="sm:col-span-2 xl:col-span-1">
                <Card variant="contrast" padding="lg" className="border-white/10">
                  <CardContent>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                      <div className="space-y-2">
                        <p className="text-lg font-semibold text-background">Ready for desktop and mobile review</p>
                        <p className="text-sm leading-6 text-background/78">
                          The dashboard layout compresses gracefully, so the same information hierarchy stays usable on
                          tablets and smaller screens.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

          </div>
        </Card>
      </Reveal>
    </section>
  );
}