import {
  Sparkles,
  GraduationCap,
  CalendarDays,
  Users,
  ListChecks,
  AlertTriangle,
  ArrowRight,
  Check,
  Plus,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardCaption, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatTile } from "@/components/data-display/StatTile";
import { MEETINGS, fourEAvg } from "@/mocks/seed/meetings";
import { userById } from "@/mocks/seed/users";
import { cn } from "@/lib/utils";

type Suggestion = { kind: "add" | "remove" | "convert"; label: string };

type CoachedMeeting = {
  id: string;
  preMeetingScore: number;
  projectedScore: number;
  patterns: string[];
  fixes: Suggestion[];
};

const COACHED: CoachedMeeting[] = [
  {
    id: "m-rollout-prep",
    preMeetingScore: 42,
    projectedScore: 78,
    patterns: [
      "Agenda lacks decision owners (3 items)",
      "Missing required stakeholder · InfoSec lead",
      "Discussion-time over-budgeted by 18 min",
    ],
    fixes: [
      { kind: "add",     label: "Assign decision owners to all 3 agenda items" },
      { kind: "add",     label: "Add InfoSec lead as required attendee" },
      { kind: "convert", label: "Swap 15-min status update for async pre-read" },
      { kind: "remove",  label: "Remove tangent discussion · move to next session" },
    ],
  },
];

export default function CoachPage() {
  const upcoming = MEETINGS.filter((m) => m.status === "upcoming");
  const heroMeeting = MEETINGS.find((m) => m.id === "m-rollout-prep")!;
  const heroCoach = COACHED.find((c) => c.id === heroMeeting.id)!;
  const organizer = userById(heroMeeting.organizer);

  const completed = MEETINGS.filter((m) => m.status === "completed");
  const avgScore = Math.round(
    completed.reduce((s, m) => s + fourEAvg(m.fourE), 0) / Math.max(1, completed.length)
  );

  return (
    <div className="px-6 lg:px-8 py-6 lg:py-8 max-w-[1440px] mx-auto space-y-6 reveal-stack">
      <PageHeader
        title="AI Coach"
        subtitle="Pre, during, and post-meeting prompts — tuned to role and meeting type."
        actions={
          <>
            <Button variant="secondary" size="md">
              Coaching history
            </Button>
            <Button variant="ai" size="md">
              <Sparkles className="h-4 w-4" />
              Coach a meeting
            </Button>
          </>
        }
      />

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile
          label="Upcoming meetings"
          value={upcoming.length}
          note={`${COACHED.length} flagged for coaching`}
          icon={<CalendarDays className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="Avg coached lift"
          value="+18 pts"
          note="4E score after AI agenda fixes"
          tone="success"
          icon={<GraduationCap className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="Pre-meeting fixes applied"
          value="42"
          note="this quarter · 88% acceptance"
          tone="accent"
        />
        <StatTile
          label="Fleet 4E avg"
          value={avgScore}
          note="across completed sessions"
          tone={avgScore >= 80 ? "success" : "warning"}
        />
      </section>

      {/* Hero coached meeting */}
      <Card className="ai-edge overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          <div className="lg:col-span-2 p-5 lg:p-6 border-b lg:border-b-0 lg:border-r border-border-soft">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <Badge tone="warning" dot size="sm">
                Coaching opportunity · top of queue
              </Badge>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-50 text-accent-700 text-[10px] font-medium uppercase tracking-[0.1em]">
                <Sparkles className="h-3 w-3" /> AI ready
              </span>
              <span className="text-[11px] text-ink-muted">{heroMeeting.startsAt}</span>
            </div>
            <h2 className="font-display text-h2 text-ink-primary tracking-tight leading-tight">
              {heroMeeting.title}
            </h2>
            <p className="mt-2 text-body text-ink-muted leading-relaxed max-w-xl">
              Tomorrow's prep meeting is projected to produce ≤ 1 actionable outcome unless the agenda is
              restructured before the invite goes out. Three patterns flagged.
            </p>
            <div className="mt-3 flex items-center flex-wrap gap-3 text-body-sm">
              <span className="text-ink-secondary inline-flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                Organizer <span className="text-ink-primary font-medium">{organizer?.name}</span>
              </span>
              <span className="text-ink-disabled">·</span>
              <span className="text-ink-secondary">{heroMeeting.duration}</span>
              <span className="text-ink-disabled">·</span>
              <span className="text-ink-secondary">{heroMeeting.attendeesCount ?? heroMeeting.attendees.length} attendees</span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <ScoreTile label="Current score" value={heroCoach.preMeetingScore} tone="danger" />
              <ScoreTile
                label="Projected after fixes"
                value={heroCoach.projectedScore}
                tone="success"
                arrow
              />
            </div>
          </div>
          <div className="p-5 lg:p-6 flex flex-col gap-4">
            <div>
              <p className="text-caption uppercase tracking-[0.1em] text-ink-muted mb-2">
                Patterns detected
              </p>
              <ul className="space-y-1.5">
                {heroCoach.patterns.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-body-sm text-ink-secondary leading-snug">
                    <AlertTriangle className="h-3.5 w-3.5 text-warning-500 shrink-0 mt-0.5" strokeWidth={2.25} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto flex flex-col sm:flex-row gap-2">
              <Button variant="ai" size="md">
                <Check className="h-4 w-4" />
                Apply all fixes
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="md">
                Review fixes
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Suggested fixes */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardCaption>AI-recommended fixes</CardCaption>
          <CardTitle className="mt-1">
            {heroCoach.fixes.length} agenda changes for {heroMeeting.title}
          </CardTitle>
        </CardHeader>
        <ul className="px-5 pb-5 space-y-2">
          {heroCoach.fixes.map((f, i) => (
            <FixRow key={i} fix={f} index={i + 1} />
          ))}
        </ul>
      </Card>

      {/* Other upcoming meetings */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-end justify-between gap-3">
          <div>
            <CardCaption>Upcoming meetings</CardCaption>
            <CardTitle className="mt-1">Other sessions in your week</CardTitle>
          </div>
          <Badge tone="info" size="sm" dot>
            {upcoming.length} scheduled
          </Badge>
        </CardHeader>
        <ul className="divide-y divide-border-soft">
          {upcoming.map((m) => {
            const score = m.preMeetingScore ?? 0;
            const tone =
              score >= 80
                ? "success"
                : score >= 60
                ? "neutral"
                : "danger";
            return (
              <li key={m.id} className="flex items-center gap-3 px-5 py-3 hover:bg-subtle/40 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm font-medium text-ink-primary truncate">{m.title}</p>
                  <p className="text-[11px] text-ink-muted">
                    {m.startsAt} · {userById(m.organizer)?.name} · {m.attendeesCount ?? m.attendees.length} attendees
                  </p>
                </div>
                <span
                  className={cn(
                    "font-mono text-body-sm tabular-nums font-medium px-2 py-0.5 rounded",
                    tone === "success" && "text-success-700 bg-success-50",
                    tone === "neutral" && "text-ink-primary bg-subtle",
                    tone === "danger" && "text-danger-700 bg-danger-50"
                  )}
                >
                  {score}
                  <span className="text-[10px] opacity-60 ml-0.5 normal-case">pre</span>
                </span>
                <Button variant="ghost" size="sm">
                  Coach
                </Button>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}

function ScoreTile({
  label,
  value,
  tone,
  arrow,
}: {
  label: string;
  value: number;
  tone: "danger" | "success";
  arrow?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg p-3 ring-1 ring-inset",
        tone === "danger" ? "bg-danger-50/60 ring-danger-500/20" : "bg-success-50/60 ring-success-500/20"
      )}
    >
      <p className="text-caption uppercase tracking-[0.1em] text-ink-muted">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <span
          className={cn(
            "text-kpi-sm tabular-nums",
            tone === "danger" ? "text-danger-700" : "text-success-700"
          )}
        >
          {value}
        </span>
        {arrow && (
          <span className="inline-flex items-center text-[11px] text-success-700 font-medium">
            <ArrowRight className="h-3 w-3" />
          </span>
        )}
      </div>
    </div>
  );
}

function FixRow({ fix, index }: { fix: Suggestion; index: number }) {
  const Icon = fix.kind === "add" ? Plus : fix.kind === "remove" ? X : ArrowRight;
  const tone =
    fix.kind === "add"
      ? "bg-success-50 text-success-700"
      : fix.kind === "remove"
      ? "bg-danger-50 text-danger-700"
      : "bg-brand-50 text-brand-700";
  return (
    <li className="rounded-lg border border-border-soft bg-surface p-3 flex items-start gap-3">
      <span className="h-6 w-6 shrink-0 rounded-md bg-subtle text-ink-muted grid place-items-center text-[11px] font-mono">
        {index}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-[0.08em]",
              tone
            )}
          >
            <Icon className="h-3 w-3" strokeWidth={2.25} />
            <span className="capitalize">{fix.kind}</span>
          </span>
          <ListChecks className="h-3 w-3 text-ink-disabled" />
        </div>
        <p className="mt-1 text-body-sm text-ink-primary leading-snug">{fix.label}</p>
      </div>
      <Button variant="ghost" size="sm">
        Apply
      </Button>
    </li>
  );
}
