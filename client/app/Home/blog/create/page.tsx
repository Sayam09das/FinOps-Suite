import MarketingPageTemplate from "@/app/components/common/MarketingPageTemplate";

export default function CreateBlogPage() {
  return (
    <MarketingPageTemplate
      eyebrow="Write Blog"
      title="Give your team a cleaner place to publish product and finance insights."
      description="This page can evolve into a full editorial workflow later, but it already fits the same visual system and responsive quality as the rest of the site."
      stats={[
        { label: "Draft flow", value: "Ready" },
        { label: "Review steps", value: "03" },
        { label: "Publishing pace", value: "Weekly" },
      ]}
      cards={[
        {
          title: "Draft with clarity",
          description: "Start with a calmer writing surface that keeps the structure approachable and focused.",
        },
        {
          title: "Review collaboratively",
          description: "Support founder, marketing, and product input without turning the process into a mess.",
        },
        {
          title: "Publish consistently",
          description: "Turn new articles into part of the same startup-style brand and product journey.",
        },
      ]}
      asideTitle="Editorial workflow, designed like a product"
      asideDescription="The site now has the structure to support future content workflows without losing brand cohesion."
      primaryAction={{ label: "Go to Blog", href: "/blog" }}
      secondaryAction={{ label: "Browse Categories", href: "/blog/categories" }}
    />
  );
}
