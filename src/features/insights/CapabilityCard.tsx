import { ArrowRight, Sparkles, GitMerge, Activity, Telescope, Library, GraduationCap, ListChecks } from "lucide-react";
import type { Capability } from "@/mocks/seed/insightsAI";
import { Sparkline } from "@/components/data-display/Sparkline";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ICON: Record<Capability["key"], React.ComponentType<{ className?: string; strokeWidth?: number | string }>> = {
  extraction: ListChecks,
  fourE:      Activity,
  premeet:    Telescope,
  alignment:  GitMerge,
  memory:     Library,
  coach:      GraduationCap,
};

export function CapabilityCard({ cap }: { cap: Capability }) {
  const Icon = ICON[cap.key];
  return (
    <button
      className={cn(
        "group ai-edge w-full text-left rounded-xl bg-surface p-4 shadow-elev-1 transition-all",
        "hover:shadow-[0_2px_8px_-2px_rgba(15,23,42,0.06)]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="h-9 w-9 rounded-md bg-gradient-to-br from-brand-500/10 to-accent-500/15 grid place-items-center text-accent-700">
          <Icon className="h-4 w-4" strokeWidth={2} />
        </div>
        <Badge tone={cap.status === "live" ? "success" : "warning"} dot size="sm">
          {cap.status}
        </Badge>
      </div>
      <h3 className="mt-3 text-h3 text-ink-primary leading-tight">{cap.title}</h3>
      <p className="mt-1 text-body-sm text-ink-muted leading-snug line-clamp-2">{cap.blurb}</p>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-kpi-sm tabular-nums text-ink-primary leading-none">{cap.metric}</p>
          <p className="text-[11px] text-ink-muted mt-1">{cap.metricLabel}</p>
        </div>
        <Sparkline data={cap.trend} positive width={70} height={24} />
      </div>

      <div className="mt-3 pt-3 border-t border-border-soft flex items-center justify-between text-body-sm">
        <span className="text-[11px] text-ink-muted tabular-nums">
          model accuracy <span className="font-medium text-ink-secondary">{cap.accuracy}%</span>
        </span>
        <span className="inline-flex items-center gap-1 text-brand-600 font-medium group-hover:text-brand-700">
          Open
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>

      <div className="absolute -inset-px rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute top-3 right-3 text-accent-500">
          <Sparkles className="h-3 w-3" />
        </div>
      </div>
    </button>
  );
}
