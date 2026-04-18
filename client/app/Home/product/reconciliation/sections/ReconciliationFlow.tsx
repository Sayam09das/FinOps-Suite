import { CheckCircle2, FileSearch, Layers, Sparkles, Zap } from "lucide-react";

import { Card, CardContent } from "@/app/components/ui/card";
import { Reveal } from "@/app/components/ui/reveal";

const steps = [
  {
    title: "Connect your systems",
    description: "Bring together invoices, bank feeds, and ERP data in one trusted workspace.",
    icon: Layers,
  },
  {
    title: "Auto-match transactions",
    description: "Use rules and patterns to reconcile items automatically with fewer exceptions.",
    icon: Zap,
  },
  {
    title: "Review exceptions",
    description: "Keep review work organized with clear status labels and exception notes.",
    icon: FileSearch,
  },
  {
    title: "Close with confidence",
    description: "Publish reconciled balances and retain audit history for fast follow-up.",
    icon: CheckCircle2,
  },
];

export default function ReconciliationFlow() {
  return (
    <section id="workflow" className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-foreground/50">Reconciliation workflow</p>
        <h2 className="max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
          A smarter workflow for monthly close and balance matching.
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {steps.map((step, index) => (
          <Reveal key={step.title} delay={0.06 * index} variant="scale">
            <Card className="rounded-[2rem] border border-border/60 bg-background/90 p-6 shadow-sm">
              <CardContent className="space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700">
                  <step.icon className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-foreground">{step.title}</p>
                  <p className="text-sm leading-6 text-foreground/70">{step.description}</p>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
