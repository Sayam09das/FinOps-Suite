import { Clock, FileText, Layers, Users } from "lucide-react";

import { Card, CardContent } from "@/app/components/ui/card";
import { Reveal } from "@/app/components/ui/reveal";

const steps = [
  {
    title: "Prepare close items",
    description: "Gather balance adjustments, accruals, and supporting documentation before review.",
    icon: FileText,
  },
  {
    title: "Review and approve",
    description: "Route tasks clearly with status updates and ownership assignments.",
    icon: Users,
  },
  {
    title: "Publish results",
    description: "Share final close summaries with finance leadership and stakeholders.",
    icon: Layers,
  },
  {
    title: "Iterate faster",
    description: "Use the same process every period with fewer last-minute fixes.",
    icon: Clock,
  },
];

export default function CloseWorkflow() {
  return (
    <section id="workflow" className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-foreground/50">Close workflow</p>
        <h2 className="max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
          The workflow your team can repeat every period.
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {steps.map((item, index) => (
          <Reveal key={item.title} delay={0.05 * index} variant="scale">
            <Card className="rounded-[2rem] border border-border/60 bg-background/90 p-6 shadow-sm">
              <CardContent className="space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700">
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-foreground">{item.title}</p>
                  <p className="text-sm leading-6 text-foreground/70">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
