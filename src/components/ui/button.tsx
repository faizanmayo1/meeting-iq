import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-body font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-500 text-ink-invert hover:bg-brand-600 active:bg-brand-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_2px_rgba(46,91,255,0.18)]",
        secondary:
          "bg-surface text-ink-primary border border-border hover:bg-subtle hover:border-border-strong shadow-elev-1",
        ghost: "text-ink-secondary hover:bg-subtle hover:text-ink-primary",
        link: "text-brand-600 underline-offset-4 hover:underline px-0",
        danger: "bg-danger-500 text-ink-invert hover:bg-danger-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(220,38,38,0.18)]",
        ai: "bg-[linear-gradient(135deg,hsl(var(--brand-500)),hsl(var(--accent-500))_55%,hsl(var(--accent-700)))] bg-[length:140%_140%] hover:bg-[position:30%_30%] text-ink-invert shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_2px_8px_-2px_rgba(124,58,237,0.32)]",
      },
      size: {
        sm: "h-8 px-3 text-body-sm",
        md: "h-9 px-3.5",
        lg: "h-10 px-4",
        icon: "h-9 w-9",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
  }
);
Button.displayName = "Button";

export { buttonVariants };
