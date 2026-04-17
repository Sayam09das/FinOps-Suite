import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe2, PencilLine, Users } from "lucide-react";

import { Badge } from "@/app/components/ui/badge";
import { buttonVariants } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionHeading } from "@/app/components/ui/section-heading";

const team = [
  {
    name: "S. Das",
    role: "Product direction",
    bio: "Shapes the product around finance workflows, visual clarity, and a calmer user journey.",
  },
  {
    name: "Core design team",
    role: "Experience systems",
    bio: "Turns brand, layout, and interaction details into reusable components that scale.",
  },
  {
    name: "Engineering",
    role: "Responsive execution",
    bio: "Ships performant interfaces that feel polished across desktop, tablet, and mobile devices.",
  },
];

export default function TeamCreatorSection() {
  return (
    <section className="grid gap-8 xl:grid-cols-[0.94fr_1.06fr] xl:items-center">
      <Reveal variant="left">
        <div className="space-y-8">
          <SectionHeading
            eyebrow="Team & Creators"
            title={
              <>
                A product shaped by people who care about
                <span className="block text-accent-foreground">both aesthetics and operations.</span>
              </>
            }
            description="The site and product direction are built around one idea: strong visual systems should make complex work easier, not just prettier."
          />

          <div className="grid gap-4">
            {team.map((member, index) => (
              <Reveal key={member.name} delay={0.06 * index} variant="up">
                <Card variant={index === 0 ? "accent" : "ghost"} padding="lg">
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <div className="number-pill">{index + 1}</div>
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-xl font-semibold text-foreground">{member.name}</p>
                          <Badge variant="outline">{member.role}</Badge>
                        </div>
                        <p className="text-sm leading-7 text-foreground/68">{member.bio}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>

          <Link href="/blog/create" className={buttonVariants({ variant: "secondary", size: "lg" })}>
            Write with us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>

      <Reveal variant="scale" delay={0.08}>
        <Card variant="surface" padding="xl" className="overflow-hidden">
          <div className="grid gap-5">
            <div className="relative overflow-hidden rounded-[1.85rem] border border-white/60 bg-white/45 p-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
                <Image
                  src="/illustrations/team-founders.svg"
                  alt="Founding team illustration"
                  fill
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute left-7 top-7 flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-background/82">
                  <Users className="h-4 w-4 text-accent-foreground" />
                  Collaborative culture
                </Badge>
                <Badge variant="outline" className="bg-background/82">
                  <PencilLine className="h-4 w-4 text-accent-foreground" />
                  Product-led design
                </Badge>
              </div>
            </div>

            <Card variant="contrast" padding="lg" className="border-white/10">
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="primary-wash flex h-12 w-12 items-center justify-center rounded-2xl">
                    <Globe2 className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-semibold text-background">Built for a wider product journey</p>
                    <p className="text-sm leading-7 text-background/78">
                      The same section system and UI components now make it easier to expand About, Pricing, Blog, and
                      future product pages without losing brand quality.
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
