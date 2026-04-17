import { ArrowRight, BriefcaseBusiness, Building2, HandCoins, ShieldCheck } from "lucide-react";

import { Badge } from "@/app/components/ui/badge";
import { buttonVariants } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionHeading } from "@/app/components/ui/section-heading";

const roleCards = [
  {
    title: "Finance leads",
    description: "Review forecast movement, cash position, and approval risk from one clearer command layer.",
    icon: HandCoins,
  },
  {
    title: "Operations teams",
    description: "Keep spend decisions moving with cleaner handoffs and much less reporting duplication.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Leadership",
    description: "Get executive-ready summaries that still connect back to live operational details.",
    icon: Building2,
  },
];

export default function Empowersection() {
  return (
    <section className="space-y-8">
      <Reveal>
        <SectionHeading
          eyebrow="Empower Teams"
          title={
            <>
              Empower every stakeholder with a UI that
              <span className="block text-accent-foreground">explains the work instead of hiding it.</span>
            </>
          }
          description="Great financial tooling supports different roles without making the product feel generic. This section gives each audience a clearer place in the experience while keeping the overall system cohesive."
        />
      </Reveal>

      <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <Reveal variant="left">
          <Card variant="contrast" padding="xl" className="h-full">
            <CardHeader className="space-y-4">
              <Badge variant="contrast" className="w-fit">
                Shared context
              </Badge>
              <CardTitle className="text-background">
                One calmer system for finance, ops,
                <span className="block text-primary">and leadership to move together.</span>
              </CardTitle>
              <CardDescription className="max-w-xl text-background/76">
                The design language stays warm and accessible while still feeling precise enough for serious reporting,
                approvals, and team-wide operational decisions.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {[
                "Reusable UI building blocks speed up future pages.",
                "Responsive motion keeps the product feeling intentional on mobile.",
                "Information hierarchy stays strong even as data density grows.",
                "Soft contrast and accent usage make the interface feel more trustworthy.",
              ].map((item, index) => (
                <Reveal key={item} delay={0.06 * index} variant="up">
                  <div className="rounded-[1.4rem] border border-white/12 bg-white/8 p-4">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="mt-1 h-5 w-5 text-primary" />
                      <p className="text-sm leading-7 text-background/80">{item}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </CardContent>
          </Card>
        </Reveal>

        <div className="grid gap-4">
          {roleCards.map((item, index) => {
            const Icon = item.icon;

            return (
              <Reveal key={item.title} delay={0.06 * index} variant="right">
                <Card variant={index === 1 ? "accent" : "surface"} padding="lg" className="h-full">
                  <CardHeader className="flex flex-row items-start gap-4">
                    <div className="primary-wash flex h-12 w-12 items-center justify-center rounded-2xl">
                      <Icon className="h-5 w-5 text-foreground" />
                    </div>
                    <div className="space-y-2">
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </Reveal>
            );
          })}

          <Reveal delay={0.2}>
            <a href="#cta" className={buttonVariants({ variant: "secondary", size: "lg" })}>
              See the next step
              <ArrowRight className="h-4 w-4" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
