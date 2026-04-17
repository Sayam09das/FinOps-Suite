import { Check, Minus } from "lucide-react";

import { Card, CardContent } from "@/app/components/ui/card";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionHeading } from "@/app/components/ui/section-heading";

const comparisonRows = [
  { feature: "Budget planning", starter: true, growth: true, enterprise: true },
  { feature: "Advanced analytics", starter: false, growth: true, enterprise: true },
  { feature: "Approval automation", starter: true, growth: true, enterprise: true },
  { feature: "Custom policy logic", starter: false, growth: false, enterprise: true },
  { feature: "Shared workspaces", starter: false, growth: true, enterprise: true },
  { feature: "Dedicated onboarding", starter: false, growth: false, enterprise: true },
];

const columns = [
  { key: "starter", label: "Starter" },
  { key: "growth", label: "Growth" },
  { key: "enterprise", label: "Enterprise" },
] as const;

function CellIcon({ active }: { active: boolean }) {
  return active ? <Check className="h-4 w-4 text-accent-foreground" /> : <Minus className="h-4 w-4 text-foreground/34" />;
}

export default function FeatureComparison() {
  return (
    <section className="space-y-8">
      <Reveal>
        <SectionHeading
          eyebrow="Feature Comparison"
          title={
            <>
              Compare what each plan includes,
              <span className="block text-accent-foreground">without hunting through tiny text.</span>
            </>
          }
          description="The comparison layout is optimized for readability on both large and small screens, so it stays useful instead of turning into a cramped pricing table."
        />
      </Reveal>

      <Reveal className="hidden xl:block" variant="scale">
        <Card variant="surface" padding="xl">
          <div className="grid grid-cols-[1.5fr_repeat(3,1fr)] gap-4">
            <div className="eyebrow text-foreground/52">Feature</div>
            {columns.map((column) => (
              <div key={column.key} className="eyebrow text-foreground/52">
                {column.label}
              </div>
            ))}

            {comparisonRows.map((row, index) => (
              <div key={row.feature} className="contents">
                <div className={`rounded-[1.4rem] px-5 py-4 ${index % 2 === 0 ? "bg-white/46" : "bg-surface/58"}`}>
                  <p className="text-sm font-medium text-foreground">{row.feature}</p>
                </div>
                {columns.map((column) => (
                  <div
                    key={column.key}
                    className={`flex items-center justify-center rounded-[1.4rem] px-5 py-4 ${
                      index % 2 === 0 ? "bg-white/46" : "bg-surface/58"
                    }`}
                  >
                    <CellIcon active={row[column.key]} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Card>
      </Reveal>

      <div className="grid gap-4 xl:hidden">
        {comparisonRows.map((row, index) => (
          <Reveal key={row.feature} delay={0.04 * index} variant="up">
            <Card variant="ghost" padding="lg">
              <CardContent>
                <p className="text-lg font-semibold text-foreground">{row.feature}</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {columns.map((column) => (
                    <div key={column.key} className="rounded-[1.3rem] border border-border/70 bg-white/42 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/44">{column.label}</p>
                      <div className="mt-3 flex items-center gap-2 text-sm font-medium text-foreground">
                        <CellIcon active={row[column.key]} />
                        {row[column.key] ? "Included" : "Not included"}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
