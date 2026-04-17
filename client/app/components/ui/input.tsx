import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-12 w-full rounded-2xl border border-border/80 bg-background/82 px-4 text-sm text-foreground shadow-[0_10px_30px_rgba(33,49,43,0.05)] outline-none transition duration-300 placeholder:text-foreground/38 focus:border-ring/70 focus:ring-2 focus:ring-ring/30",
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
