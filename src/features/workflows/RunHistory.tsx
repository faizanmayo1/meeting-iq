import { Bot, Check, X, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { RunRow } from "@/mocks/seed/workflows";
import { cn } from "@/lib/utils";

const OUTCOME = {
  auto:     { tone: "accent" as const,  label: "Auto",     Icon: Bot },
  approved: { tone: "info" as const,    label: "Approved", Icon: Check },
  rejected: { tone: "neutral" as const, label: "Rejected", Icon: X },
  snoozed:  { tone: "warning" as const, label: "Snoozed",  Icon: Clock },
};

export function RunHistory({ rows }: { rows: RunRow[] }) {
  return (
    <ol className="relative">
      <span className="absolute left-[15px] top-2 bottom-2 w-px bg-border-soft" />
      {rows.map((r) => {
        const o = OUTCOME[r.outcome];
        return (
          <li key={r.id} className="relative pl-10 pb-3.5 last:pb-0">
            <span
              className={cn(
                "absolute left-1 top-0 h-5 w-5 rounded-full ring-4 ring-surface grid place-items-center",
                r.outcome === "auto"
                  ? "bg-accent-50 text-accent-700"
                  : r.outcome === "approved"
                  ? "bg-brand-50 text-brand-700"
                  : r.outcome === "snoozed"
                  ? "bg-warning-50 text-warning-700"
                  : "bg-subtle text-ink-muted"
              )}
            >
              <o.Icon className="h-3 w-3" strokeWidth={2.25} />
            </span>
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-body-sm font-medium text-ink-primary leading-snug pr-2">
                {r.workflow}
              </p>
              <span className="text-[11px] font-mono tabular-nums text-ink-muted shrink-0">{r.time}</span>
            </div>
            <p className="text-[12px] text-ink-muted leading-snug mt-0.5">{r.detail}</p>
            <div className="mt-1 flex items-center gap-2">
              <Badge tone={o.tone} size="sm">{o.label}</Badge>
              {r.saved && <span className="text-[11px] text-success-700 font-medium tabular-nums">{r.saved}</span>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
