import { ArrowUpRight, Sparkles, ExternalLink } from "lucide-react";
import { StatusBadge } from "@/components/data-display/StatusBadge";
import { Badge } from "@/components/ui/badge";
import type { ActionItem } from "@/mocks/seed/actions";
import { meetingById } from "@/mocks/seed/meetings";
import { userById } from "@/mocks/seed/users";
import { cn } from "@/lib/utils";

const PRIORITY_TONE = {
  high: "danger",
  medium: "warning",
  low: "info",
} as const;

export function ActionsTable({ rows }: { rows: ActionItem[] }) {
  return (
    <div className="overflow-hidden">
      <table className="w-full text-body">
        <thead className="border-b border-border-soft">
          <tr className="text-left text-caption uppercase text-ink-muted tracking-[0.08em]">
            <Th>Action item</Th>
            <Th>Owner</Th>
            <Th>Status</Th>
            <Th>Source meeting</Th>
            <Th>Due</Th>
            <Th>Synced to</Th>
            <Th align="right">Action</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((a) => {
            const owner = userById(a.owner);
            const meeting = meetingById(a.meetingId);
            const initials = owner?.initials ?? "??";
            const isOverdue = a.status === "overdue";
            const conf = Math.round(a.confidence * 100);

            return (
              <tr
                key={a.id}
                className={cn(
                  "border-b border-border-soft last:border-b-0 transition-colors group cursor-pointer",
                  isOverdue ? "bg-danger-50/30 hover:bg-danger-50/50" : "hover:bg-subtle/40"
                )}
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm font-medium text-ink-primary leading-snug">
                        {a.title}
                      </p>
                      {a.description && (
                        <p className="text-[11px] text-ink-muted leading-snug mt-0.5 line-clamp-1">
                          {a.description}
                        </p>
                      )}
                      <div className="mt-1 flex items-center gap-2 text-[11px]">
                        <Badge tone={PRIORITY_TONE[a.priority]} size="sm">
                          {a.priority}
                        </Badge>
                        <span className="inline-flex items-center gap-0.5 text-accent-700">
                          <Sparkles className="h-3 w-3" />
                          <span className="font-mono tabular-nums">{conf}%</span>
                        </span>
                      </div>
                    </div>
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
                      <p className="text-[11px] text-ink-muted truncate">{a.ownerDept}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3.5">
                  <StatusBadge status={a.status} />
                </td>
                <td className="px-3 py-3.5 text-body-sm text-ink-secondary">
                  <p className="truncate max-w-[200px]">{meeting?.title ?? "—"}</p>
                  <p className="text-[11px] text-ink-muted truncate">{meeting?.startsAt}</p>
                </td>
                <td className="px-3 py-3.5 text-body-sm">
                  <span
                    className={cn(
                      "font-mono tabular-nums",
                      isOverdue ? "text-danger-700 font-medium" : "text-ink-secondary"
                    )}
                  >
                    {a.due}
                  </span>
                </td>
                <td className="px-3 py-3.5">
                  <div className="flex flex-wrap items-center gap-1">
                    {a.syncedTo?.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center px-1.5 py-0.5 rounded bg-subtle text-[10px] font-medium text-ink-secondary"
                      >
                        {s}
                      </span>
                    ))}
                    {a.externalRef && (
                      <span
                        className="inline-flex items-center gap-0.5 text-[10px] font-mono text-ink-muted"
                        title={a.externalRef}
                      >
                        <ExternalLink className="h-2.5 w-2.5" />
                      </span>
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
