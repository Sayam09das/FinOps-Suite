import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Reveal } from "@/app/components/ui/reveal";

const benefits = [
  "Fewer manual adjustments",
  "Automated exception tracking",
  "Clearer stakeholder handoff",
];

export default function ReconciliationCTA() {
  return (
    <Reveal variant="scale">
      <Card className="overflow-hidden rounded-[2rem] border border-border/40 bg-emerald-950/5 p-6 sm:p-8">
        <CardContent className="grid gap-8 sm:grid-cols-[1.7fr_1fr] sm:items-center">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-700">Close with clarity</p>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
              Keep reconciliation fast, transparent, and easy to audit.
            </h2>
            <ul className="space-y-3 text-sm leading-6 text-foreground/72">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-700" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-start gap-4 sm:items-end">
            <Link href="/pricing" className={buttonVariants({ size: "lg" })}>
              Start Reconciliation
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/about" className={buttonVariants({ variant: "secondary", size: "lg" })}>
              Learn more
            </Link>
          </div>
        </CardContent>
      </Card>
    </Reveal>
  );
}
