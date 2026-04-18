import { Activity, Cpu, Sparkles, TrendingUp, Wand } from "lucide-react";

import { Card, CardContent } from "@/app/components/ui/card";
import { Reveal } from "@/app/components/ui/reveal";

const aiFeatures = [
  {
    title: "AI-assisted scenarios",
    description: "Generate projections from historical spend with a few clicks.",
    icon: Wand,
  },
  {
    title: "Smart recommendations",
    description: "Surface areas of risk and upside before you finalize the plan.",
    icon: TrendingUp,
  },
  {
    title: "Clear assumptions",
    description: "Keep forecast drivers transparent for every stakeholder.",
    icon: Activity,
  },
  {
    title: "Fast model updates",
    description: "Recalculate budgets and revenue paths as the business changes.",
    icon: Cpu,
  },
];

export default function ForecastingAI() {
  return (
    <section id="ai" className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-foreground/50">Forecasting AI</p>
        <h2 className="max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
          AI support that helps teams predict with more certainty.
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-foreground/72">
          Use machine-assisted planning to reduce guesswork and keep forecasts aligned with actual performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {aiFeatures.map((feature, index) => (
          <Reveal key={feature.title} delay={0.05 * index} variant="scale">
            <Card className="h-full rounded-[2rem] border border-border/60 bg-background/90 p-6 shadow-sm">
              <CardContent className="space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-foreground">{feature.title}</p>
                  <p className="text-sm leading-6 text-foreground/70">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <Reveal variant="left">
          <Card className="rounded-[2rem] border border-border/60 bg-emerald-950/5 p-6 shadow-sm">
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-emerald-700">
                <Sparkles className="h-5 w-5" />
                <p className="text-sm font-semibold uppercase tracking-[0.3em]">Forecasting confidence</p>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-foreground">From intuition to evidence-based planning</h3>
                <p className="text-sm leading-6 text-foreground/72">
                  Get forecast suggestions that factor in seasonality, budget drivers, and spend patterns so you can move
                  faster and stay aligned.
                </p>
              </div>
            </CardContent>
          </Card>
        </Reveal>

        <Reveal variant="scale" delay={0.06}>
          <Card className="rounded-[2rem] border border-border/60 bg-background/90 p-6 shadow-sm">
            <CardContent className="space-y-4">
              <div className="text-sm font-semibold uppercase tracking-[0.32em] text-foreground/50">Live forecast summary</div>
              <div className="space-y-2">
                <p className="text-3xl font-semibold text-foreground">$12.4M</p>
                <p className="text-sm leading-6 text-foreground/72">Next quarter expected run rate with smoothing applied.</p>
              </div>
              <div className="rounded-3xl bg-emerald-100 p-4 text-sm text-emerald-700">Forecast accuracy improved by 18% after model updates.</div>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
