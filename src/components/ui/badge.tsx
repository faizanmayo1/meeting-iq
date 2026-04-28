import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-medium uppercase ring-1 ring-inset",
  {
    variants: {
      tone: {
        success: "bg-success-50 text-success-700 ring-success-500/20",
        warning: "bg-warning-50 text-warning-700 ring-warning-500/20",
        danger: "bg-danger-50 text-danger-700 ring-danger-500/20",
        info: "bg-brand-50 text-brand-700 ring-brand-500/20",
        accent: "bg-accent-50 text-accent-700 ring-accent-500/20",
        neutral: "bg-subtle text-ink-secondary ring-border",
      },
      size: {
        sm: "px-2 py-0.5 text-[0.6875rem]",
        md: "",
      },
    },
    defaultVariants: { tone: "neutral", size: "md" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ className, tone, size, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone, size, className }))} {...props}>
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            tone === "success" && "bg-success-500",
            tone === "warning" && "bg-warning-500",
            tone === "danger" && "bg-danger-500",
            tone === "info" && "bg-brand-500",
            tone === "accent" && "bg-accent-500",
            (!tone || tone === "neutral") && "bg-ink-muted"
          )}
        />
      )}
      {children}
    </span>
  );
}
