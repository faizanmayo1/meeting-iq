import { cn } from "@/lib/utils";
import { CardCaption } from "@/components/ui/card";

type Tone = "neutral" | "warning" | "danger" | "success" | "accent";

const VALUE_TONE: Record<Tone, string> = {
  neutral: "text-ink-primary",
  warning: "text-warning-700",
  danger: "text-danger-700",
  success: "text-success-700",
  accent: "text-accent-700",
};

type Props = {
  label: string;
  value: React.ReactNode;
  note?: React.ReactNode;
  tone?: Tone;
  icon?: React.ReactNode;
  className?: string;
};

export function StatTile({ label, value, note, tone = "neutral", icon, className }: Props) {
  return (
    <div
      className={cn(
        "rounded-xl bg-surface border border-border-soft shadow-elev-1 p-4 transition-colors hover:border-border",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <CardCaption>{label}</CardCaption>
        {icon && <span className="text-ink-muted">{icon}</span>}
      </div>
      <p className={cn("mt-1 text-kpi-sm tabular-nums", VALUE_TONE[tone])}>{value}</p>
      {note && <div className="mt-1 text-body-sm text-ink-muted truncate">{note}</div>}
    </div>
  );
}
