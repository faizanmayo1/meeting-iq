import { Sparkles, ArrowUpRight } from "lucide-react";
import { Sparkline } from "@/components/data-display/Sparkline";
import { Badge } from "@/components/ui/badge";
import type { DeptVelocity } from "@/mocks/seed/velocity";
import { cn } from "@/lib/utils";

export function DeptVelocityTable({ rows }: { rows: DeptVelocity[] }) {
  return (
    <div className="overflow-hidden">
      <table className="w-full text-body">
        <thead className="border-b border-border-soft">
          <tr className="text-left text-caption uppercase text-ink-muted tracking-[0.08em]">
            <Th>Department</Th>
            <Th align="right">Meetings / wk</Th>
            <Th align="right">Time-to-task</Th>
            <Th align="right">Decision-to-done</Th>
            <Th align="right">Follow-through</Th>
            <Th align="right">Ownership</Th>
            <Th align="right">4E avg</Th>
            <Th align="right">12-week trend</Th>
            <Th>Flag</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((d) => (
            <tr
              key={d.department}
              className="border-b border-border-soft last:border-b-0 hover:bg-subtle/40 transition-colors group cursor-pointer"
            >
              <td className="px-5 py-3.5 text-body-sm font-medium text-ink-primary">
                {d.department}
              </td>
              <td className="px-3 py-3.5 text-right font-mono text-body-sm tabular-nums text-ink-primary">
                {d.meetingsPerWeek}
              </td>
              <td className="px-3 py-3.5 text-right font-mono text-body-sm tabular-nums text-ink-secondary">
                {d.avgMeetingToTaskMin}m
              </td>
              <td className="px-3 py-3.5 text-right font-mono text-body-sm tabular-nums text-ink-secondary">
                {d.avgDecisionToCompletionDays.toFixed(1)}d
              </td>
              <td className="px-3 py-3.5 text-right">
                <Pct value={d.followThroughPct} positive />
              </td>
              <td className="px-3 py-3.5 text-right">
                <Pct value={d.ownershipClarityPct} positive />
              </td>
              <td className="px-3 py-3.5 text-right">
                <span
                  className={cn(
                    "font-mono text-body-sm tabular-nums font-medium",
                    d.fourEAvg >= 80
                      ? "text-success-700"
                      : d.fourEAvg >= 70
                      ? "text-ink-primary"
                      : "text-warning-700"
                  )}
                >
                  {d.fourEAvg}
                </span>
              </td>
              <td className="px-3 py-3.5">
                <div className="ml-auto inline-block">
                  <Sparkline
                    data={d.trend}
                    positive={d.followThroughPct >= 75}
                    width={86}
                    height={20}
                  />
                </div>
              </td>
              <td className="px-5 py-3.5">
                {d.flag ? (
                  <Badge tone={d.flag.tone} size="sm" dot>
                    {d.flag.label}
                  </Badge>
                ) : (
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 text-body-sm text-ink-muted">
                    Open
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="border-t border-border-soft px-5 py-3 flex items-center gap-2 bg-subtle/30">
        <Sparkles className="h-3.5 w-3.5 text-accent-700" />
        <p className="text-body-sm text-ink-secondary">
          <span className="font-medium text-accent-700">AI bottleneck detection:</span> Product team's
          Decision-to-done at <span className="font-medium text-ink-primary">8.4 days</span> — 2x company
          average. Two recurring meetings flagged for consolidation.
        </p>
      </div>
    </div>
  );
}

function Pct({ value, positive }: { value: number; positive?: boolean }) {
  void positive;
  const tone =
    value >= 90
      ? "text-success-700"
      : value >= 80
      ? "text-ink-primary"
      : value >= 70
      ? "text-warning-700"
      : "text-danger-700";
  return (
    <div className="inline-flex items-center gap-2 justify-end">
      <div className="relative h-1 w-12 rounded-full bg-subtle overflow-hidden">
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full",
            value >= 90
              ? "bg-success-500"
              : value >= 80
              ? "bg-brand-500"
              : value >= 70
              ? "bg-warning-500"
              : "bg-danger-500"
          )}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={cn("font-mono text-body-sm tabular-nums font-medium", tone)}>{value}%</span>
    </div>
  );
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th
      className={cn(
        "font-medium px-3 py-2.5 first:pl-5 last:pr-5",
        align === "right" && "text-right"
      )}
    >
      {children}
    </th>
  );
}
