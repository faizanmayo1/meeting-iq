import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

const sheetVariants = cva(
  "fixed z-50 bg-surface shadow-elev-3 border-border-soft data-[state=open]:animate-in data-[state=closed]:animate-out duration-200",
  {
    variants: {
      side: {
        right:
          "inset-y-0 right-0 h-full w-full sm:max-w-xl border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
        left:
          "inset-y-0 left-0 h-full w-full sm:max-w-md border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
      },
    },
    defaultVariants: { side: "right" },
  }
);

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  width?: string;
}

export const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, width, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink-primary/30 backdrop-blur-[2px] data-[state=open]:animate-fade-in" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), width, className)}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-md p-1 text-ink-muted hover:bg-subtle hover:text-ink-primary focus:outline-none">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
SheetContent.displayName = "SheetContent";

export const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6 border-b border-border-soft", className)} {...props} />
);

export const SheetBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6 overflow-y-auto", className)} {...props} />
);

export const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex items-center justify-end gap-2 p-4 border-t border-border-soft bg-surface", className)}
    {...props}
  />
);

export const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn("text-h2 text-ink-primary", className)} {...props} />
));
SheetTitle.displayName = "SheetTitle";

export const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-body text-ink-muted", className)} {...props} />
));
SheetDescription.displayName = "SheetDescription";
