import {
  GitMerge,
  AlertOctagon,
  CalendarX,
  Activity,
  CircleSlash,
  WifiOff,
  Sparkles,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Risk, RiskKind, RiskState } from "@/mocks/seed/risks";
import { cn } from "@/lib/utils";

const KIND_ICON: Record<RiskKind, React.ComponentType<{ className?: string; strokeWidth?: number | string }>> = {
  alignment_conflict: GitMerge,
  ownership_unclear:  AlertOctagon,
  decision_overdue:   CalendarX,
  engagement_drop:    Activity,
  blocker:            CircleSlash,
  deadline_slip:      CalendarX,
  meeting_overload:   Activity,
};

const SEV_TONE = {
  critical: "danger",
  warning: "warning",
  info: "info",
} as const;

const STATE_LABEL: Record<RiskState, string> = {
  open: "Open",
  in_progress: "In progress",
  auto_resolved: "Auto-resolved",
  resolved: "Resolved",
};

const STATE_TONE: Record<RiskState, "neutral" | "info" | "accent"> = {
  open: "neutral",
  in_progress: "info",
  auto_resolved: "accent",
  resolved: "accent",
};

export function RiskItem({
  risk,
  active,
  onClick,
}: {
  risk: Risk;
  active?: boolean;
  onClick?: () => void;
}) {
  const Icon = KIND_ICON[risk.kind] ?? AlertTriangle;
  const isOpen = risk.state === "open" || risk.state === "in_progress";

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-lg border bg-surface p-4 transition-all group",
        active
          ? "border-brand-500 ring-2 ring-brand-500/15"
          : risk.severity === "critical" && isOpen
          ? "border-danger-500/25 hover:border-danger-500/40"
          : "border-border-soft hover:border-border"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "h-9 w-9 shrink-0 rounded-md grid place-items-center",
            risk.severity === "critical"
              ? "bg-danger-50 text-danger-700"
              : risk.severity === "warning"
              ? "bg-warning-50 text-warning-700"
              : "bg-brand-50 text-brand-700"
          )}
        >
          <Icon className="h-4 w-4" strokeWidth={2} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge tone={SEV_TONE[risk.severity]} size="sm" dot>
              {risk.severity}
            </Badge>
            <Badge tone={STATE_TONE[risk.state]} size="sm">
              {STATE_LABEL[risk.state]}
            </Badge>
            <span className="text-[11px] text-ink-muted">
              {risk.departments.slice(0, 2).join(" · ")}
              <span className="mx-1.5">·</span>
              {risk.age} ago
            </span>
          </div>
          <h4 className="mt-1 text-body font-medium text-ink-primary leading-snug">
            {risk.title}
          </h4>
          <p className="mt-0.5 text-body-sm text-ink-muted leading-relaxed line-clamp-2">
            {risk.detail}
          </p>
          {risk.resolutions && risk.resolutions.length > 0 ? (
            <div className="mt-2.5 flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-1.5 text-body-sm">
                <Sparkles className="h-3.5 w-3.5 text-accent-700" />
                <span className="text-accent-700 font-medium">
                  {risk.resolutions.find((r) => r.recommended)?.label ?? risk.resolution}
                </span>
              </div>
              {risk.dollarImpact != null && (
                <span className="text-[11px] text-ink-muted tabular-nums">
                  ${risk.dollarImpact >= 1_000_000
                    ? `${(risk.dollarImpact / 1_000_000).toFixed(1)}M`
                    : `${(risk.dollarImpact / 1000).toFixed(0)}K`} at stake
                </span>
              )}
            </div>
          ) : (
            <p className="mt-2 text-body-sm text-ink-secondary">{risk.resolution}</p>
          )}
        </div>

        <ArrowRight className="h-4 w-4 text-ink-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
      </div>
    </button>
  );
}
