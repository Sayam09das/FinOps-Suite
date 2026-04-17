import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";

import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import { Reveal } from "@/app/components/ui/reveal";

import type { BlogPost } from "../blog-data";

type BlogCardProps = {
  index: number;
  post: BlogPost;
};

export default function BlogCard({ index, post }: BlogCardProps) {
  return (
    <Reveal delay={0.05 * index} variant="up">
      <Card variant="surface" padding="none" className="surface-card-hover group h-full overflow-hidden">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image src={post.image} alt={post.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
        </div>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-3 text-sm text-foreground/54">
            <Badge variant="outline">{post.category}</Badge>
            <span>{post.date}</span>
            <span className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4" />
              {post.readTime}
            </span>
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold leading-[1.02] tracking-[-0.03em] text-foreground">{post.title}</h3>
            <p className="text-sm leading-7 text-foreground/68">{post.excerpt}</p>
          </div>
          <Link href={post.href} className="inline-flex items-center gap-2 text-sm font-semibold text-accent-foreground transition group-hover:gap-3">
            Read article
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </CardContent>
      </Card>
    </Reveal>
  );
}
