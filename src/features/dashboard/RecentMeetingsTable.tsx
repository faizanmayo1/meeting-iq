import { ArrowUpRight, Sparkles, Users } from "lucide-react";
import { StatusBadge } from "@/components/data-display/StatusBadge";
import { Badge } from "@/components/ui/badge";
import type { Meeting } from "@/mocks/seed/meetings";
import { fourEAvg } from "@/mocks/seed/meetings";
import { cn } from "@/lib/utils";

const IMPACT_TONE = {
  high: "danger",
  medium: "warning",
  low: "info",
} as const;

const IMPACT_LABEL = {
  high: "High impact",
  medium: "Medium",
  low: "Low impact",
} as const;

export function RecentMeetingsTable({
  meetings,
  onOpen,
}: {
  meetings: Meeting[];
  onOpen?: (m: Meeting) => void;
}) {
  return (
    <div className="overflow-hidden">
      <table className="w-full text-body">
        <thead className="border-b border-border-soft">
          <tr className="text-left text-caption uppercase text-ink-muted tracking-[0.08em]">
            <th className="font-medium px-5 py-2.5">Meeting</th>
            <th className="font-medium px-3 py-2.5">When</th>
            <th className="font-medium px-3 py-2.5">Status</th>
            <th className="font-medium px-3 py-2.5 text-right">4E</th>
            <th className="font-medium px-3 py-2.5 text-right">Outcomes</th>
            <th className="font-medium px-5 py-2.5 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {meetings.map((m) => {
            const score = fourEAvg(m.fourE);
            const isLive = m.status === "in_progress";
            return (
              <tr
                key={m.id}
                onClick={() => onOpen?.(m)}
                className="border-b border-border-soft last:border-b-0 cursor-pointer hover:bg-subtle/40 transition-colors group"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-body-sm font-medium text-ink-primary truncate max-w-[260px]">
                      {m.title}
                    </span>
                    {m.flag && (
                      <Badge tone={m.flag.tone} size="sm" dot>
                        {m.flag.label}
                      </Badge>
                    )}
                  </div>
                  <div className="text-[11px] text-ink-muted mt-0.5 inline-flex items-center gap-1.5">
                    <Users className="h-3 w-3" />
                    <span>{m.attendeesCount ?? m.attendees.length} attendees</span>
                    {m.customer && (
                      <>
                        <span className="text-ink-disabled">·</span>
                        <span className="truncate max-w-[180px]">{m.customer}</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3 text-body-sm text-ink-secondary">
                  <span className={cn(isLive && "text-accent-700 font-medium")}>{m.startsAt}</span>
                  <div className="text-[11px] text-ink-muted">{m.duration}</div>
                </td>
                <td className="px-3 py-3">
                  <StatusBadge status={m.status} />
                </td>
                <td className="px-3 py-3 text-right">
                  {m.status === "completed" || isLive ? (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 font-mono text-body-sm tabular-nums font-medium",
                        score >= 80
                          ? "text-success-700"
                          : score >= 70
                          ? "text-ink-primary"
                          : "text-warning-700"
                      )}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                      {score}
                    </span>
                  ) : m.preMeetingScore != null ? (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 font-mono text-body-sm tabular-nums font-medium",
                        m.preMeetingScore >= 70 ? "text-success-700" : "text-danger-700"
                      )}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                      {m.preMeetingScore}
                      <span className="text-[10px] opacity-60 normal-case">pre</span>
                    </span>
                  ) : (
                    <span className="text-ink-muted text-body-sm">—</span>
                  )}
                </td>
                <td className="px-3 py-3 text-right">
                  <div className="flex items-center gap-2 justify-end text-[11px] text-ink-muted tabular-nums">
                    <Stat n={m.decisionsCount} label="dec" />
                    <Stat n={m.actionsCount} label="act" />
                    <Stat n={m.risksCount} label="risk" tone={m.risksCount > 0 ? "warn" : undefined} />
                  </div>
                </td>
                <td className="px-5 py-3 text-right">
                  {m.flag?.tone === "danger" || m.flag?.tone === "warning" ? (
                    <span className="inline-flex items-center gap-1 text-body-sm font-medium text-accent-700 px-2 py-1 rounded-md bg-accent-50">
                      <Sparkles className="h-3.5 w-3.5" />
                      AI fix
                    </span>
                  ) : (
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 text-body-sm text-ink-muted">
                      Open
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Stat({ n, label, tone }: { n: number; label: string; tone?: "warn" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-subtle",
        tone === "warn" && n > 0 && "bg-warning-50 text-warning-700"
      )}
    >
      <span className="font-medium">{n}</span>
      <span className="opacity-70">{label}</span>
    </span>
  );
}
