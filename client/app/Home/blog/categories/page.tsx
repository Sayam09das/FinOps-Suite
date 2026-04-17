import MarketingPageTemplate from "@/app/components/common/MarketingPageTemplate";

export default function BlogCategoriesPage() {
  return (
    <MarketingPageTemplate
      eyebrow="Blog Categories"
      title="Organize content around the way finance teams actually work."
      description="Structured categories make the blog easier to explore on small screens, faster to skim on desktop, and much more credible as the product grows."
      stats={[
        { label: "Planning", value: "14" },
        { label: "Analytics", value: "09" },
        { label: "Workflows", value: "11" },
      ]}
      cards={[
        {
          title: "Planning",
          description: "Posts about budgeting frameworks, forecast reviews, and tracking operational health.",
        },
        {
          title: "Analytics",
          description: "Insights on dashboards, variance detection, and how to present numbers with more clarity.",
        },
        {
          title: "Workflows",
          description: "Guides for approvals, team coordination, and building more reliable finance rituals.",
        },
      ]}
      asideTitle="Better information architecture"
      asideDescription="A professional navbar only feels complete when the routes behind it are structured well too. These category pages keep discovery intentional across all devices."
      primaryAction={{ label: "Read All Posts", href: "/blog" }}
      secondaryAction={{ label: "Back Home", href: "/" }}
    />
  );
}
