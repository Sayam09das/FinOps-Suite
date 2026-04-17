import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-foreground text-background shadow-[0_16px_40px_rgba(33,49,43,0.22)] hover:-translate-y-0.5 hover:bg-foreground/92",
        secondary:
          "border border-border bg-background/80 text-foreground shadow-[0_10px_30px_rgba(33,49,43,0.06)] hover:-translate-y-0.5 hover:bg-surface",
        accent:
          "border border-accent/40 bg-accent/18 text-accent-foreground shadow-[0_10px_30px_rgba(220,155,155,0.16)] hover:-translate-y-0.5 hover:bg-accent/26",
        light:
          "bg-background text-foreground shadow-[0_14px_35px_rgba(255,255,255,0.12)] hover:-translate-y-0.5 hover:bg-white",
        ghost: "text-foreground/72 hover:bg-background/70 hover:text-foreground",
      },
      size: {
        sm: "px-4 py-2.5 text-sm",
        default: "px-5 py-3 text-sm",
        lg: "px-6 py-3.5 text-sm sm:text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size, variant, type = "button", ...props }, ref) => {
    return <button ref={ref} type={type} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
  },
);

Button.displayName = "Button";

export { Button };
