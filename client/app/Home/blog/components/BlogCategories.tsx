import type { BlogCategory } from "../blog-data";

import { cn } from "@/lib/utils";

import { Reveal } from "@/app/components/ui/reveal";

type BlogCategoriesProps = {
  activeCategory: BlogCategory;
  categories: Array<{
    count: number;
    name: BlogCategory;
  }>;
  onCategoryChange: (category: BlogCategory) => void;
};

export default function BlogCategories({
  activeCategory,
  categories,
  onCategoryChange,
}: BlogCategoriesProps) {
  return (
    <Reveal variant="right">
      <div className="flex flex-wrap gap-2 xl:justify-end">
        {categories.map((category, index) => {
          const active = activeCategory === category.name;

          return (
            <Reveal key={category.name} delay={0.04 * index} variant="up">
              <button
                type="button"
                onClick={() => onCategoryChange(category.name)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition duration-300",
                  active
                    ? "border-border bg-primary text-foreground shadow-[0_10px_30px_rgba(33,49,43,0.08)]"
                    : "border-border/80 bg-background/72 text-foreground/70 hover:bg-surface hover:text-foreground",
                )}
              >
                <span>{category.name}</span>
                <span className={cn("rounded-full px-2 py-0.5 text-xs", active ? "bg-background/70" : "bg-surface/80")}>
                  {category.count}
                </span>
              </button>
            </Reveal>
          );
        })}
      </div>
    </Reveal>
  );
}
