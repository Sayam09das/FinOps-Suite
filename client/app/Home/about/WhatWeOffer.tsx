import { BellDot, ChartColumnBig, ShieldCheck, WalletCards, Workflow } from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionHeading } from "@/app/components/ui/section-heading";

const offers = [
  {
    title: "Budget intelligence",
    description: "Give teams a clearer view of planned versus actual movement with less visual noise.",
    icon: ChartColumnBig,
  },
  {
    title: "Approval routing",
    description: "Move requests through a cleaner workflow with stronger handoffs and better visibility.",
    icon: Workflow,
  },
  {
    title: "Spend controls",
    description: "Keep policy checks, outliers, and renewal signals visible without turning the UI harsh.",
    icon: ShieldCheck,
  },
  {
    title: "Payment readiness",
    description: "Bring destination, context, and approvals together so payment actions feel more deliberate.",
    icon: WalletCards,
  },
  {
    title: "Alerting that stays calm",
    description: "Use thoughtful emphasis instead of constant urgency to highlight what needs attention.",
    icon: BellDot,
  },
];

export default function WhatWeOffer() {
  return (
    <section className="space-y-8">
      <Reveal>
        <SectionHeading
          eyebrow="What We Offer"
          align="center"
          title={
            <>
              A product system built for
              <span className="block text-accent-foreground">serious work and smoother decisions.</span>
            </>
          }
          description="From strategic dashboards to lightweight approvals, the platform stays visually consistent and easier to navigate, whether your team is reviewing budgets on desktop or checking actions from a smaller screen."
        />
      </Reveal>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {offers.map((item, index) => {
          const Icon = item.icon;

          return (
            <Reveal key={item.title} delay={0.05 * index} variant="up">
              <Card variant={index === 2 ? "accent" : "surface"} padding="lg" className="h-full">
                <CardHeader className="space-y-4">
                  <div className="primary-wash flex h-12 w-12 items-center justify-center rounded-2xl">
                    <Icon className="h-5 w-5 text-foreground" />
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
