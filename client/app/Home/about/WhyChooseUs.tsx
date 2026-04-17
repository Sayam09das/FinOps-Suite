import { ArrowUpRight, CheckCircle2, LayoutPanelTop, MonitorSmartphone, Shapes } from "lucide-react";

import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import { Reveal } from "@/app/components/ui/reveal";

const reasons = [
  "Professional visual hierarchy that scales with complexity",
  "Responsive layouts that stay structured across devices",
  "Softer branding without losing credibility or precision",
  "Reusable UI components that speed up future product work",
];

const highlights = [
  { title: "Startup-ready design", detail: "Looks ambitious and premium from day one.", icon: Shapes },
  { title: "Product-grade responsiveness", detail: "Layouts adapt cleanly from wide desktop to compact mobile.", icon: MonitorSmartphone },
  { title: "Clear information systems", detail: "Better cards, sections, and content rhythm throughout the site.", icon: LayoutPanelTop },
];

export default function WhyChooseUs() {
  return (
    <section className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
      <Reveal variant="left">
        <Card variant="contrast" padding="xl" className="h-full">
          <div className="space-y-6">
            <Badge variant="contrast" className="w-fit">
              Why teams choose us
            </Badge>
            <div className="space-y-4">
              <h2 className="text-4xl font-semibold leading-[0.96] tracking-[-0.04em] text-background sm:text-5xl">
                We combine startup polish with
                <span className="block text-primary">operational seriousness.</span>
              </h2>
              <p className="max-w-xl text-base leading-8 text-background/76">
                The goal is not just to make the interface look modern. It is to make the product feel trustworthy,
                easier to navigate, and ready for the kind of work finance teams do every day.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {reasons.map((reason, index) => (
                <Reveal key={reason} delay={0.05 * index} variant="up">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                      <p className="text-sm leading-7 text-background/80">{reason}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Card>
      </Reveal>

      <div className="grid gap-4">
        {highlights.map((item, index) => {
          const Icon = item.icon;

          return (
            <Reveal key={item.title} delay={0.06 * index} variant="right">
              <Card variant={index === 1 ? "accent" : "surface"} padding="lg" className="h-full">
                <CardContent>
                  <div className="flex items-start gap-4">
                    <div className="primary-wash flex h-12 w-12 items-center justify-center rounded-2xl">
                      <Icon className="h-5 w-5 text-foreground" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <p className="text-xl font-semibold text-foreground">{item.title}</p>
                        <ArrowUpRight className="h-4 w-4 text-accent-foreground" />
                      </div>
                      <p className="text-sm leading-7 text-foreground/68">{item.detail}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
