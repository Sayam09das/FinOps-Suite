import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";

import { Badge } from "@/app/components/ui/badge";
import { buttonVariants } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionHeading } from "@/app/components/ui/section-heading";

const plans = [
  {
    name: "Starter",
    price: "$29",
    cadence: "/month",
    description: "For smaller teams starting to organize budgets and approvals with more structure.",
    features: ["Budget tracking", "Basic dashboards", "Approval workflows", "Email support"],
    variant: "surface" as const,
  },
  {
    name: "Growth",
    price: "$99",
    cadence: "/month",
    description: "For scaling teams that need collaboration, stronger reporting, and faster decision-making.",
    features: ["Advanced analytics", "Shared workspaces", "Policy controls", "Priority support"],
    variant: "contrast" as const,
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    description: "For larger organizations needing tailored controls, workflows, and executive-ready reporting.",
    features: ["Custom controls", "Dedicated onboarding", "Executive reporting", "Security reviews"],
    variant: "accent" as const,
  },
];

export default function PricingCards() {
  return (
    <section id="plans" className="space-y-8">
      <Reveal>
        <SectionHeading
          eyebrow="Plans"
          align="center"
          title={
            <>
              Pick the plan that matches your
              <span className="block text-accent-foreground">operational depth and team size.</span>
            </>
          }
          description="Each plan keeps the same thoughtful design language while expanding the layers of reporting, collaboration, and control."
        />
      </Reveal>

      <div className="grid gap-5 xl:grid-cols-3">
        {plans.map((plan, index) => (
          <Reveal key={plan.name} delay={0.06 * index} variant="up">
            <Card variant={plan.variant} padding="xl" className="relative h-full overflow-hidden">
              {plan.featured ? (
                <div className="absolute right-6 top-6">
                  <Badge variant="accent">
                    <Sparkles className="h-4 w-4" />
                    Most popular
                  </Badge>
                </div>
              ) : null}

              <CardContent className="flex h-full flex-col justify-between">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <p className={`text-sm font-medium ${plan.featured ? "text-background/72" : "text-foreground/55"}`}>
                      {plan.name}
                    </p>
                    <div className="flex items-end gap-2">
                      <p className={`text-5xl font-semibold tracking-[-0.05em] ${plan.featured ? "text-background" : "text-foreground"}`}>
                        {plan.price}
                      </p>
                      <p className={`${plan.featured ? "text-background/68" : "text-foreground/56"}`}>{plan.cadence}</p>
                    </div>
                    <p className={`text-sm leading-7 ${plan.featured ? "text-background/76" : "text-foreground/68"}`}>
                      {plan.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <Check className={`mt-1 h-4 w-4 ${plan.featured ? "text-primary" : "text-accent-foreground"}`} />
                        <p className={`text-sm leading-7 ${plan.featured ? "text-background/82" : "text-foreground/72"}`}>
                          {feature}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href="/pricing"
                  className={buttonVariants({
                    variant: plan.featured ? "light" : plan.variant === "accent" ? "accent" : "secondary",
                    size: "lg",
                  })}
                >
                  Choose {plan.name}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
