import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Badge } from "@/app/components/ui/badge";
import { buttonVariants } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Reveal } from "@/app/components/ui/reveal";

const closingPoints = [
  "Shared finance workflows with calmer approvals",
  "Responsive motion and hierarchy across every device",
  "Reusable UI components for faster product expansion",
];

export default function Ctasection() {
  return (
    <Reveal id="cta" variant="scale">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-foreground/90 bg-foreground px-6 py-8 text-background shadow-[0_30px_90px_rgba(33,49,43,0.18)] md:px-8 md:py-10 lg:px-10">
        <div className="absolute -right-10 top-0 h-44 w-44 rounded-full bg-primary/18 blur-3xl" />
        <div className="absolute -left-8 bottom-0 h-36 w-36 rounded-full bg-accent/18 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-5">
            <Badge variant="contrast" className="w-fit">
              Ready to launch
            </Badge>
            <div className="space-y-4">
              <h2 className="text-4xl font-semibold leading-[0.96] tracking-[-0.04em] text-background sm:text-5xl lg:text-6xl">
                Turn this landing experience into a product your users immediately trust.
              </h2>
              <p className="max-w-2xl text-base leading-8 text-background/76 sm:text-lg">
                The homepage is now organized into reusable sections and UI primitives, making it much easier to expand
                into a full production interface without losing quality or consistency.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/pricing" className={buttonVariants({ variant: "light", size: "lg" })}>
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/about" className={buttonVariants({ variant: "secondary", size: "lg" })}>
                Learn More
              </Link>
            </div>
          </div>

          <Card variant="ghost" padding="xl" className="border-white/12 bg-white/8">
            <div className="grid gap-4">
              {closingPoints.map((point, index) => (
                <Reveal key={point} delay={0.06 * index} variant="up">
                  <div className="flex items-start gap-3 rounded-[1.4rem] border border-white/10 bg-white/7 px-4 py-4">
                    <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                    <p className="text-sm leading-7 text-background/80">{point}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </Reveal>
  );
}
