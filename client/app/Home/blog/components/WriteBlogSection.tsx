import Link from "next/link";
import { ArrowRight, Feather, NotebookTabs, Users } from "lucide-react";

import { Badge } from "@/app/components/ui/badge";
import { buttonVariants } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Reveal } from "@/app/components/ui/reveal";

const benefits = [
  { icon: Feather, text: "Write product updates, operational insights, and editorial pieces from one system." },
  { icon: NotebookTabs, text: "Turn the blog into a real publishing surface that still matches the product design language." },
  { icon: Users, text: "Support founders, operators, and marketing with a cleaner editorial workflow." },
];

export default function WriteBlogSection() {
  return (
    <Reveal variant="scale">
      <section className="relative overflow-hidden rounded-[2.4rem] border border-foreground/90 bg-foreground px-6 py-8 text-background shadow-[0_30px_90px_rgba(33,49,43,0.18)] md:px-8 md:py-10">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/18 blur-3xl" />
        <div className="absolute left-0 bottom-0 h-36 w-36 rounded-full bg-accent/14 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
          <div className="space-y-5">
            <Badge variant="contrast" className="w-fit">
              Write with style
            </Badge>
            <div className="space-y-4">
              <h2 className="text-4xl font-semibold leading-[0.96] tracking-[-0.04em] text-background sm:text-5xl">
                Turn your blog into an editorial surface
                <span className="block text-primary">that feels as premium as the product.</span>
              </h2>
              <p className="max-w-2xl text-base leading-8 text-background/76 sm:text-lg">
                The page now supports a stronger startup-style content experience with better cards, filters, motion,
                and responsive structure. It is ready to expand into a real editorial system next.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/blog/create" className={buttonVariants({ variant: "light", size: "lg" })}>
                Write blog
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/pricing" className={buttonVariants({ variant: "secondary", size: "lg" })}>
                Explore pricing
              </Link>
            </div>
          </div>

          <Card variant="ghost" padding="xl" className="border-white/12 bg-white/8">
            <div className="grid gap-4">
              {benefits.map((item, index) => {
                const Icon = item.icon;

                return (
                  <Reveal key={item.text} delay={0.05 * index} variant="up">
                    <div className="flex items-start gap-3 rounded-[1.4rem] border border-white/10 bg-white/7 px-4 py-4">
                      <Icon className="mt-1 h-5 w-5 text-primary" />
                      <p className="text-sm leading-7 text-background/80">{item.text}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </Card>
        </div>
      </section>
    </Reveal>
  );
}
