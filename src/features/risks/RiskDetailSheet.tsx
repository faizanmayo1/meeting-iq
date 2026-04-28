import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Check,
  Clock,
  DollarSign,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import type { Risk } from "@/mocks/seed/risks";
import { meetingById } from "@/mocks/seed/meetings";
import { decisionById } from "@/mocks/seed/decisions";
import { cn } from "@/lib/utils";

const SEV_TONE = { critical: "danger", warning: "warning", info: "info" } as const;

type Props = { risk: Risk | null; open: boolean; onOpenChange: (v: boolean) => void };

export function RiskDetailSheet({ risk, open, onOpenChange }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  if (!risk) return null;

  const recs = risk.resolutions ?? [];
  const recommended = recs.find((r) => r.recommended);
  const active = recs.find((r) => r.id === selected) ?? recommended ?? recs[0];
  const meeting = risk.meetingId ? meetingById(risk.meetingId) : null;
  const decision = risk.decisionId ? decisionById(risk.decisionId) : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" width="sm:max-w-[600px]" className="flex flex-col p-0">
        <SheetHeader className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge tone={SEV_TONE[risk.severity]} dot size="sm">
              {risk.severity}
            </Badge>
            {risk.dollarImpact != null && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-ink-secondary tabular-nums">
                <DollarSign className="h-3 w-3" />
                ${risk.dollarImpact >= 1_000_000
                  ? `${(risk.dollarImpact / 1_000_000).toFixed(1)}M`
                  : risk.dollarImpact.toLocaleString()}{" "}
                at stake
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-[11px] text-ink-muted">
              <Clock className="h-3 w-3" /> {risk.age} ago
            </span>
          </div>
          <SheetTitle className="!text-h2 leading-tight pr-8">{risk.title}</SheetTitle>
          <p className="text-body-sm text-ink-muted">
            {risk.departments.join(" · ")}
            {meeting && (
              <>
                <span className="mx-1.5">·</span>
                from <span className="text-ink-secondary">{meeting.title}</span>
              </>
            )}
            {decision && (
              <>
                <span className="mx-1.5">·</span>
                touches <span className="text-ink-secondary">{decision.title}</span>
              </>
            )}
          </p>
        </SheetHeader>

        <SheetBody className="flex-1 space-y-5">
          <section className="rounded-lg border border-border-soft bg-subtle/40 p-4">
            <p className="text-caption uppercase tracking-[0.1em] text-ink-muted mb-1.5">
              Why this fired
            </p>
            <p className="text-body text-ink-secondary leading-relaxed">{risk.detail}</p>
          </section>

          {recs.length > 0 ? (
            <section className="ai-edge rounded-xl bg-surface p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-50 text-accent-700 text-[10px] font-medium uppercase tracking-[0.1em]">
                  <Sparkles className="h-3 w-3" /> AI resolution options
                </span>
                <span className="text-body-sm text-ink-muted">
                  {recs.length} option{recs.length === 1 ? "" : "s"} · ranked
                </span>
              </div>
              <div className="space-y-2">
                {recs.map((rec, i) => {
                  const isActive = (active?.id ?? null) === rec.id;
                  return (
                    <button
                      key={rec.id}
                      onClick={() => setSelected(rec.id)}
                      className={cn(
                        "w-full text-left rounded-lg border p-3 transition-all",
                        isActive
                          ? "border-brand-500 bg-brand-50/50 ring-1 ring-brand-500/20"
                          : "border-border-soft bg-surface hover:border-border"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <span className="h-6 w-6 shrink-0 rounded-md bg-subtle text-ink-muted grid place-items-center text-[11px] font-mono">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-body font-medium text-ink-primary">{rec.label}</h4>
                            {rec.recommended && (
                              <span className="text-[10px] uppercase tracking-[0.1em] font-semibold text-accent-700 bg-accent-50 px-1.5 py-0.5 rounded">
                                Recommended
                              </span>
                            )}
                            {rec.destructive && (
                              <span className="text-[10px] uppercase tracking-[0.1em] font-semibold text-danger-700 bg-danger-50 px-1.5 py-0.5 rounded">
                                Last resort
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-body-sm text-ink-muted leading-relaxed">
                            {rec.description}
                          </p>
                        </div>
                        <div
                          className={cn(
                            "h-4 w-4 rounded-full border-2 grid place-items-center shrink-0",
                            isActive ? "border-brand-500 bg-brand-500" : "border-border-strong"
                          )}
                        >
                          {isActive && (
                            <Check className="h-2.5 w-2.5 text-ink-invert" strokeWidth={3} />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          ) : (
            <section className="rounded-lg border border-border-soft p-4">
              <p className="text-caption uppercase tracking-[0.1em] text-ink-muted mb-1.5">Status</p>
              <p className="text-body text-ink-secondary">{risk.resolution}</p>
            </section>
          )}

          <section>
            <h3 className="text-caption uppercase tracking-[0.1em] text-ink-muted mb-2 flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5" /> Activity
            </h3>
            <ol className="relative space-y-3">
              <span className="absolute left-[7px] top-2 bottom-2 w-px bg-border-soft" />
              <Activity dot="bg-accent-500" who="MeetingIQ Agent" time={`${risk.age} ago`}>
                Detected {risk.kind.replace(/_/g, " ")} signal · created risk · ranked {recs.length} resolution
                {recs.length === 1 ? "" : "s"}
              </Activity>
              <Activity dot="bg-brand-500" who="System" time={`${risk.age} ago`}>
                Notified <span className="text-ink-primary font-medium">Stefan Trifan</span> via push +
                Slack <span className="font-mono text-[11px]">#meetings</span>
              </Activity>
              {risk.state !== "open" && (
                <Activity dot="bg-success-500" who="Stefan Trifan" time="2m ago">
                  Reviewed risk · marked in progress
                </Activity>
              )}
            </ol>
          </section>
        </SheetBody>

        <SheetFooter>
          <Button variant="ghost" size="md" onClick={() => onOpenChange(false)}>
            Snooze
          </Button>
          <Button variant="secondary" size="md">
            Assign to owner
          </Button>
          {recs.length > 0 ? (
            <Button variant="ai" size="md" disabled={!active}>
              <Sparkles className="h-4 w-4" />
              Resolve · {active?.label.split(" ").slice(0, 3).join(" ")}…
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="primary" size="md">Mark resolved</Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Activity({
  dot,
  who,
  time,
  children,
}: {
  dot: string;
  who: string;
  time: string;
  children: React.ReactNode;
}) {
  return (
    <li className="relative pl-6">
      <span className={cn("absolute left-0.5 top-1.5 h-3 w-3 rounded-full ring-4 ring-surface", dot)} />
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-body-sm font-medium text-ink-primary">{who}</span>
        <span className="text-[11px] font-mono tabular-nums text-ink-muted">{time}</span>
      </div>
      <p className="text-body-sm text-ink-secondary leading-snug">{children}</p>
    </li>
  );
}
