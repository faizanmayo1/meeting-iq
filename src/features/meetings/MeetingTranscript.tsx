import { CheckCircle2, ListChecks, ShieldAlert, Sparkles } from "lucide-react";
import type { TranscriptTurn } from "@/mocks/seed/meetings";
import { userById } from "@/mocks/seed/users";
import { cn } from "@/lib/utils";

const KIND = {
  decision: {
    label: "Decision",
    Icon: CheckCircle2,
    pillBg: "bg-success-50 text-success-700 ring-success-500/20",
    accent: "text-success-700",
  },
  action: {
    label: "Action",
    Icon: ListChecks,
    pillBg: "bg-brand-50 text-brand-700 ring-brand-500/20",
    accent: "text-brand-700",
  },
  risk: {
    label: "Risk",
    Icon: ShieldAlert,
    pillBg: "bg-warning-50 text-warning-700 ring-warning-500/20",
    accent: "text-warning-700",
  },
} as const;

export function MeetingTranscript({
  turns,
  highlight,
}: {
  turns: TranscriptTurn[];
  highlight?: boolean;
}) {
  return (
    <ol className="space-y-5">
      {turns.map((turn) => {
        const speaker = userById(turn.speaker);
        const initials = speaker?.initials ?? "??";
        const name = speaker?.name ?? "Speaker";
        const title = speaker?.title ?? "";
        return (
          <li key={turn.id} className="flex gap-3">
            <div className="shrink-0 flex flex-col items-center">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-700 to-accent-700 grid place-items-center text-ink-invert text-[11px] font-semibold">
                {initials}
              </div>
              <span className="mt-1.5 text-[10px] font-mono tabular-nums text-ink-muted">
                {turn.ts}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-body-sm font-medium text-ink-primary">{name}</span>
                <span className="text-[11px] text-ink-muted">{title}</span>
              </div>
              <p className="mt-1 text-body text-ink-secondary leading-relaxed">{turn.text}</p>

              {turn.extracted && turn.extracted.length > 0 && (
                <ul className="mt-2 space-y-1.5">
                  {turn.extracted.map((ex, i) => {
                    const k = KIND[ex.kind];
                    const Icon = k.Icon;
                    const ownerInitials = ex.owner
                      ? userById(ex.owner)?.initials
                      : undefined;
                    return (
                      <li
                        key={i}
                        className={cn(
                          "rounded-lg border p-2.5 transition-colors",
                          highlight
                            ? "border-border-soft bg-subtle/40"
                            : "border-border-soft bg-surface",
                          "hover:border-border"
                        )}
                      >
                        <div className="flex items-start gap-2.5">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-[0.08em] ring-1 ring-inset shrink-0",
                              k.pillBg
                            )}
                          >
                            <Icon className="h-3 w-3" strokeWidth={2.25} />
                            {k.label}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className={cn("text-body-sm font-medium leading-snug", k.accent)}>
                              {ex.label}
                            </p>
                            <div className="mt-1 flex items-center gap-2 flex-wrap text-[11px] text-ink-muted">
                              <span className="inline-flex items-center gap-0.5">
                                <Sparkles className="h-3 w-3 text-accent-500" />
                                <span className="font-mono tabular-nums">
                                  {(ex.confidence * 100).toFixed(0)}%
                                </span>
                                <span className="ml-0.5">conf</span>
                              </span>
                              {ownerInitials && (
                                <>
                                  <span className="text-ink-disabled">·</span>
                                  <span className="inline-flex items-center gap-1">
                                    <span className="h-4 w-4 rounded-full bg-gradient-to-br from-brand-700 to-accent-700 grid place-items-center text-ink-invert text-[8px] font-semibold">
                                      {ownerInitials}
                                    </span>
                                    {userById(ex.owner!)?.name.split(" ")[0]}
                                  </span>
                                </>
                              )}
                              {ex.due && (
                                <>
                                  <span className="text-ink-disabled">·</span>
                                  <span className="font-mono tabular-nums">due {ex.due}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
