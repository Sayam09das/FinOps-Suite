import Link from "next/link";
import { ArrowRight, BellRing, CheckCircle2, CreditCard, Sparkles } from "lucide-react";

import { Badge } from "@/app/components/ui/badge";
import { buttonVariants } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Reveal } from "@/app/components/ui/reveal";

const heroStats = [
  { label: "Managed spend", value: "$4.8M", note: "Across budgets, vendors, and renewals" },
  { label: "Forecast accuracy", value: "98.2%", note: "Live data feeds keep planning grounded" },
  { label: "Approval cycles", value: "-31%", note: "Fewer follow-ups between ops and finance" },
];

const pulseCards = [
  { label: "Burn rate", value: "$128k/mo", trend: "Stable" },
  { label: "At-risk renewals", value: "03", trend: "Review" },
  { label: "Approval SLA", value: "6.4h", trend: "Improving" },
];

const trustedTeams = ["Northstar Capital", "Atlas Works", "Monetra Labs", "Flowstate Ops"];

export default function TrustSection() {
  return (
    <section className="space-y-6 md:space-y-8">
      <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr] xl:items-center">
        <Reveal className="space-y-8" variant="left">
          <Badge>
            <BellRing className="h-4 w-4 text-accent-foreground" />
            Trusted operations for faster-moving finance teams
          </Badge>

          <div className="space-y-5">
            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
              Financial operations that feel calm,
              <span className="block text-accent-foreground">clear, and genuinely production-ready.</span>
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-foreground/72 sm:text-xl">
              Move approvals, budgets, and spend reviews through one polished workspace with a softer visual system,
              stronger hierarchy, and responsive interactions that work beautifully on every device.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/pricing" className={buttonVariants({ size: "lg" })}>
              Start Planning
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#dashboard" className={buttonVariants({ size: "lg", variant: "secondary" })}>
              Explore the dashboard
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {heroStats.map((item, index) => (
              <Reveal key={item.label} delay={0.08 * index} variant="scale">
                <Card variant="ghost" padding="md" className="h-full">
                  <CardContent>
                    <p className="text-sm text-foreground/56">{item.label}</p>
                    <p className="text-3xl font-semibold tracking-[-0.04em] text-foreground">{item.value}</p>
                    <p className="text-sm leading-6 text-foreground/68">{item.note}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </Reveal>

        <Reveal id="overview" variant="scale" delay={0.08}>
          <Card
            variant="surface"
            padding="xl"
            className="relative overflow-hidden bg-[linear-gradient(160deg,rgba(229,238,228,0.92),rgba(246,244,232,0.94),rgba(192,225,210,0.65))]"
          >
            <div className="absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_top,rgba(220,155,155,0.34),transparent_68%)]" />
            <div className="relative space-y-5">
              <Card variant="frosted" padding="lg">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground/55">Executive finance pulse</p>
                    <p className="text-3xl font-semibold tracking-[-0.05em] text-foreground">$1.26M allocated</p>
                    <p className="text-sm leading-6 text-foreground/65">Live planning, approvals, and spend movement in one view.</p>
                  </div>
                  <div className="primary-wash rounded-2xl p-3">
                    <CreditCard className="h-5 w-5 text-foreground" />
                  </div>
                </CardHeader>
              </Card>

              <div className="grid gap-4 md:grid-cols-3">
                {pulseCards.map((card, index) => (
                  <Reveal key={card.label} delay={0.1 + index * 0.06} variant="up">
                    <Card variant="ghost" padding="md" className="backdrop-card h-full border-white/55 bg-background/78 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                      <CardContent>
                        <p className="text-sm text-foreground/55">{card.label}</p>
                        <p className="text-2xl font-semibold tracking-[-0.04em] text-foreground">{card.value}</p>
                        <p className="text-sm text-accent-foreground">{card.trend}</p>
                      </CardContent>
                    </Card>
                  </Reveal>
                ))}
              </div>

              <div className="grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
                <Card variant="contrast" padding="lg" className="border-white/55">
                  <CardContent>
                    <p className="text-sm text-background/65">Approval status</p>
                    <p className="text-4xl font-semibold tracking-[-0.05em] text-background">84%</p>
                    <p className="text-sm leading-6 text-background/78">
                      Most approvals now close inside the same business day with fewer manual chases.
                    </p>
                  </CardContent>
                </Card>

                <Card variant="accent" padding="lg" className="border-white/55">
                  <CardContent>
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-2">
                        <p className="text-sm text-foreground/55">Flagged variance</p>
                        <p className="text-2xl font-semibold tracking-[-0.04em] text-foreground">Travel and tools</p>
                      </div>
                      <Badge variant="outline" className="bg-background/80 text-accent-foreground">
                        attention
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 rounded-full bg-background/75">
                        <div className="h-3 w-[72%] rounded-full bg-accent" />
                      </div>
                      <p className="text-sm leading-6 text-foreground/72">
                        Gentle alert states keep issues visible without turning the interface harsh or noisy.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Card>
        </Reveal>
      </div>

      <Reveal delay={0.15}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {trustedTeams.map((team, index) => (
            <Reveal key={team} delay={0.05 * index} variant="up">
              <Card variant="ghost" padding="md" className="h-full">
                <CardContent className="gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="primary-wash flex h-10 w-10 items-center justify-center rounded-2xl">
                      <Sparkles className="h-4 w-4 text-foreground" />
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-foreground/52">Trusted by</p>
                    <p className="text-base font-semibold text-foreground">{team}</p>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
