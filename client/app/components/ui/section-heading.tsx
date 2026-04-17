import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Badge } from "./badge";

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  align = "left",
  className,
  description,
  eyebrow,
  title,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div className={cn("space-y-4", centered && "mx-auto max-w-3xl text-center", className)}>
      <Badge variant={centered ? "outline" : "subtle"} className={centered ? "mx-auto" : undefined}>
        {eyebrow}
      </Badge>
      <div className="space-y-4">
        <h2 className="text-4xl font-semibold leading-[0.96] tracking-[-0.04em] text-foreground sm:text-5xl lg:text-6xl">
          {title}
        </h2>
        <p className={cn("max-w-2xl text-base leading-8 text-foreground/72 sm:text-lg", centered && "mx-auto")}>
          {description}
        </p>
      </div>
    </div>
  );
}
