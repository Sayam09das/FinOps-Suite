import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Badge } from "@/app/components/ui/badge";
import { buttonVariants } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Reveal } from "@/app/components/ui/reveal";

const highlights = [
  "Clean pricing structure with stronger information design",
  "Responsive feature comparison and FAQ sections",
  "A more premium startup-style visual direction throughout",
];

export default function PricingCTA() {
  return (
    <Reveal variant="scale">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-foreground/90 bg-foreground px-6 py-8 text-background shadow-[0_30px_90px_rgba(33,49,43,0.18)] md:px-8 md:py-10 lg:px-10">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/18 blur-3xl" />
        <div className="absolute left-0 bottom-0 h-36 w-36 rounded-full bg-accent/16 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div className="space-y-5">
            <Badge variant="contrast" className="w-fit">
              Ready when you are
            </Badge>
            <div className="space-y-4">
              <h2 className="text-4xl font-semibold leading-[0.96] tracking-[-0.04em] text-background sm:text-5xl">
                Choose the plan that fits now,
                <span className="block text-primary">and grow into the next stage later.</span>
              </h2>
              <p className="max-w-2xl text-base leading-8 text-background/76 sm:text-lg">
                The pricing system is built to feel as polished and credible as the rest of the product, so the user
                journey stays consistent from marketing to actual product experience.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/" className={buttonVariants({ variant: "light", size: "lg" })}>
                Start with Home
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/about" className={buttonVariants({ variant: "secondary", size: "lg" })}>
                Meet the team
              </Link>
            </div>
          </div>

          <Card variant="ghost" padding="xl" className="border-white/12 bg-white/8">
            <div className="grid gap-4">
              {highlights.map((item, index) => (
                <Reveal key={item} delay={0.05 * index} variant="up">
                  <div className="flex items-start gap-3 rounded-[1.4rem] border border-white/10 bg-white/7 px-4 py-4">
                    <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                    <p className="text-sm leading-7 text-background/80">{item}</p>
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
