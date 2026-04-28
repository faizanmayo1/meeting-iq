import { cn } from "@/lib/utils";

type Props = {
  greeting?: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
};

export function PageHeader({ greeting, title, subtitle, actions, className }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 md:flex-row md:items-end md:justify-between md:gap-6",
        className
      )}
    >
      <div className="min-w-0">
        {greeting && <div className="mb-1.5">{greeting}</div>}
        <h1 className="font-display text-[2rem] leading-[2.5rem] font-semibold tracking-tight text-ink-primary">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-body text-ink-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
