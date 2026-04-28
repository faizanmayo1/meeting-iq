import { Card, CardCaption, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SettingsSection({
  caption,
  title,
  description,
  actions,
  children,
}: {
  caption?: string;
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="min-w-0">
          {caption && <CardCaption>{caption}</CardCaption>}
          <CardTitle className="mt-1">{title}</CardTitle>
          {description && (
            <p className="mt-1 text-body-sm text-ink-muted leading-relaxed max-w-prose">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </CardHeader>
      {children}
    </Card>
  );
}

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="text-body-sm font-medium text-ink-primary block">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-ink-muted">{hint}</p>}
    </div>
  );
}

export function Toggle({ on, onChange }: { on: boolean; onChange?: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => onChange?.(!on)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors",
        on ? "bg-brand-500" : "bg-border-strong"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
          on ? "translate-x-[18px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}
