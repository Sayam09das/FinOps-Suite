import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenText, Sparkles, TrendingUp } from "lucide-react";

import { Badge } from "@/app/components/ui/badge";
import { buttonVariants } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Reveal } from "@/app/components/ui/reveal";

const stats = [
  { label: "Guides published", value: "48" },
  { label: "Categories", value: "12" },
  { label: "New this month", value: "06" },
];

export default function BlogHero() {
  return (
    <section className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr] xl:items-center">
      <Reveal className="space-y-8" variant="left">
        <Badge>
          <Sparkles className="h-4 w-4 text-accent-foreground" />
          Blog & insights
        </Badge>

        <div className="space-y-5">
          <h1 className="max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
            Ideas for building calmer,
            <span className="block text-accent-foreground">stronger financial operations.</span>
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-foreground/72 sm:text-xl">
            Explore product thinking, workflow strategy, reporting systems, and design decisions that help finance and
            operations teams move with more confidence.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/blog/create" className={buttonVariants({ size: "lg" })}>
            Write a blog
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/about" className={buttonVariants({ variant: "secondary", size: "lg" })}>
            Learn about the team
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((item, index) => (
            <Reveal key={item.label} delay={0.05 * index} variant="scale">
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
                  src="/illustrations/blog-editorial.svg"
                  alt="Editorial dashboard illustration"
                  fill
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover"
                />
              </div>

              <div className="absolute left-7 top-7 flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-background/82">
                  <BookOpenText className="h-4 w-4 text-accent-foreground" />
                  Editorial depth
                </Badge>
              </div>
            </div>

            <Card variant="accent" padding="lg">
              <CardContent>
                <div className="flex items-start gap-3">
                  <TrendingUp className="mt-1 h-5 w-5 text-accent-foreground" />
                  <div className="space-y-2">
                    <p className="text-xl font-semibold text-foreground">Built like part of the product</p>
                    <p className="text-sm leading-6 text-foreground/68">
                      The blog now shares the same visual system, motion style, and responsive structure as the core
                      site, so it feels intentional instead of bolted on.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Card>
      </Reveal>
    </section>
  );
}
