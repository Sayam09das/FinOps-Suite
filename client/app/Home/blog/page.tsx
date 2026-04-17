"use client";

import { startTransition, useDeferredValue, useState } from "react";

import BlogCategories from "./components/BlogCategories";
import BlogGrid from "./components/BlogGrid";
import BlogHero from "./components/BlogHero";
import BlogSearch from "./components/BlogSearch";
import FeaturedPost from "./components/FeaturedPost";
import WriteBlogSection from "./components/WriteBlogSection";
import { blogCategories, blogPosts, type BlogCategory } from "./blog-data";

export default function BlogPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<BlogCategory>("All");

  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const featuredPost = blogPosts[0];
  const remainingPosts = blogPosts.slice(1);

  const filteredPosts = remainingPosts.filter((post) => {
    const categoryMatch = activeCategory === "All" || post.category === activeCategory;
    const queryMatch =
      normalizedQuery.length === 0 ||
      post.title.toLowerCase().includes(normalizedQuery) ||
      post.excerpt.toLowerCase().includes(normalizedQuery) ||
      post.category.toLowerCase().includes(normalizedQuery);

    return categoryMatch && queryMatch;
  });

  const categoryCounts = blogCategories.map((category) => ({
    name: category,
    count: category === "All" ? remainingPosts.length : remainingPosts.filter((post) => post.category === category).length,
  }));

  return (
    <main className="flex-1">
      <div className="page-shell">
        <BlogHero />
        <FeaturedPost post={featuredPost} />
        <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr] xl:items-end">
          <BlogSearch
            query={query}
            resultCount={filteredPosts.length}
            onQueryChange={(nextValue) => {
              startTransition(() => {
                setQuery(nextValue);
              });
            }}
          />
          <BlogCategories
            categories={categoryCounts}
            activeCategory={activeCategory}
            onCategoryChange={(category) => {
              startTransition(() => {
                setActiveCategory(category);
              });
            }}
          />
        </div>
        <BlogGrid posts={filteredPosts} />
        <WriteBlogSection />
      </div>
    </main>
  );
}
