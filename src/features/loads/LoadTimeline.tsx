import { Check, Truck, AlertTriangle, MapPin, Flag, Clock } from "lucide-react";
import type { TimelineStop } from "@/mocks/seed/loads";
import { cn } from "@/lib/utils";

const KIND_ICON = {
  pickup: Flag,
  stop: MapPin,
  delivery: Truck,
} as const;

const STATUS_DOT: Record<TimelineStop["status"], string> = {
  completed: "bg-success-500 ring-success-500/20",
  current: "bg-brand-500 ring-brand-500/30",
  "predicted-late": "bg-warning-500 ring-warning-500/30",
  scheduled: "bg-ink-disabled ring-ink-disabled/30",
};

export function LoadTimeline({ stops }: { stops: TimelineStop[] }) {
  return (
    <ol className="relative">
      {/* connector */}
      <span className="absolute left-[15px] top-3 bottom-3 w-px bg-border-soft" />
      {stops.map((s, i) => {
        const Kind = KIND_ICON[s.kind];
        const isCurrent = s.status === "current";
        const isLate = s.status === "predicted-late";
        return (
          <li key={s.id} className={cn("relative pl-10 pb-5", i === stops.length - 1 && "pb-0")}>
            <span
              className={cn(
                "absolute left-1.5 top-0.5 h-4 w-4 rounded-full ring-4",
                STATUS_DOT[s.status],
                isCurrent && "animate-pulse"
              )}
            />
            <div className="flex items-center gap-2">
              <Kind className="h-3.5 w-3.5 text-ink-muted" strokeWidth={2} />
              <span className="text-caption uppercase tracking-[0.1em] text-ink-muted">
                {s.kind}
              </span>
              {s.status === "completed" && (
                <span className="inline-flex items-center gap-0.5 text-[11px] text-success-700">
                  <Check className="h-3 w-3" strokeWidth={2.5} /> on time
                </span>
              )}
              {isLate && (
                <span className="inline-flex items-center gap-0.5 text-[11px] text-warning-700 font-medium">
                  <AlertTriangle className="h-3 w-3" strokeWidth={2.5} /> predicted late
                </span>
              )}
              {isCurrent && (
                <span className="inline-flex items-center gap-0.5 text-[11px] text-brand-700 font-medium">
                  <Clock className="h-3 w-3" strokeWidth={2.5} /> in progress
                </span>
              )}
            </div>
            <div className="mt-1 flex items-baseline justify-between gap-3">
              <p className="text-body font-medium text-ink-primary">{s.location}</p>
              <p className="text-body-sm font-mono text-ink-muted tabular-nums shrink-0">
                {s.actual ?? s.scheduled}
              </p>
            </div>
            <p className="text-body-sm text-ink-muted mt-0.5">{s.address}</p>
            {s.note && (
              <p
                className={cn(
                  "mt-1.5 text-body-sm leading-snug",
                  isLate ? "text-warning-700" : isCurrent ? "text-brand-700" : "text-ink-secondary"
                )}
              >
                {s.note}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
