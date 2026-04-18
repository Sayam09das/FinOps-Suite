import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Reveal } from "@/app/components/ui/reveal";

export default function OverviewCTA() {
  return (
    <Reveal variant="scale">
      <Card className="overflow-hidden rounded-[2rem] border border-border/40 bg-emerald-950/5 p-6 sm:p-8">
        <CardContent className="grid gap-6 sm:grid-cols-[1.6fr_1fr] sm:items-center">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Ready to see the whole picture?</p>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
              Explore the product suite designed for finance teams that need clarity and control.
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-foreground/70">
              Every section is built to reduce manual work, increase alignment, and surface the insights you need faster.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <Link href="/pricing" className={buttonVariants({ size: "lg" })}>
              View plans
            </Link>
            <Link href="/contact" className={buttonVariants({ variant: "secondary", size: "lg" })}>
              Talk to sales
            </Link>
          </div>
        </CardContent>
      </Card>
    </Reveal>
  );
}
