import {
  Gauge,
  Clock,
  Layers,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardCaption, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatTile } from "@/components/data-display/StatTile";
import { TrendChart } from "@/components/data-display/TrendChart";
import { DeptVelocityTable } from "@/features/velocity/DeptVelocityTable";
import { DEPT_VELOCITY, VELOCITY_12W } from "@/mocks/seed/velocity";

const SERIES = [
  { key: "followThrough",   label: "Follow-through %", color: "hsl(var(--success-500))" },
  { key: "decisionVelocity", label: "Decision velocity", color: "hsl(var(--brand-500))" },
  { key: "fourE",           label: "Avg 4E score",     color: "hsl(var(--accent-500))" },
];

export default function VelocityPage() {
  // The story: Product team's bottleneck.
  const overload = DEPT_VELOCITY.find((d) => d.flag?.tone === "warning");
  const leader = DEPT_VELOCITY.find((d) => d.flag?.tone === "accent");

  // KPI summary across the company
  const avgFollowThrough = Math.round(
    DEPT_VELOCITY.reduce((s, d) => s + d.followThroughPct, 0) / DEPT_VELOCITY.length
  );
  const avgTimeToTask = Math.round(
    DEPT_VELOCITY.reduce((s, d) => s + d.avgMeetingToTaskMin, 0) / DEPT_VELOCITY.length
  );
  const totalMeetings = DEPT_VELOCITY.reduce((s, d) => s + d.meetingsPerWeek, 0);
  const overdueAvg = Math.round(
    DEPT_VELOCITY.reduce((s, d) => s + d.overduePct, 0) / DEPT_VELOCITY.length
  );

  return (
    <div className="px-6 lg:px-8 py-6 lg:py-8 max-w-[1440px] mx-auto space-y-6 reveal-stack">
      <PageHeader
        title="Execution Velocity"
        subtitle="How fast your teams turn conversation into outcome — meeting → task → completion."
        actions={
          <>
            <Button variant="secondary" size="md">
              Last 12 weeks
            </Button>
            <Button variant="ai" size="md">
              <Sparkles className="h-4 w-4" />
              AI bottleneck scan
            </Button>
          </>
        }
      />

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile
          label="Avg follow-through"
          value={`${avgFollowThrough}%`}
          note="actions completed by due date"
          tone={avgFollowThrough >= 80 ? "success" : "warning"}
          icon={<Gauge className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="Time-to-task"
          value={`${avgTimeToTask}m`}
          note="avg from meeting end → task created"
          tone="success"
          icon={<Clock className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="Meetings / week"
          value={totalMeetings}
          note="across 8 departments"
          icon={<Layers className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="Overdue rate"
          value={`${overdueAvg}%`}
          note="company-wide · ↓ 3.4 pts"
          tone={overdueAvg <= 10 ? "success" : overdueAvg <= 15 ? "neutral" : "warning"}
          icon={<AlertTriangle className="h-3.5 w-3.5" />}
        />
      </section>

      {/* Hero: bottleneck story */}
      {overload && leader && (
        <Card className="ai-edge overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            <div className="lg:col-span-2 p-5 lg:p-6 border-b lg:border-b-0 lg:border-r border-border-soft">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <Badge tone="warning" dot size="sm">
                  Bottleneck detected
                </Badge>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-50 text-accent-700 text-[10px] font-medium uppercase tracking-[0.1em]">
                  <Sparkles className="h-3 w-3" /> AI insight
                </span>
              </div>
              <h2 className="font-display text-h2 text-ink-primary tracking-tight leading-tight">
                {overload.department} team · 40% more meeting time, fewer completed actions
              </h2>
              <p className="mt-2 text-body text-ink-muted leading-relaxed max-w-2xl">
                {overload.department} runs <span className="text-ink-primary font-medium">{overload.meetingsPerWeek}</span> meetings per week (company avg{" "}
                <span className="text-ink-primary font-medium">14</span>) yet has the slowest
                decision-to-completion at{" "}
                <span className="text-ink-primary font-medium">{overload.avgDecisionToCompletionDays.toFixed(1)} days</span>.
                Two recurring meetings are candidates for consolidation; ownership clarity has slipped to{" "}
                <span className="text-warning-700 font-medium">{overload.ownershipClarityPct}%</span>.
              </p>
              <div className="mt-3 flex items-center flex-wrap gap-3 text-body-sm">
                <span className="text-ink-secondary">
                  Compare with{" "}
                  <span className="font-medium text-success-700">{leader.department}</span> —
                  {" "}
                  <span className="font-mono">{leader.followThroughPct}%</span> follow-through,
                  {" "}
                  <span className="font-mono">{leader.avgDecisionToCompletionDays.toFixed(1)}d</span> close
                </span>
                <span className="text-ink-disabled">·</span>
                <span className="text-success-700 font-medium">
                  ~6 hr/wk per IC reclaimable
                </span>
              </div>
            </div>
            <div className="p-5 lg:p-6 flex flex-col justify-between gap-4">
              <div>
                <p className="text-caption uppercase tracking-[0.1em] text-ink-muted">
                  AI recommended action
                </p>
                <p className="mt-1 text-body font-medium text-ink-primary leading-snug">
                  Consolidate 2 recurring meetings · enforce decision-owner template
                </p>
                <p className="mt-1 text-body-sm text-ink-muted leading-relaxed">
                  Auto-converts the engineering retro to async (already accepted) and merges the two product strategy
                  syncs into a single decision-only session.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="ai" size="md">
                  <TrendingUp className="h-4 w-4" />
                  Apply consolidation
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="md">
                  See per-team detail
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Trend lines */}
      <Card>
        <CardHeader className="flex flex-row items-end justify-between gap-3">
          <div>
            <CardCaption>Velocity · 12 weeks</CardCaption>
            <CardTitle className="mt-1">Follow-through, decision velocity, 4E score</CardTitle>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            {SERIES.map((s) => (
              <span key={s.key} className="inline-flex items-center gap-1 text-ink-muted">
                <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                {s.label}
              </span>
            ))}
          </div>
        </CardHeader>
        <div className="px-5 pb-5">
          <TrendChart
            data={VELOCITY_12W}
            xKey="week"
            series={SERIES}
            height={260}
            formatY={(v) => `${v.toFixed(0)}`}
          />
        </div>
      </Card>

      {/* Department comparison table */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-end justify-between gap-3">
          <div>
            <CardCaption>Per-department velocity</CardCaption>
            <CardTitle className="mt-1">8 departments · ranked by follow-through</CardTitle>
          </div>
          <Badge tone="info" size="sm" dot>
            Updated 4s ago
          </Badge>
        </CardHeader>
        <DeptVelocityTable rows={[...DEPT_VELOCITY].sort((a, b) => b.followThroughPct - a.followThroughPct)} />
      </Card>
    </div>
  );
}
