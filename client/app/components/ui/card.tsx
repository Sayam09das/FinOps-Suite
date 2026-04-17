import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-[1.85rem] border", {
  variants: {
    variant: {
      surface: "surface-card border-border/80",
      frosted: "border-white/60 bg-white/62 shadow-[0_24px_65px_rgba(33,49,43,0.1)] backdrop-blur-xl",
      contrast: "contrast-panel border-white/10",
      accent: "border-white/55 bg-accent/18 shadow-[0_18px_55px_rgba(220,155,155,0.14)]",
      primary: "border-border/80 bg-primary/28 shadow-[0_18px_55px_rgba(192,225,210,0.16)]",
      ghost: "border-border/75 bg-background/72 shadow-[0_16px_45px_rgba(33,49,43,0.06)]",
    },
    padding: {
      none: "",
      md: "p-5",
      lg: "p-6",
      xl: "p-7",
    },
  },
  defaultVariants: {
    variant: "surface",
    padding: "none",
  },
});

export interface CardProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, padding, variant, ...props }, ref) => {
  return <div ref={ref} className={cn(cardVariants({ variant, padding }), className)} {...props} />;
});

Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("space-y-2", className)} {...props} />;
});

CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => {
  return <h3 ref={ref} className={cn("text-2xl font-semibold tracking-[-0.03em] text-foreground", className)} {...props} />;
});

CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return <p ref={ref} className={cn("text-base leading-7 text-foreground/70", className)} {...props} />;
  },
);

CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("space-y-4", className)} {...props} />;
});

CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("flex flex-wrap items-center gap-3", className)} {...props} />;
});

CardFooter.displayName = "CardFooter";

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
