import MarketingPageTemplate from "@/app/components/common/MarketingPageTemplate";

export default function BlogPage() {
  return (
    <MarketingPageTemplate
      eyebrow="Blog"
      title="Ideas, playbooks, and product thinking for better finance operations."
      description="Use the blog as a clean editorial hub for finance strategy, reporting best practices, and product updates, all wrapped in the same design language as the core app."
      stats={[
        { label: "Guides", value: "48" },
        { label: "Categories", value: "12" },
        { label: "New this month", value: "06" },
      ]}
      cards={[
        {
          title: "All posts",
          description: "Browse every article with a layout that supports editorial depth without feeling heavy.",
        },
        {
          title: "Operational categories",
          description: "Cluster topics by planning, reporting, approvals, and analysis for faster discovery.",
        },
        {
          title: "Author workflow",
          description: "Give writers and operators a cleaner creation flow with stronger structure and less friction.",
        },
      ]}
      asideTitle="Editorial pages should feel like part of the product"
      asideDescription="The navbar now connects marketing, content, and application-style surfaces into a more consistent journey, especially on mobile."
      primaryAction={{ label: "Browse Categories", href: "/blog/categories" }}
      secondaryAction={{ label: "Write a Blog", href: "/blog/create" }}
    />
  );
}
