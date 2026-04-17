import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionHeading } from "@/app/components/ui/section-heading";

const integrations = [
  { name: "Bank feeds", tag: "Live sync", description: "Pull account activity into the same review flow." },
  { name: "ERP systems", tag: "Structured", description: "Keep budgets and actuals aligned without messy exports." },
  { name: "Slack alerts", tag: "Fast follow-up", description: "Push approvals and variance updates to the right team." },
  { name: "Payroll", tag: "Scheduled", description: "Review compensation-related flows with less operational churn." },
  { name: "Procurement", tag: "Connected", description: "Tie vendor requests to policy and payment context." },
  { name: "Analytics", tag: "Executive ready", description: "Share cleaner reporting across leadership surfaces." },
];

const automationSteps = ["Source systems", "Validation layer", "Approval routing", "Live dashboard"];

export default function Integratesection() {
  return (
    <section className="space-y-8">
      <Reveal>
        <SectionHeading
          eyebrow="Integrations"
          align="center"
          title={
            <>
              Connect the tools your team already uses,
              <span className="block text-accent-foreground">without making the experience fragmented.</span>
            </>
          }
          description="The integration layer is presented as part of the product story, not an afterthought, so operations, planning, and reporting still feel cohesive across mobile and desktop."
        />
      </Reveal>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Reveal variant="left">
          <Card variant="surface" padding="xl" className="h-full">
            <CardHeader className="space-y-4">
              <Badge variant="accent" className="w-fit">
                Integrated workflow
              </Badge>
              <CardTitle>
                Automation should feel deliberate,
                <span className="block text-accent-foreground">not stitched together.</span>
              </CardTitle>
              <CardDescription>
                This layout shows how data moves from source systems into approvals and reporting with a calmer visual
                rhythm that still feels modern and professional.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-2">
              <div className="grid gap-3">
                {automationSteps.map((step, index) => (
                  <Reveal key={step} delay={0.08 * index} variant="right">
                    <div className="flex items-center gap-4 rounded-[1.5rem] border border-border/75 bg-white/42 px-4 py-4">
                      <div className="number-pill">0{index + 1}</div>
                      <div className="space-y-1">
                        <p className="text-lg font-semibold text-foreground">{step}</p>
                        <p className="text-sm leading-6 text-foreground/66">
                          Structured motion and spacing help this flow stay readable on smaller screens too.
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </CardContent>
          </Card>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {integrations.map((integration, index) => (
            <Reveal key={integration.name} delay={0.04 * index} variant="up">
              <Card variant={index % 3 === 1 ? "accent" : "ghost"} padding="lg" className="h-full">
                <CardContent>
                  <div className="flex items-center justify-between gap-3">
                    <div className="primary-wash flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-semibold text-foreground">
                      {integration.name.slice(0, 2).toUpperCase()}
                    </div>
                    <Badge variant="outline">{integration.tag}</Badge>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xl font-semibold tracking-[-0.03em] text-foreground">{integration.name}</p>
                    <p className="text-sm leading-7 text-foreground/68">{integration.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
