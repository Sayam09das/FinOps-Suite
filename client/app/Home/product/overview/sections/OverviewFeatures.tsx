import { Activity, Layers, PieChart, ShieldCheck } from "lucide-react";

import { Card, CardContent } from "@/app/components/ui/card";
import { Reveal } from "@/app/components/ui/reveal";

const features = [
  {
    title: "Cross-functional dashboards",
    description: "Combine finance, operations, and leadership views in a single connected workspace.",
    icon: Layers,
  },
  {
    title: "Automated reconciliation",
    description: "Match transactions, invoices, and balances faster with intelligent exception handling.",
    icon: ShieldCheck,
  },
  {
    title: "Forecasting clarity",
    description: "Build scenarios with clear assumptions and share them with your team instantly.",
    icon: PieChart,
  },
  {
    title: "Fast approvals",
    description: "Streamline approvals with clear status indicators and audit-ready history.",
    icon: Activity,
  },
];

export default function OverviewFeatures() {
  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-foreground/50">Product features</p>
        <h2 className="max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
          Powerful tools built for modern finance teams.
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature, index) => (
          <Reveal key={feature.title} delay={0.06 * index} variant="scale">
            <Card className="h-full border border-border/60 bg-background/90 p-6 shadow-sm">
              <CardContent className="space-y-4">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm leading-6 text-foreground/70">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
