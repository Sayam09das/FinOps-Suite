import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";

import { Badge } from "@/app/components/ui/badge";
import { buttonVariants } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Reveal } from "@/app/components/ui/reveal";

import type { BlogPost } from "../blog-data";

export default function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <Reveal variant="scale">
      <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr] xl:items-center">
        <div className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-white/42 p-3 shadow-[0_24px_70px_rgba(33,49,43,0.08)]">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[1.6rem]">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 1024px) 100vw, 54vw"
              className="object-cover"
            />
          </div>
        </div>

        <Card variant="surface" padding="xl" className="h-full">
          <CardContent className="flex h-full flex-col justify-between">
            <div className="space-y-5">
              <Badge variant="accent" className="w-fit">
                Featured Post
              </Badge>
              <div className="flex flex-wrap items-center gap-3 text-sm text-foreground/54">
                <span>{post.date}</span>
                <span className="h-1 w-1 rounded-full bg-foreground/24" />
                <span>{post.category}</span>
                <span className="h-1 w-1 rounded-full bg-foreground/24" />
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  {post.readTime}
                </span>
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-semibold leading-[0.98] tracking-[-0.04em] text-foreground">
                  {post.title}
                </h2>
                <p className="text-base leading-8 text-foreground/72">{post.excerpt}</p>
              </div>
            </div>

            <Link href={post.href} className={buttonVariants({ size: "lg" })}>
              Read featured story
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </section>
    </Reveal>
  );
}
