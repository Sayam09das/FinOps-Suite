import MarketingPageTemplate from "@/app/components/common/MarketingPageTemplate";

export default function CreateBlogPage() {
  return (
    <MarketingPageTemplate
      eyebrow="Write Blog"
      title="A smoother publishing flow for product updates and operational insights."
      description="This route can grow into a real editorial editor later, but it already gives your navigation a complete and credible structure while keeping the interface polished."
      stats={[
        { label: "Draft flow", value: "Ready" },
        { label: "Review steps", value: "03" },
        { label: "Publishing pace", value: "Weekly" },
      ]}
      cards={[
        {
          title: "Draft",
          description: "Capture insights fast with a calmer surface that keeps structure and writing momentum in balance.",
        },
        {
          title: "Review",
          description: "Share a cleaner editing workflow with operators, finance leads, and editorial reviewers.",
        },
        {
          title: "Publish",
          description: "Move new posts into the content system with consistent styling and better route-level organization.",
        },
      ]}
      asideTitle="Designed as part of the product journey"
      asideDescription="Even placeholder routes should feel deliberate. That keeps the navbar trustworthy now and makes future feature work easier to layer in."
      primaryAction={{ label: "Go to Blog", href: "/blog" }}
      secondaryAction={{ label: "Browse Categories", href: "/blog/categories" }}
    />
  );
}
