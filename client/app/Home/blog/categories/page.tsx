import MarketingPageTemplate from "@/app/components/common/MarketingPageTemplate";

export default function BlogCategoriesPage() {
  return (
    <MarketingPageTemplate
      eyebrow="Blog Categories"
      title="Organize content around how finance and operations teams really work."
      description="Categories help readers move through planning, reporting, workflow, and design topics faster while keeping the editorial experience clean on every screen."
      stats={[
        { label: "Planning", value: "14" },
        { label: "Operations", value: "11" },
        { label: "Design", value: "09" },
      ]}
      cards={[
        {
          title: "Planning",
          description: "Budget strategy, forecast reviews, and better habits for financial decision-making.",
        },
        {
          title: "Operations",
          description: "Approval flows, payment context, and smoother coordination across cross-functional teams.",
        },
        {
          title: "Design systems",
          description: "Thoughtful UI patterns for dashboards, editorial surfaces, and product trust.",
        },
      ]}
      asideTitle="A cleaner way to explore the blog"
      asideDescription="These category views make the blog feel more structured and more useful as the content library grows."
      primaryAction={{ label: "Read All Posts", href: "/blog" }}
      secondaryAction={{ label: "Write a Blog", href: "/blog/create" }}
    />
  );
}
