import { ArrowUpRight, GitMerge, Link2, AlertTriangle } from "lucide-react";
import { StatusBadge } from "@/components/data-display/StatusBadge";
import { Badge } from "@/components/ui/badge";
import type { Decision } from "@/mocks/seed/decisions";
import { meetingById } from "@/mocks/seed/meetings";
import { userById } from "@/mocks/seed/users";
import { cn } from "@/lib/utils";

const IMPACT_TONE = {
  high: "danger",
  medium: "warning",
  low: "info",
} as const;

export function DecisionsTable({ rows }: { rows: Decision[] }) {
  return (
    <div className="overflow-hidden">
      <table className="w-full text-body">
        <thead className="border-b border-border-soft">
          <tr className="text-left text-caption uppercase text-ink-muted tracking-[0.08em]">
            <Th>Decision</Th>
            <Th>Owner</Th>
            <Th>Status</Th>
            <Th>Source meeting</Th>
            <Th>Departments</Th>
            <Th align="right">Action</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((d) => {
            const owner = userById(d.owner);
            const meeting = meetingById(d.meetingId);
            const initials = owner?.initials ?? "??";
            const inConflict = d.status === "conflict";

            return (
              <tr
                key={d.id}
                className={cn(
                  "border-b border-border-soft last:border-b-0 transition-colors group cursor-pointer",
                  inConflict ? "bg-danger-50/30 hover:bg-danger-50/50" : "hover:bg-subtle/40"
                )}
              >
                <td className="px-5 py-3.5">
                  <p className="text-body-sm font-medium text-ink-primary leading-snug">
                    {d.title}
                  </p>
                  <p className="text-[11px] text-ink-muted leading-snug mt-0.5 line-clamp-2">
                    {d.description}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2 text-[11px]">
                    <Badge tone={IMPACT_TONE[d.impact]} size="sm">
                      {d.impact} impact
                    </Badge>
                    {d.conflictWith && (
                      <span className="inline-flex items-center gap-0.5 text-danger-700">
                        <GitMerge className="h-3 w-3" />
                        Conflict
                      </span>
                    )}
                    {d.dependsOn && d.dependsOn.length > 0 && (
                      <span className="inline-flex items-center gap-0.5 text-ink-muted">
                        <Link2 className="h-3 w-3" />
                        {d.dependsOn.length} depend
                      </span>
                    )}
                    {d.alignmentRiskPct != null && d.alignmentRiskPct >= 50 && (
                      <span className="inline-flex items-center gap-0.5 text-warning-700">
                        <AlertTriangle className="h-3 w-3" />
                        align risk {d.alignmentRiskPct}%
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-brand-700 to-accent-700 grid place-items-center text-ink-invert text-[10px] font-semibold">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-body-sm text-ink-primary truncate">
                        {owner?.name ?? "Unassigned"}
                      </p>
                      <p className="text-[11px] text-ink-muted truncate">{owner?.title}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3.5">
                  <StatusBadge status={d.status} />
                </td>
                <td className="px-3 py-3.5 text-body-sm text-ink-secondary">
                  <p className="truncate max-w-[200px]">{meeting?.title ?? "—"}</p>
                  <p className="text-[11px] text-ink-muted truncate">{d.createdAt}</p>
                </td>
                <td className="px-3 py-3.5">
                  <div className="flex flex-wrap items-center gap-1 max-w-[160px]">
                    {d.departments.slice(0, 2).map((dept) => (
                      <span
                        key={dept}
                        className="inline-flex items-center px-1.5 py-0.5 rounded bg-subtle text-[10px] font-medium text-ink-secondary"
                      >
                        {dept}
                      </span>
                    ))}
                    {d.departments.length > 2 && (
                      <span className="text-[10px] text-ink-muted">+{d.departments.length - 2}</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 text-body-sm text-ink-muted">
                    Open
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
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
