export type BlogPost = {
  category: string;
  date: string;
  excerpt: string;
  href: string;
  image: string;
  readTime: string;
  slug: string;
  title: string;
};

export type BlogCategory = "All" | "Design Systems" | "Operations" | "Planning" | "Reporting";

export const blogPosts: BlogPost[] = [
  {
    slug: "calm-dashboards-for-finance-teams",
    title: "Why calmer dashboards help finance teams move faster",
    excerpt:
      "A product can feel more trustworthy when it uses hierarchy, spacing, and emphasis with restraint instead of noise.",
    category: "Design Systems",
    readTime: "6 min read",
    date: "April 8, 2026",
    href: "/blog",
    image: "/illustrations/blog-featured.svg",
  },
  {
    slug: "approvals-with-less-friction",
    title: "How to reduce approval friction without losing control",
    excerpt:
      "The best workflows keep accountability strong while lowering the amount of repeated explanation between teams.",
    category: "Operations",
    readTime: "5 min read",
    date: "April 5, 2026",
    href: "/blog",
    image: "/illustrations/blog-post-automation.svg",
  },
  {
    slug: "forecasting-for-growing-startups",
    title: "Forecasting for startups that are scaling quickly",
    excerpt:
      "When planning becomes more collaborative, your interface needs to support clarity across multiple decision makers.",
    category: "Planning",
    readTime: "7 min read",
    date: "April 2, 2026",
    href: "/blog",
    image: "/illustrations/blog-post-forecast.svg",
  },
  {
    slug: "finance-storytelling-for-leadership",
    title: "Telling a stronger finance story to leadership",
    excerpt:
      "Executive-ready reporting is not just about data density. It is about sequencing information so the narrative lands quickly.",
    category: "Reporting",
    readTime: "4 min read",
    date: "March 28, 2026",
    href: "/blog",
    image: "/illustrations/blog-post-strategy.svg",
  },
  {
    slug: "designing-editorial-surfaces",
    title: "Designing editorial surfaces that feel like part of the product",
    excerpt:
      "Your blog should reinforce the product brand, not feel like a disconnected template stitched on later.",
    category: "Design Systems",
    readTime: "5 min read",
    date: "March 24, 2026",
    href: "/blog",
    image: "/illustrations/blog-post-automation.svg",
  },
  {
    slug: "building-trust-in-ops-products",
    title: "Building trust in operational products through UI details",
    excerpt:
      "Warm color systems, gentle motion, and strong card structure create more confidence than flashy interfaces.",
    category: "Operations",
    readTime: "6 min read",
    date: "March 19, 2026",
    href: "/blog",
    image: "/illustrations/blog-post-forecast.svg",
  },
  {
    slug: "better-review-rituals-for-finance",
    title: "Creating better weekly review rituals for finance and ops",
    excerpt:
      "The interface can play a big role in helping recurring review meetings feel productive instead of repetitive.",
    category: "Planning",
    readTime: "4 min read",
    date: "March 14, 2026",
    href: "/blog",
    image: "/illustrations/blog-post-strategy.svg",
  },
];

export const blogCategories: readonly BlogCategory[] = ["All", "Design Systems", "Operations", "Planning", "Reporting"];
