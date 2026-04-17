import Image from "next/image";
import { Compass, HeartHandshake, Lightbulb, Target } from "lucide-react";

import { Badge } from "@/app/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionHeading } from "@/app/components/ui/section-heading";

const principles = [
  {
    title: "Clarity over clutter",
    description: "Every screen should help the user understand what matters next without making the interface loud.",
    icon: Compass,
  },
  {
    title: "Trust through consistency",
    description: "The product uses repeatable patterns so teams can move confidently from overview to action.",
    icon: HeartHandshake,
  },
  {
    title: "Operational empathy",
    description: "We design for the real stress points in reporting, approvals, and coordination between teams.",
    icon: Lightbulb,
  },
];

export default function OurStoryMission() {
  return (
    <section className="grid gap-8 xl:grid-cols-[0.96fr_1.04fr] xl:items-start">
      <Reveal variant="left">
        <SectionHeading
          eyebrow="Our Story"
          title={
            <>
              We started with one idea:
              <span className="block text-accent-foreground">finance tools can feel better than this.</span>
            </>
          }
          description="Too many products ask finance teams to work inside interfaces that feel cold, cluttered, and disconnected. FinOps Suite takes the opposite route with warm presentation, stronger structure, and genuinely useful workflows."
        />
      </Reveal>

      <div className="grid gap-5">
        <Reveal variant="scale">
          <Card variant="surface" padding="xl">
            <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
              <div className="space-y-4">
                <Badge variant="accent" className="w-fit">
                  <Target className="h-4 w-4" />
                  Mission
                </Badge>
                <div className="space-y-4">
                  <h3 className="text-3xl font-semibold tracking-[-0.04em] text-foreground">
                    Help teams move from financial uncertainty to operational confidence.
                  </h3>
                  <p className="text-base leading-8 text-foreground/72">
                    We focus on the moments where finance, operations, and leadership need the same context at the same
                    time. That means clearer dashboards, cleaner approvals, and fewer frustrating handoffs.
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[1.8rem] border border-white/60 bg-white/50 p-3">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.4rem]">
                  <Image
                    src="/illustrations/team-founders.svg"
                    alt="Founders and team illustration"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </Card>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-3">
          {principles.map((item, index) => {
            const Icon = item.icon;

            return (
              <Reveal key={item.title} delay={0.06 * index} variant="up">
                <Card variant={index === 1 ? "accent" : "ghost"} padding="lg" className="h-full">
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
      </div>
    </section>
  );
}
