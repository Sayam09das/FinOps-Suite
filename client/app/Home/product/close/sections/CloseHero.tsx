import Link from "next/link";
import { ArrowRight, Sparkles, Clock, ShieldCheck } from "lucide-react";

import { Badge } from "@/app/components/ui/badge";
import { buttonVariants } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Reveal } from "@/app/components/ui/reveal";

const benefits = [
  { title: "Faster close cycles", description: "Reduce manual handoffs with a consistent close playbook." },
  { title: "Audit-ready", description: "Retain an organized closing trail for every period." },
  { title: "Stronger alignment", description: "Keep finance, ops, and leadership on the same page." },
];

export default function CloseHero() {
  return (
    <section className="grid gap-10 lg:grid-cols-[1fr_0.95fr] xl:items-center">
      <Reveal className="space-y-8" variant="left">
        <Badge>
          <Sparkles className="h-4 w-4 text-accent-foreground" />
          Close management
        </Badge>
        <div className="space-y-5">
          <h1 className="max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
            Close your books with the structure and speed modern teams demand.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-foreground/72 sm:text-xl">
            Build a repeatable close workflow with clear status, approvals, and reporting so every period ends with confidence.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/pricing" className={buttonVariants({ size: "lg" })}>
            Start closing
          </Link>
          <Link href="/product/close#workflow" className={buttonVariants({ variant: "secondary", size: "lg" })}>
            See process
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {benefits.map((item, index) => (
            <Reveal key={item.title} delay={0.05 * index} variant="scale">
              <Card variant="ghost" padding="md" className="h-full">
                <CardContent>
                  <p className="text-sm text-foreground/56">{item.title}</p>
                  <p className="mt-3 text-lg font-semibold text-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal variant="scale" delay={0.08}>
        <Card variant="surface" padding="xl" className="overflow-hidden">
          <div className="rounded-[2rem] border border-white/60 bg-white/50 p-8 shadow-sm backdrop-blur-sm">
            <div className="inline-flex items-center gap-3 rounded-2xl bg-emerald-100 px-4 py-3 text-emerald-700">
              <Clock className="h-5 w-5" />
              <p className="text-sm font-semibold uppercase tracking-[0.25em]">Close momentum</p>
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">Keep every close lean and repeatable</h2>
              <p className="text-sm leading-6 text-foreground/72">
                A clear process, automated checklists, and collaboration tools make period close less stressful and more reliable.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-foreground/5 p-5">
                <div className="flex items-center gap-2 text-emerald-700">
                  <ShieldCheck className="h-5 w-5" />
                  <p className="text-sm font-semibold uppercase tracking-[0.25em]">Compliance first</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-foreground/72">Trusted controls and documentation for every close.</p>
              </div>
              <div className="rounded-3xl bg-foreground/5 p-5">
                <div className="flex items-center gap-2 text-slate-900">
                  <Sparkles className="h-5 w-5" />
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-900">Better handoffs</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-foreground/72">Faster collaboration between accounting and finance leaders.</p>
              </div>
            </div>
          </div>
        </Card>
      </Reveal>
    </section>
  );
}
