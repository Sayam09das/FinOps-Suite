import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition duration-300",
  {
    variants: {
      variant: {
        subtle:
          "border-border/80 bg-surface/90 text-foreground/72 shadow-[0_10px_35px_rgba(33,49,43,0.06)]",
        accent: "border-accent/35 bg-accent/16 text-accent-foreground",
        outline: "border-border/80 bg-background/72 text-foreground/68",
        contrast: "border-white/10 bg-white/10 text-background/84",
      },
    },
    defaultVariants: {
      variant: "subtle",
    },
  },
);

export type BadgeProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
