import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, CircleCheckBig, Sparkles, UsersRound } from "lucide-react";

import { Badge } from "@/app/components/ui/badge";
import { buttonVariants } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Reveal } from "@/app/components/ui/reveal";

const stats = [
  { label: "Teams supported", value: "120+", note: "Across operations, finance, and leadership" },
  { label: "Average approval time", value: "6.4h", note: "Quicker decisions without process fatigue" },
  { label: "Retention uplift", value: "24%", note: "More trust in the workflow and reporting layer" },
];

export default function AboutHero() {
  return (
    <section className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr] xl:items-center">
      <Reveal className="space-y-8" variant="left">
        <Badge>
          <Sparkles className="h-4 w-4 text-accent-foreground" />
          About FinOps Suite
        </Badge>

        <div className="space-y-5">
          <h1 className="max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
            We design finance software
            <span className="block text-accent-foreground">that people actually enjoy using.</span>
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-foreground/72 sm:text-xl">
            FinOps Suite was created to make financial operations feel less rigid and more human, while still staying
            sharp enough for serious planning, approvals, and executive reporting.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/pricing" className={buttonVariants({ size: "lg" })}>
            View Pricing
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/blog" className={buttonVariants({ variant: "secondary", size: "lg" })}>
            Read Our Thinking
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((item, index) => (
            <Reveal key={item.label} delay={0.06 * index} variant="scale">
              <Card variant="ghost" padding="md" className="h-full">
                <CardContent>
                  <p className="text-sm text-foreground/54">{item.label}</p>
                  <p className="text-3xl font-semibold tracking-[-0.04em] text-foreground">{item.value}</p>
                  <p className="text-sm leading-6 text-foreground/68">{item.note}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal variant="scale" delay={0.08}>
        <Card variant="surface" padding="xl" className="relative overflow-hidden">
          <div className="absolute -right-10 top-0 h-44 w-44 rounded-full bg-primary/30 blur-3xl" />
          <div className="relative space-y-5">
            <div className="relative overflow-hidden rounded-[1.9rem] border border-white/60 bg-white/45 p-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
                <Image
                  src="/illustrations/about-studio.svg"
                  alt="FinOps Suite team collaboration illustration"
                  fill
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover"
                />
              </div>

              <div className="absolute left-7 top-7">
                <Badge variant="outline" className="bg-background/85">
                  <UsersRound className="h-4 w-4 text-accent-foreground" />
                  Product + finance + ops
                </Badge>
              </div>

              <div className="absolute bottom-7 right-7">
                <Card variant="frosted" padding="md" className="max-w-xs border-white/65 shadow-[0_20px_50px_rgba(33,49,43,0.08)]">
                  <CardContent>
                    <p className="text-sm text-foreground/56">Built for alignment</p>
                    <p className="text-2xl font-semibold tracking-[-0.04em] text-foreground">One clearer source of truth</p>
                    <p className="text-sm leading-6 text-foreground/66">
                      Make planning, approvals, and communication feel connected instead of fragmented.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card variant="accent" padding="lg">
                <CardContent>
                  <div className="flex items-start gap-3">
                    <div className="primary-wash flex h-11 w-11 items-center justify-center rounded-2xl">
                      <Building2 className="h-5 w-5 text-foreground" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-semibold text-foreground">Designed for modern teams</p>
                      <p className="text-sm leading-6 text-foreground/68">
                        From smaller startups to scaling companies with multiple decision-makers.
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
                      <p className="text-xl font-semibold text-background">Calm, credible, and scalable</p>
                      <p className="text-sm leading-6 text-background/78">
                        A softer visual system paired with professional data presentation and strong structure.
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
