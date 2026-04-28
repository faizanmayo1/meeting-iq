import {
  Clock,
  Sparkles,
  AlertOctagon,
  AlertTriangle,
  CloudRain,
  Wrench,
  Compass,
  CalendarX,
  Fuel,
  Wifi,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ExceptionRow, ExceptionKind, ExceptionState } from "@/mocks/seed/exceptions";
import { cn } from "@/lib/utils";

const KIND_ICON: Record<ExceptionKind, React.ComponentType<{ className?: string; strokeWidth?: number | string }>> = {
  detention: Clock,
  hos: AlertOctagon,
  missed_appointment: CalendarX,
  weather: CloudRain,
  breakdown: Wrench,
  route_deviation: Compass,
  fuel_anomaly: Fuel,
  geo_off_lane: Wifi,
};

const SEV_TONE = {
  critical: "danger",
  warning: "warning",
  info: "info",
} as const;

const STATE_LABEL: Record<ExceptionState, string> = {
  open: "Open",
  in_progress: "In progress",
  auto_resolved: "Auto-resolved",
  resolved: "Resolved",
};

export function ExceptionItem({
  exception,
  active,
  onClick,
}: {
  exception: ExceptionRow;
  active?: boolean;
  onClick?: () => void;
}) {
  const Icon = KIND_ICON[exception.kind];
  const isOpen = exception.state === "open" || exception.state === "in_progress";
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-lg border bg-surface p-4 transition-all group",
        active
          ? "border-brand-500 ring-2 ring-brand-500/15"
          : exception.severity === "critical" && isOpen
          ? "border-danger-500/25 hover:border-danger-500/40"
          : "border-border-soft hover:border-border"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "h-9 w-9 shrink-0 rounded-md grid place-items-center",
            exception.severity === "critical"
              ? "bg-danger-50 text-danger-700"
              : exception.severity === "warning"
              ? "bg-warning-50 text-warning-700"
              : "bg-brand-50 text-brand-700"
          )}
        >
          <Icon className="h-4 w-4" strokeWidth={2} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge tone={SEV_TONE[exception.severity]} size="sm" dot>
              {exception.severity}
            </Badge>
            <Badge
              tone={
                exception.state === "auto_resolved"
                  ? "accent"
                  : exception.state === "in_progress"
                  ? "info"
                  : "neutral"
              }
              size="sm"
            >
              {STATE_LABEL[exception.state]}
            </Badge>
            <span className="text-[11px] text-ink-muted">
              <span className="font-mono">{exception.load === "—" ? exception.unit : exception.load}</span>
              <span className="mx-1.5">·</span>
              {exception.driver === "—" ? "Yard" : exception.driver}
              <span className="mx-1.5">·</span>
              {exception.age} ago
            </span>
          </div>
          <h4 className="mt-1 text-body font-medium text-ink-primary leading-snug">
            {exception.title}
          </h4>
          <p className="mt-0.5 text-body-sm text-ink-muted leading-relaxed line-clamp-2">
            {exception.detail}
          </p>
          {/* Resolution row */}
          {exception.resolutions && exception.resolutions.length > 0 ? (
            <div className="mt-2.5 flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-1.5 text-body-sm">
                <Sparkles className="h-3.5 w-3.5 text-accent-700" />
                <span className="text-accent-700 font-medium">
                  {exception.resolutions.find((r) => r.recommended)?.label ?? exception.resolution}
                </span>
              </div>
              {exception.dollarImpact != null && (
                <span className="text-[11px] text-ink-muted tabular-nums">
                  ${exception.dollarImpact.toLocaleString()} at stake
                </span>
              )}
            </div>
          ) : (
            <p className="mt-2 text-body-sm text-ink-secondary inline-flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-ink-muted" />
              {exception.resolution}
            </p>
          )}
        </div>

        <ArrowRight className="h-4 w-4 text-ink-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
      </div>
    </button>
  );
}
