import { FileSearch } from "lucide-react";

import { Card, CardContent } from "@/app/components/ui/card";
import { Reveal } from "@/app/components/ui/reveal";

import type { BlogPost } from "../blog-data";
import BlogCard from "./BlogCard";

export default function BlogGrid({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return (
      <Reveal variant="scale">
        <Card variant="ghost" padding="xl">
          <CardContent className="flex items-center justify-center text-center">
            <div className="primary-wash mx-auto flex h-14 w-14 items-center justify-center rounded-2xl">
              <FileSearch className="h-6 w-6 text-foreground" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold text-foreground">No articles match this view yet</h3>
              <p className="max-w-xl text-sm leading-7 text-foreground/68">
                Try a different search term or switch categories to explore more posts.
              </p>
            </div>
          </CardContent>
        </Card>
      </Reveal>
    );
  }

  return (
    <section className="grid gap-5 xl:grid-cols-3 md:grid-cols-2">
      {posts.map((post, index) => (
        <BlogCard key={post.slug} post={post} index={index} />
      ))}
    </section>
  );
}
