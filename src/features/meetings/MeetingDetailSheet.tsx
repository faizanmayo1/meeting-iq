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
import { StatusBadge } from "@/components/data-display/StatusBadge";
import { FourERadar } from "@/features/dashboard/FourERadar";
import { MeetingTranscript } from "./MeetingTranscript";
import {
  CalendarDays,
  Clock,
  Users,
  Building2,
  Sparkles,
  ArrowRight,
  Mic,
  FileText,
  Check,
  CheckCircle2,
  ListChecks,
  ShieldAlert,
  Repeat,
} from "lucide-react";
import type { Meeting } from "@/mocks/seed/meetings";
import { fourEAvg } from "@/mocks/seed/meetings";
import { userById } from "@/mocks/seed/users";
import { ACTIONS } from "@/mocks/seed/actions";
import { DECISIONS } from "@/mocks/seed/decisions";
import { RISKS } from "@/mocks/seed/risks";
import { cn } from "@/lib/utils";

type Props = {
  meeting: Meeting | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

type FixOption = {
  id: string;
  label: string;
  description: string;
  recommended?: boolean;
};

function suggestionsFor(meeting: Meeting): { headline: string; body: string; options: FixOption[] } | null {
  // Hero meeting: engagement drop → restructure
  if (meeting.id === "m-q3-roll-w11") {
    return {
      headline: "Recover engagement next session",
      body:
        "Speaker imbalance and decision-points-at-the-end pattern detected. Three fixes will project the next session's score back to ~88.",
      options: [
        {
          id: "restructure",
          label: "Apply AI agenda restructure",
          description:
            "Move 2 status updates to async, add explicit decision points, set 3-min round-robin for cross-team input.",
          recommended: true,
        },
        {
          id: "split",
          label: "Split into 2 shorter meetings",
          description: "Decision meeting (30 min) + working session (45 min).",
        },
        {
          id: "ignore",
          label: "Mark as one-off",
          description: "Likely caused by today's specific conflict — re-evaluate next week.",
        },
      ],
    };
  }
  // Upcoming meeting with low pre-meeting score → coach
  if (meeting.preMeetingScore != null && meeting.preMeetingScore < 60) {
    return {
      headline: `Improve pre-meeting score · ${meeting.preMeetingScore} → projected 78`,
      body:
        "Agenda lacks decision owners, missing the InfoSec stakeholder, and over-budgets discussion time. AI suggests 3 fixes before the invite is sent.",
      options: [
        {
          id: "fix-agenda",
          label: "Apply 3 AI agenda fixes",
          description:
            "Assign decision owners, add InfoSec stakeholder, swap 15 min status for async pre-read.",
          recommended: true,
        },
        {
          id: "add-stakeholder",
          label: "Only add missing stakeholder",
          description: "Send InfoSec lead the invite. Re-score after.",
        },
        {
          id: "send-as-is",
          label: "Send as-is",
          description: "Override AI guidance. Risk score remains 42.",
        },
      ],
    };
  }
  return null;
}

export function MeetingDetailSheet({ meeting, open, onOpenChange }: Props) {
  const [tab, setTab] = useState<"transcript" | "outcomes" | "analytics">("transcript");
  const [selectedFix, setSelectedFix] = useState<string | null>(null);

  if (!meeting) return null;

  const organizer = userById(meeting.organizer);
  const organizerInitials = organizer?.initials ?? "??";
  const meetingActions = ACTIONS.filter((a) => a.meetingId === meeting.id);
  const meetingDecisions = DECISIONS.filter((d) => d.meetingId === meeting.id);
  const meetingRisks = RISKS.filter((r) => r.meetingId === meeting.id);

  const score = fourEAvg(meeting.fourE);
  const isCompleted = meeting.status === "completed" || meeting.status === "in_progress";
  const suggestion = suggestionsFor(meeting);
  const activeFix =
    suggestion?.options.find((o) => o.id === selectedFix) ??
    suggestion?.options.find((o) => o.recommended) ??
    suggestion?.options[0];

  const tabs: Array<{ key: typeof tab; label: string; count?: number }> = [
    { key: "transcript", label: "Transcript", count: meeting.transcript?.length },
    {
      key: "outcomes",
      label: "Outcomes",
      count: meetingDecisions.length + meetingActions.length + meetingRisks.length,
    },
    { key: "analytics", label: "Analytics" },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" width="sm:max-w-[680px]" className="flex flex-col p-0">
        <SheetHeader className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={meeting.status} />
            {meeting.flag && (
              <Badge tone={meeting.flag.tone} size="sm" dot>
                {meeting.flag.label}
              </Badge>
            )}
            {meeting.series && (
              <span className="inline-flex items-center gap-1 text-[11px] text-ink-muted">
                <Repeat className="h-3 w-3" />
                Recurring
              </span>
            )}
          </div>
          <SheetTitle className="!text-h2 leading-tight pr-8">{meeting.title}</SheetTitle>
          <div className="flex items-center gap-3 flex-wrap text-body-sm text-ink-muted">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {meeting.startsAt}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {meeting.duration}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {meeting.attendeesCount ?? meeting.attendees.length} attendees
            </span>
            {meeting.customer && (
              <span className="inline-flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                {meeting.customer}
              </span>
            )}
          </div>
        </SheetHeader>

        <SheetBody className="flex-1 space-y-5">
          {/* Quick facts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Fact
              label="Organizer"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-5 w-5 rounded-full bg-gradient-to-br from-brand-700 to-accent-700 grid place-items-center text-ink-invert text-[9px] font-semibold">
                    {organizerInitials}
                  </span>
                  {organizer?.name.split(" ")[0] ?? "—"}
                </span>
              }
              sub={organizer?.title}
            />
            <Fact
              label={isCompleted ? "4E score" : "Pre-meeting"}
              value={isCompleted ? score : meeting.preMeetingScore ?? "—"}
              sub={isCompleted ? "this session" : "predicted impact"}
              tone={
                isCompleted
                  ? score >= 80
                    ? "success"
                    : score >= 70
                    ? "neutral"
                    : "warning"
                  : (meeting.preMeetingScore ?? 0) >= 70
                  ? "success"
                  : "danger"
              }
            />
            <Fact label="Decisions" value={meeting.decisionsCount} sub="extracted" />
            <Fact
              label="Risks"
              value={meeting.risksCount}
              sub={meeting.risksCount > 0 ? "needs attention" : "all clear"}
              tone={meeting.risksCount > 0 ? "warning" : "success"}
            />
          </div>

          {/* AI Suggestion */}
          {suggestion && (
            <section className="ai-edge rounded-xl bg-surface p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-50 text-accent-700 text-[10px] font-medium uppercase tracking-[0.1em]">
                  <Sparkles className="h-3 w-3" /> AI suggestion
                </span>
                <span className="text-body-sm text-ink-muted">{suggestion.options.length} options · ranked</span>
              </div>
              <h3 className="text-h3 text-ink-primary leading-tight mb-1">{suggestion.headline}</h3>
              <p className="text-body-sm text-ink-muted leading-relaxed mb-3">{suggestion.body}</p>
              <div className="space-y-2">
                {suggestion.options.map((opt, i) => {
                  const isActive = (activeFix?.id ?? null) === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedFix(opt.id)}
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
                            <h4 className="text-body font-medium text-ink-primary">{opt.label}</h4>
                            {opt.recommended && (
                              <span className="text-[10px] uppercase tracking-[0.1em] font-semibold text-accent-700 bg-accent-50 px-1.5 py-0.5 rounded">
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-body-sm text-ink-muted leading-relaxed">
                            {opt.description}
                          </p>
                        </div>
                        <div
                          className={cn(
                            "h-4 w-4 rounded-full border-2 grid place-items-center shrink-0",
                            isActive ? "border-brand-500 bg-brand-500" : "border-border-strong"
                          )}
                        >
                          {isActive && <Check className="h-2.5 w-2.5 text-ink-invert" strokeWidth={3} />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* Tab nav */}
          <div className="flex items-center gap-1 border-b border-border-soft -mb-1">
            {tabs.map((t) => {
              const isActive = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "relative h-9 px-3 inline-flex items-center gap-1.5 text-body-sm font-medium transition-colors",
                    isActive ? "text-ink-primary" : "text-ink-muted hover:text-ink-secondary"
                  )}
                >
                  {t.label}
                  {t.count != null && (
                    <span
                      className={cn(
                        "tabular-nums text-[11px] px-1.5 rounded",
                        isActive ? "bg-brand-50 text-brand-700" : "bg-subtle text-ink-muted"
                      )}
                    >
                      {t.count}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-500 rounded-t" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          {tab === "transcript" && (
            <section>
              {meeting.transcript && meeting.transcript.length > 0 ? (
                <>
                  <p className="text-[11px] text-ink-muted mb-3">
                    AI extracted{" "}
                    <span className="font-medium text-accent-700">
                      {meeting.transcript.reduce((s, t) => s + (t.extracted?.length ?? 0), 0)}
                    </span>{" "}
                    items from this conversation. Click any pill to review or edit.
                  </p>
                  <MeetingTranscript turns={meeting.transcript} highlight />
                </>
              ) : (
                <div className="rounded-lg border border-border-soft bg-subtle/40 p-6 text-center">
                  <FileText className="mx-auto h-7 w-7 text-ink-muted" strokeWidth={1.5} />
                  <p className="mt-2 text-body-sm text-ink-secondary font-medium">
                    Transcript not available yet
                  </p>
                  <p className="mt-1 text-[11px] text-ink-muted">
                    {meeting.status === "upcoming"
                      ? "Meeting hasn't started. Live capture begins automatically."
                      : "Recording is being processed."}
                  </p>
                </div>
              )}
            </section>
          )}

          {tab === "outcomes" && (
            <section className="space-y-4">
              <OutcomeSection
                title="Decisions"
                Icon={CheckCircle2}
                tone="text-success-700 bg-success-50"
                items={meetingDecisions.map((d) => ({
                  id: d.id,
                  label: d.title,
                  meta: `${d.status} · owner ${userById(d.owner)?.name.split(" ")[0]}`,
                }))}
              />
              <OutcomeSection
                title="Action items"
                Icon={ListChecks}
                tone="text-brand-700 bg-brand-50"
                items={meetingActions.map((a) => ({
                  id: a.id,
                  label: a.title,
                  meta: `${a.status} · ${userById(a.owner)?.name.split(" ")[0]} · due ${a.due}`,
                }))}
              />
              <OutcomeSection
                title="Risks"
                Icon={ShieldAlert}
                tone="text-warning-700 bg-warning-50"
                items={meetingRisks.map((r) => ({
                  id: r.id,
                  label: r.title,
                  meta: r.severity,
                }))}
              />
            </section>
          )}

          {tab === "analytics" && (
            <section className="space-y-4">
              {isCompleted ? (
                <div className="rounded-lg border border-border-soft bg-surface p-3">
                  <p className="text-caption uppercase tracking-[0.1em] text-ink-muted mb-2">
                    4E breakdown
                  </p>
                  <FourERadar current={meeting.fourE} previous={meeting.fourEPrev} height={220} />
                </div>
              ) : (
                <div className="rounded-lg border border-border-soft bg-subtle/40 p-6 text-center">
                  <p className="text-body-sm text-ink-secondary">
                    Analytics available after the meeting completes.
                  </p>
                </div>
              )}
            </section>
          )}
        </SheetBody>

        <SheetFooter>
          <Button variant="ghost" size="md" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {meeting.status === "completed" && (
            <Button variant="secondary" size="md">
              <Mic className="h-4 w-4" />
              Open recording
            </Button>
          )}
          {suggestion ? (
            <Button variant="ai" size="md" disabled={!activeFix}>
              <Sparkles className="h-4 w-4" />
              Apply &amp; notify owners
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="primary" size="md">
              Generate AI summary
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Fact({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  tone?: "success" | "warning" | "danger" | "neutral";
}) {
  return (
    <div className="rounded-lg bg-subtle/60 border border-border-soft p-3">
      <p className="text-caption uppercase tracking-[0.1em] text-ink-muted">{label}</p>
      <div
        className={cn(
          "mt-1 text-body font-medium tabular-nums",
          tone === "success" && "text-success-700",
          tone === "warning" && "text-warning-700",
          tone === "danger" && "text-danger-700",
          (!tone || tone === "neutral") && "text-ink-primary"
        )}
      >
        {value}
      </div>
      {sub && <p className="text-[11px] text-ink-muted mt-0.5 truncate">{sub}</p>}
    </div>
  );
}

function OutcomeSection({
  title,
  Icon,
  tone,
  items,
}: {
  title: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number | string }>;
  tone: string;
  items: Array<{ id: string; label: string; meta: string }>;
}) {
  return (
    <div>
      <h4 className="flex items-center gap-2 text-caption uppercase tracking-[0.1em] text-ink-muted mb-2">
        <span className={cn("h-5 w-5 grid place-items-center rounded", tone)}>
          <Icon className="h-3 w-3" strokeWidth={2.25} />
        </span>
        {title} · {items.length}
      </h4>
      {items.length === 0 ? (
        <p className="text-body-sm text-ink-muted px-1">None extracted from this meeting.</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((it) => (
            <li
              key={it.id}
              className="flex items-start gap-2 rounded-md border border-border-soft bg-surface p-2.5 hover:border-border transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-body-sm text-ink-primary leading-snug">{it.label}</p>
                <p className="text-[11px] text-ink-muted capitalize mt-0.5">{it.meta}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
