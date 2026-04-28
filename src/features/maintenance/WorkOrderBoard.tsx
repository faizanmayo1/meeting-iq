import { Sparkles, MapPin, User2, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { WorkOrder, WorkOrderStatus } from "@/mocks/seed/maintenance";
import { cn } from "@/lib/utils";

const COLS: { key: WorkOrderStatus; label: string; tone: "info" | "warning" | "success" }[] = [
  { key: "scheduled", label: "Scheduled", tone: "info" },
  { key: "in_progress", label: "In progress", tone: "warning" },
  { key: "completed", label: "Completed today", tone: "success" },
];

export function WorkOrderBoard({ orders }: { orders: WorkOrder[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {COLS.map((col) => {
        const items = orders.filter((o) => o.status === col.key);
        return (
          <div
            key={col.key}
            className="rounded-xl border border-border-soft bg-subtle/30 p-3 flex flex-col"
          >
            <div className="flex items-center justify-between gap-2 mb-2 px-1">
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    col.tone === "info" && "bg-brand-500",
                    col.tone === "warning" && "bg-warning-500",
                    col.tone === "success" && "bg-success-500"
                  )}
                />
                <span className="text-caption uppercase tracking-[0.1em] text-ink-secondary font-medium">
                  {col.label}
                </span>
              </div>
              <span className="text-[11px] tabular-nums text-ink-muted bg-surface px-1.5 py-0.5 rounded">
                {items.length}
              </span>
            </div>

            <div className="flex flex-col gap-2 min-h-[80px]">
              {items.map((o) => (
                <article
                  key={o.id}
                  className="rounded-lg bg-surface border border-border-soft p-3 hover:border-border transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="font-mono text-[11px] text-ink-muted">{o.id}</span>
                    <span className="text-ink-disabled">·</span>
                    <span className="font-mono text-body-sm text-ink-primary">{o.unit}</span>
                    {o.source === "ai" && (
                      <Badge tone="accent" size="sm" dot>
                        AI
                      </Badge>
                    )}
                  </div>
                  <h4 className="text-body-sm font-medium text-ink-primary leading-snug">
                    {o.title}
                  </h4>
                  <ul className="mt-2 space-y-1 text-[11px] text-ink-muted">
                    <li className="flex items-center gap-1.5">
                      <Wrench className="h-3 w-3" />
                      <span>{o.scheduled}{o.completedAt ? ` → ${o.completedAt}` : ""}</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{o.location}</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <User2 className="h-3 w-3" />
                      <span className="truncate">{o.technician ?? o.vendor}</span>
                    </li>
                  </ul>
                  {o.cost > 0 && (
                    <div className="mt-2 pt-2 border-t border-border-soft flex items-center justify-between">
                      <span className="text-[11px] text-ink-muted">Estimate</span>
                      <span className="text-body-sm font-medium tabular-nums text-ink-primary">
                        ${o.cost.toLocaleString()}
                      </span>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
