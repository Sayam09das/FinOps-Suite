import MarketingPageTemplate from "@/app/components/common/MarketingPageTemplate";

export default function AboutPage() {
  return (
    <MarketingPageTemplate
      eyebrow="About"
      title="The finance workspace designed to feel clear, not cluttered."
      description="FinOps Suite helps teams plan, review, and act with more confidence by making dense financial work easier to scan, easier to discuss, and easier to trust."
      stats={[
        { label: "Teams supported", value: "120+" },
        { label: "Approval time", value: "6.4h" },
        { label: "Variance clarity", value: "91%" },
      ]}
      cards={[
        {
          title: "Clarity first",
          description: "We design interfaces that help finance and operations make the next decision quickly without losing context.",
        },
        {
          title: "Shared visibility",
          description: "Leaders, budget owners, and operators can work from the same source of truth without extra handoffs.",
        },
        {
          title: "Calmer workflows",
          description: "The product reduces friction with structured navigation, gentle alerting, and focused reporting surfaces.",
        },
      ]}
      asideTitle="Professional by default"
      asideDescription="From typography to spacing to navigation patterns, every part of the UI is tuned to feel production-ready across laptop, tablet, and mobile sizes."
      primaryAction={{ label: "See Pricing", href: "/pricing" }}
      secondaryAction={{ label: "Read the Blog", href: "/blog" }}
    />
  );
}
