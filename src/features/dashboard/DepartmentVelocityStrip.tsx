import type { DeptVelocity } from "@/mocks/seed/velocity";
import { Sparkline } from "@/components/data-display/Sparkline";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function DepartmentVelocityStrip({ rows }: { rows: DeptVelocity[] }) {
  return (
    <ul className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2">
      {rows.map((d) => {
        const tone =
          d.followThroughPct >= 85
            ? "text-success-700"
            : d.followThroughPct >= 75
            ? "text-ink-primary"
            : "text-warning-700";
        return (
          <li
            key={d.department}
            className="rounded-lg bg-subtle/40 border border-border-soft p-3 hover:border-border transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[10px] uppercase tracking-[0.1em] text-ink-muted truncate font-medium">
                {d.department}
              </span>
              {d.flag && (
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full shrink-0",
                    d.flag.tone === "success" && "bg-success-500",
                    d.flag.tone === "warning" && "bg-warning-500",
                    d.flag.tone === "danger" && "bg-danger-500",
                    d.flag.tone === "accent" && "bg-accent-500"
                  )}
                />
              )}
            </div>
            <div className={cn("text-h3 tabular-nums", tone)}>{d.followThroughPct}%</div>
            <p className="text-[10px] text-ink-muted">follow-through</p>
            <div className="mt-1.5 -mx-1">
              <Sparkline
                data={d.trend}
                positive={d.followThroughPct >= 75}
                width={88}
                height={18}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function VelocityFlag({
  rows,
}: {
  rows: DeptVelocity[];
}) {
  const flagged = rows.filter((d) => d.flag);
  if (flagged.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {flagged.map((d) => (
        <Badge key={d.department} tone={d.flag!.tone} size="sm" dot>
          {d.department} · {d.flag!.label}
        </Badge>
      ))}
    </div>
  );
}
