import { ArrowUpRight, Sparkles, Users, Repeat } from "lucide-react";
import { StatusBadge } from "@/components/data-display/StatusBadge";
import { Badge } from "@/components/ui/badge";
import type { Meeting } from "@/mocks/seed/meetings";
import { fourEAvg } from "@/mocks/seed/meetings";
import { userById } from "@/mocks/seed/users";
import { cn } from "@/lib/utils";

export function MeetingsTable({
  meetings,
  onOpen,
}: {
  meetings: Meeting[];
  onOpen: (m: Meeting) => void;
}) {
  return (
    <div className="overflow-hidden">
      <table className="w-full text-body">
        <thead className="border-b border-border-soft">
          <tr className="text-left text-caption uppercase text-ink-muted tracking-[0.08em]">
            <Th>Meeting · organizer</Th>
            <Th>When · duration</Th>
            <Th>Status</Th>
            <Th>Departments</Th>
            <Th align="right">Score</Th>
            <Th align="right">Outcomes</Th>
            <Th align="right">Action</Th>
          </tr>
        </thead>
        <tbody>
          {meetings.map((m) => {
            const score = fourEAvg(m.fourE);
            const isLive = m.status === "in_progress";
            const isCompleted = m.status === "completed" || isLive;
            const organizer = userById(m.organizer);
            const initials = organizer?.initials ?? "??";

            return (
              <tr
                key={m.id}
                onClick={() => onOpen(m)}
                className="border-b border-border-soft last:border-b-0 cursor-pointer hover:bg-subtle/40 transition-colors group"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-start gap-2.5">
                    <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-brand-700 to-accent-700 grid place-items-center text-ink-invert text-[10px] font-semibold">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-body-sm font-medium text-ink-primary truncate max-w-[260px]">
                          {m.title}
                        </span>
                        {m.series && (
                          <Repeat className="h-3 w-3 text-ink-muted" strokeWidth={2} />
                        )}
                        {m.flag && (
                          <Badge tone={m.flag.tone} size="sm" dot>
                            {m.flag.label}
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-ink-muted mt-0.5 truncate">
                        {organizer?.name}
                        {m.customer && (
                          <>
                            <span className="mx-1.5 text-ink-disabled">·</span>
                            {m.customer}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3.5 text-body-sm text-ink-secondary">
                  <div className={cn(isLive && "text-accent-700 font-medium")}>{m.startsAt}</div>
                  <div className="text-[11px] text-ink-muted">{m.duration}</div>
                </td>
                <td className="px-3 py-3.5">
                  <StatusBadge status={m.status} />
                </td>
                <td className="px-3 py-3.5">
                  <div className="flex items-center gap-1 text-[11px] text-ink-muted">
                    <Users className="h-3 w-3" />
                    <span>{m.attendeesCount ?? m.attendees.length}</span>
                    {m.departments.length > 0 && (
                      <span className="ml-1 truncate max-w-[140px]">
                        · {m.departments.slice(0, 2).join(", ")}
                        {m.departments.length > 2 && ` +${m.departments.length - 2}`}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3.5 text-right">
                  {isCompleted ? (
                    <ScoreChip score={score} />
                  ) : m.preMeetingScore != null ? (
                    <ScoreChip score={m.preMeetingScore} pre />
                  ) : (
                    <span className="text-ink-muted text-body-sm">—</span>
                  )}
                </td>
                <td className="px-3 py-3.5 text-right">
                  <div className="flex items-center gap-1.5 justify-end text-[11px] tabular-nums text-ink-muted">
                    <Stat n={m.decisionsCount} label="dec" />
                    <Stat n={m.actionsCount} label="act" />
                    <Stat n={m.risksCount} label="risk" warn />
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right">
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

function ScoreChip({ score, pre }: { score: number; pre?: boolean }) {
  const tone =
    score >= 80
      ? "text-success-700 bg-success-50"
      : score >= 65
      ? "text-ink-primary bg-subtle"
      : "text-warning-700 bg-warning-50";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-mono text-body-sm tabular-nums font-medium",
        tone
      )}
    >
      {score}
      {pre && <span className="text-[10px] opacity-60 normal-case">pre</span>}
    </span>
  );
}

function Stat({ n, label, warn }: { n: number; label: string; warn?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-subtle",
        warn && n > 0 && "bg-warning-50 text-warning-700"
      )}
    >
      <span className="font-medium">{n}</span>
      <span className="opacity-70">{label}</span>
    </span>
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
