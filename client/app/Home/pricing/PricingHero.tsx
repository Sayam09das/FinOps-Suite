import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CircleCheckBig, Layers3, ShieldCheck, Sparkles } from "lucide-react";

import { Badge } from "@/app/components/ui/badge";
import { buttonVariants } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Reveal } from "@/app/components/ui/reveal";

const pricingStats = [
  { label: "Starter", value: "$29/mo" },
  { label: "Growth", value: "$99/mo" },
  { label: "Enterprise", value: "Custom" },
];

export default function PricingHero() {
  return (
    <section className="grid gap-8 xl:grid-cols-[1fr_1fr] xl:items-center">
      <Reveal className="space-y-8" variant="left">
        <Badge>
          <Sparkles className="h-4 w-4 text-accent-foreground" />
          Pricing for growing teams
        </Badge>

        <div className="space-y-5">
          <h1 className="max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
            Flexible plans for teams that want
            <span className="block text-accent-foreground">stronger financial operations.</span>
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-foreground/72 sm:text-xl">
            Start lean, grow into deeper analytics, and scale toward more advanced controls without losing the clean
            product experience across desktop and mobile.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="#plans" className={buttonVariants({ size: "lg" })}>
            See Plans
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/about" className={buttonVariants({ variant: "secondary", size: "lg" })}>
            Why we built this
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {pricingStats.map((item, index) => (
            <Reveal key={item.label} delay={0.06 * index} variant="scale">
              <Card variant="ghost" padding="md" className="h-full">
                <CardContent>
                  <p className="text-sm text-foreground/56">{item.label}</p>
                  <p className="text-3xl font-semibold tracking-[-0.04em] text-foreground">{item.value}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal variant="scale" delay={0.08}>
        <Card variant="surface" padding="xl" className="overflow-hidden">
          <div className="grid gap-5">
            <div className="relative overflow-hidden rounded-[1.9rem] border border-white/60 bg-white/45 p-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
                <Image
                  src="/illustrations/pricing-hero.svg"
                  alt="Pricing plans and analytics illustration"
                  fill
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover"
                />
              </div>

              <div className="absolute left-7 top-7">
                <Badge variant="outline" className="bg-background/82">
                  <Layers3 className="h-4 w-4 text-accent-foreground" />
                  Transparent pricing tiers
                </Badge>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card variant="accent" padding="lg">
                <CardContent>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-1 h-5 w-5 text-accent-foreground" />
                    <div className="space-y-2">
                      <p className="text-xl font-semibold text-foreground">No messy upgrade path</p>
                      <p className="text-sm leading-6 text-foreground/68">
                        The structure stays consistent as your team needs more control and reporting depth.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card variant="contrast" padding="lg" className="border-white/10">
                <CardContent>
                  <div className="flex items-start gap-3">
                    <CircleCheckBig className="mt-1 h-5 w-5 text-primary" />
                    <div className="space-y-2">
                      <p className="text-xl font-semibold text-background">Great on every device</p>
                      <p className="text-sm leading-6 text-background/78">
                        Pricing, comparisons, and FAQs remain clean and readable on tablet and mobile screens too.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Card>
      </Reveal>
    </section>
  );
}
