import MarketingPageTemplate from "@/app/components/common/MarketingPageTemplate";

export default function PricingPage() {
  return (
    <MarketingPageTemplate
      eyebrow="Pricing"
      title="Simple pricing for teams that need stronger financial operations."
      description="Choose a plan that matches your reporting depth, collaboration flow, and approval complexity, while keeping the same polished product experience across every device."
      stats={[
        { label: "Starter", value: "$29/mo" },
        { label: "Growth", value: "$99/mo" },
        { label: "Enterprise", value: "Custom" },
      ]}
      cards={[
        {
          title: "Starter",
          description: "Essential budgeting, lightweight dashboards, and clean review flows for smaller operating teams.",
        },
        {
          title: "Growth",
          description: "Advanced analytics, collaborative approvals, and shared workspaces for scaling finance operations.",
        },
        {
          title: "Enterprise",
          description: "Deeper controls, custom workflows, and executive-ready reporting for multi-team environments.",
        },
      ]}
      asideTitle="Built to scale without visual clutter"
      asideDescription="The same navigation system and information hierarchy can support light workflows and dense reporting without turning the product into a maze."
      primaryAction={{ label: "Get Started", href: "/" }}
      secondaryAction={{ label: "Meet the Team", href: "/about" }}
    />
  );
}
