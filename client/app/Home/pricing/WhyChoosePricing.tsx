import { Gauge, LayoutPanelTop, ShieldCheck, Smartphone } from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionHeading } from "@/app/components/ui/section-heading";

const reasons = [
  {
    title: "Clear growth path",
    description: "Start simple and expand the depth of controls and reporting as your team matures.",
    icon: Gauge,
  },
  {
    title: "Strong UI consistency",
    description: "Every plan keeps the same polished product language and a cleaner information hierarchy.",
    icon: LayoutPanelTop,
  },
  {
    title: "Responsive by default",
    description: "Pricing tables, comparisons, and FAQ interactions remain comfortable on smaller screens.",
    icon: Smartphone,
  },
  {
    title: "Enterprise-ready controls",
    description: "When the team grows, the system can grow into stricter workflows without visual chaos.",
    icon: ShieldCheck,
  },
];

export default function WhyChoosePricing() {
  return (
    <section className="space-y-8">
      <Reveal>
        <SectionHeading
          eyebrow="Why Choose Our Pricing"
          align="center"
          title={
            <>
              Pricing that supports a better
              <span className="block text-accent-foreground">product experience from the beginning.</span>
            </>
          }
          description="The plans are structured to feel understandable and credible, not overloaded with tiny caveats or awkward comparison logic."
        />
      </Reveal>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {reasons.map((item, index) => {
          const Icon = item.icon;

          return (
            <Reveal key={item.title} delay={0.05 * index} variant="up">
              <Card variant={index === 1 ? "accent" : "surface"} padding="lg" className="h-full">
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
