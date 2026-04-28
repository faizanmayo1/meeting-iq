import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-9 w-full rounded-md border border-border bg-surface px-3 text-body text-ink-primary",
        "placeholder:text-ink-muted",
        "focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
