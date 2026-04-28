import {
  CalendarDays,
  Download,
  Sparkles,
  ArrowRight,
  GitMerge,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardCaption, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/data-display/KPICard";
import { TrendChart } from "@/components/data-display/TrendChart";
import { AIInsightCard } from "@/components/ai/AIInsightCard";

import { CopilotPromptBar } from "@/features/dashboard/CopilotPromptBar";
import { FourERadar } from "@/features/dashboard/FourERadar";
import { RecentMeetingsTable } from "@/features/dashboard/RecentMeetingsTable";
import { DepartmentVelocityStrip } from "@/features/dashboard/DepartmentVelocityStrip";

import { KPIS } from "@/mocks/seed/kpis";
import { INSIGHTS } from "@/mocks/seed/insights";
import { MEETINGS, HERO_MEETING, fourEAvg } from "@/mocks/seed/meetings";
import { RISKS } from "@/mocks/seed/risks";
import { DEPT_VELOCITY, VELOCITY_12W } from "@/mocks/seed/velocity";
import { TENANT } from "@/mocks/seed/users";

export default function DashboardPage() {
  // Hero risk for the spotlight card — the marquee alignment conflict.
  const heroRisk = RISKS.find((r) => r.id === "r-priority-conflict")!;
  const heroFix = heroRisk.resolutions?.find((r) => r.recommended);

  // Recent meetings (top 5 most recent, mix of completed + in-progress).
  const recentMeetings = MEETINGS.filter(
    (m) => m.status === "completed" || m.status === "in_progress"
  ).slice(0, 5);

  // 4E for the hero meeting (the demo's narrative spine).
  const heroFourE = HERO_MEETING.fourE;
  const heroFourEPrev = HERO_MEETING.fourEPrev;
  const heroFourEAvg = fourEAvg(heroFourE);

  return (
    <div className="px-6 lg:px-8 py-6 lg:py-8 max-w-[1440px] mx-auto space-y-6 reveal-stack">
      <PageHeader
        greeting="Monday · April 28 · 7:42 am"
        title="Good morning, Stefan."
        subtitle={
          <>
            Action completion at <span className="text-success-700 font-medium">78.4%</span> this week.
            One alignment conflict on the Q3 rollout needs your call before 10:00.
          </>
        }
        actions={
          <>
            <Button variant="secondary" size="md">
              <CalendarDays className="h-4 w-4" />
              Last 7 days
            </Button>
            <Button variant="secondary" size="icon" aria-label="Export">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ai" size="md">
              <Sparkles className="h-4 w-4" />
              AI weekly review
            </Button>
          </>
        }
      />

      {/* KPI strip */}
      <section
        aria-label="Key performance indicators"
        className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3"
      >
        {KPIS.map((k) => (
          <KPICard key={k.label} kpi={k} />
        ))}
      </section>

      {/* Hero alignment-conflict spotlight (full width) */}
      <Card className="ai-edge overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          <div className="lg:col-span-2 p-5 lg:p-6 border-b lg:border-b-0 lg:border-r border-border-soft">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <Badge tone="danger" dot size="sm">
                Critical · alignment conflict
              </Badge>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-50 text-accent-700 text-[10px] font-medium uppercase tracking-[0.1em]">
                <Sparkles className="h-3 w-3" /> AI ready
              </span>
              <span className="text-[11px] text-ink-muted">surfaced {heroRisk.age} ago</span>
            </div>
            <h2 className="font-display text-h2 text-ink-primary tracking-tight leading-tight">
              {heroRisk.title}
            </h2>
            <p className="mt-2 text-body text-ink-muted leading-relaxed max-w-2xl">
              {heroRisk.detail}
            </p>
            <div className="mt-3 flex items-center flex-wrap gap-3 text-body-sm">
              <span className="text-ink-secondary">
                Discussed in
                <span className="font-medium text-ink-primary"> Q3 Steering </span>
                and
                <span className="font-medium text-ink-primary"> Sales Pipeline Review </span>
                — no joint resolution
              </span>
              <span className="text-ink-disabled">·</span>
              <span className="text-success-700 font-medium tabular-nums">
                ${(heroRisk.dollarImpact! / 1_000_000).toFixed(1)}M revenue at stake
              </span>
            </div>
          </div>
          <div className="p-5 lg:p-6 flex flex-col justify-between gap-4">
            <div>
              <p className="text-caption uppercase tracking-[0.1em] text-ink-muted">
                AI recommended action
              </p>
              <p className="mt-1 text-body font-medium text-ink-primary leading-snug">
                {heroFix?.label}
              </p>
              <p className="mt-1 text-body-sm text-ink-muted leading-relaxed">
                {heroFix?.description}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="ai" size="md">
                <GitMerge className="h-4 w-4" />
                Schedule alignment
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="md">
                See all options
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* 4E radar + AI insights */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 overflow-hidden">
          <CardHeader className="flex flex-row items-end justify-between gap-3">
            <div>
              <CardCaption>Meeting effectiveness · 4E</CardCaption>
              <CardTitle className="mt-1">{HERO_MEETING.title}</CardTitle>
              <p className="text-[11px] text-ink-muted mt-1">
                Hero meeting · this week vs last week
              </p>
            </div>
            <div className="text-right">
              <p className="text-caption uppercase tracking-[0.1em] text-ink-muted">Score</p>
              <p className="text-kpi-sm tabular-nums text-ink-primary leading-none mt-0.5">
                {heroFourEAvg}
              </p>
              <p
                className={`text-[11px] tabular-nums font-medium mt-0.5 ${
                  heroFourEPrev && fourEAvg(heroFourEPrev) > heroFourEAvg
                    ? "text-warning-700"
                    : "text-success-700"
                }`}
              >
                {heroFourEPrev
                  ? `${heroFourEAvg - fourEAvg(heroFourEPrev) >= 0 ? "+" : ""}${
                      heroFourEAvg - fourEAvg(heroFourEPrev)
                    } vs last week`
                  : ""}
              </p>
            </div>
          </CardHeader>
          <div className="px-2 pb-5">
            <FourERadar current={heroFourE} previous={heroFourEPrev} height={260} />
          </div>
          <div className="border-t border-border-soft px-5 py-3 flex items-center gap-2 bg-subtle/30">
            <Sparkles className="h-3.5 w-3.5 text-accent-700 shrink-0" />
            <p className="text-body-sm text-ink-secondary">
              <span className="font-medium text-accent-700">Engagement -8 pts</span> driven by speaker imbalance.
              AI agenda restructure projected to recover to 88 next week.
            </p>
          </div>
        </Card>

        <Card className="xl:col-span-1 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardCaption>AI insights</CardCaption>
              <CardTitle className="mt-1">{INSIGHTS.length} for review</CardTitle>
            </div>
            <Badge tone="accent" size="sm">
              {INSIGHTS.length} new
            </Badge>
          </CardHeader>
          <div className="px-3 pb-3 space-y-2 flex-1 overflow-y-auto">
            {INSIGHTS.map((i) => (
              <AIInsightCard key={i.id} insight={i} />
            ))}
          </div>
        </Card>
      </section>

      {/* Recent meetings + 12-week trends */}
      <section className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <Card className="xl:col-span-3 overflow-hidden">
          <CardHeader className="flex flex-row items-end justify-between gap-3">
            <div>
              <CardCaption>Recent meetings</CardCaption>
              <CardTitle className="mt-1">
                Today · {recentMeetings.length} of {TENANT.totalMeetings.toLocaleString()} this quarter
              </CardTitle>
            </div>
            <button className="text-body-sm font-medium text-brand-600 hover:text-brand-700">
              View all meetings →
            </button>
          </CardHeader>
          <RecentMeetingsTable meetings={recentMeetings} />
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardCaption>Outcome trends · 12 weeks</CardCaption>
            <CardTitle className="mt-1">Health</CardTitle>
          </CardHeader>
          <div className="px-5 pb-5 grid grid-cols-2 gap-x-3 gap-y-4">
            <Mini label="Action follow-through" value="78%" delta="+3.6%" positive>
              <TrendChart
                data={VELOCITY_12W}
                xKey="week"
                series={[{ key: "followThrough", label: "Follow-through", color: "hsl(var(--success-500))" }]}
                height={70}
                hideAxis
                formatY={(v) => `${v.toFixed(0)}%`}
              />
            </Mini>
            <Mini label="Decision velocity" value="+12%" delta="+8.1%" positive>
              <TrendChart
                data={VELOCITY_12W}
                xKey="week"
                series={[{ key: "decisionVelocity", label: "Decisions / wk", color: "hsl(var(--brand-500))" }]}
                height={70}
                hideAxis
              />
            </Mini>
            <Mini label="Avg 4E score" value="76" delta="-2.4" positive={false}>
              <TrendChart
                data={VELOCITY_12W}
                xKey="week"
                series={[{ key: "fourE", label: "4E", color: "hsl(var(--accent-500))" }]}
                height={70}
                hideAxis
              />
            </Mini>
            <Mini label="Overdue rate" value="8%" delta="-3.4%" positive>
              <TrendChart
                data={VELOCITY_12W}
                xKey="week"
                series={[{ key: "overdue", label: "Overdue", color: "hsl(var(--warning-500))" }]}
                height={70}
                hideAxis
                formatY={(v) => `${v.toFixed(0)}%`}
              />
            </Mini>
          </div>
        </Card>
      </section>

      {/* Department velocity */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-end justify-between gap-3">
          <div>
            <CardCaption>Execution velocity · by department</CardCaption>
            <CardTitle className="mt-1">
              Two outliers — Product overload, Leadership leading
            </CardTitle>
          </div>
          <Badge tone="info" size="sm" dot>
            Updated 4s ago
          </Badge>
        </CardHeader>
        <div className="px-5 pb-5">
          <DepartmentVelocityStrip rows={DEPT_VELOCITY} />
        </div>
      </Card>

      {/* Copilot prompt bar */}
      <CopilotPromptBar />
    </div>
  );
}

function Mini({
  label,
  value,
  delta,
  positive,
  children,
}: {
  label: string;
  value: string;
  delta: string;
  positive?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-caption uppercase tracking-[0.1em] text-ink-muted">{label}</p>
      <div className="flex items-baseline gap-2 mt-0.5">
        <span className="text-kpi-sm tabular-nums text-ink-primary">{value}</span>
        <span
          className={`text-[11px] font-medium tabular-nums ${
            positive ? "text-success-700" : "text-danger-700"
          }`}
        >
          {delta}
        </span>
      </div>
      <div className="mt-1 -mx-1.5">{children}</div>
    </div>
  );
}
