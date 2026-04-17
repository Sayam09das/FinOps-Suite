import Link from "next/link";
import { ArrowRight, CheckCircle2, MoveRight, ShieldCheck } from "lucide-react";

import { Badge } from "@/app/components/ui/badge";
import { buttonVariants } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionHeading } from "@/app/components/ui/section-heading";

const paymentSteps = [
  {
    title: "Select vendors and recipients",
    description: "Group payroll, contractor, or vendor payouts without leaving the planning workspace.",
  },
  {
    title: "Review risk and controls",
    description: "Use soft emphasis, not noise, to confirm approvals, policy checks, and expected timing.",
  },
  {
    title: "Send with shared context",
    description: "Finance, operations, and leadership can see the same payment story from one cleaner surface.",
  },
];

const transferTargets = [
  { label: "Payroll batch", amount: "$34,200" },
  { label: "Vendors", amount: "$12,840" },
  { label: "Contractors", amount: "$7,460" },
];

export default function Sendmoneysection() {
  return (
    <section className="grid gap-8 lg:grid-cols-[0.94fr_1.06fr] lg:items-center">
      <Reveal className="space-y-8" variant="left">
        <SectionHeading
          eyebrow="Send Money"
          title={
            <>
              Payment flows that feel lighter,
              <span className="block text-accent-foreground">faster, and easier to trust.</span>
            </>
          }
          description="This section turns send-money tasks into a calmer workflow with clear steps, cleaner approvals, and a responsive layout that stays readable even when the details get dense."
        />

        <div className="grid gap-4">
          {paymentSteps.map((step, index) => (
            <Reveal key={step.title} delay={0.06 * index} variant="up">
              <Card variant={index === 1 ? "accent" : "surface"} padding="lg">
                <CardHeader className="flex flex-row items-start gap-4">
                  <div className="number-pill shrink-0">0{index + 1}</div>
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Reveal>
          ))}
        </div>

        <Link href="/pricing" className={buttonVariants({ variant: "accent", size: "lg" })}>
          See payment-ready plans
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Reveal>

      <Reveal variant="scale" delay={0.1}>
        <Card variant="frosted" padding="xl" className="relative overflow-hidden">
          <div className="absolute inset-x-10 top-0 h-24 rounded-full bg-primary/25 blur-3xl" />
          <div className="relative grid gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-2">
                <Badge variant="accent" className="w-fit">
                  <MoveRight className="h-4 w-4" />
                  Transfer composer
                </Badge>
                <p className="text-3xl font-semibold tracking-[-0.04em] text-foreground">$54,500 scheduled today</p>
              </div>
              <Badge variant="outline">
                <ShieldCheck className="h-4 w-4 text-accent-foreground" />
                Policy checks complete
              </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_0.95fr]">
              <Card variant="surface" padding="lg">
                <CardContent>
                  <div className="space-y-3">
                    {transferTargets.map((target, index) => (
                      <Reveal key={target.label} delay={0.08 * index} variant="right">
                        <div className="flex items-center justify-between rounded-[1.25rem] border border-border/70 bg-white/40 px-4 py-3">
                          <div className="space-y-1">
                            <p className="text-sm text-foreground/52">{target.label}</p>
                            <p className="text-lg font-semibold text-foreground">{target.amount}</p>
                          </div>
                          <CheckCircle2 className="h-4 w-4 text-accent-foreground" />
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4">
                <Card variant="ghost" padding="lg">
                  <CardContent>
                    <p className="text-sm text-foreground/56">Destination</p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-foreground">Bank transfer</p>
                    <p className="mt-3 text-sm leading-6 text-foreground/68">Route payments to payroll, suppliers, and partners with shared context.</p>
                  </CardContent>
                </Card>

                <Card variant="contrast" padding="lg" className="border-white/10">
                  <CardContent>
                    <p className="text-sm text-background/62">Final approval</p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-background">2 approvers remaining</p>
                    <p className="mt-3 text-sm leading-6 text-background/78">
                      Everyone sees the same details, so finance can move money without re-explaining the request.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Card>
      </Reveal>
    </section>
  );
}
