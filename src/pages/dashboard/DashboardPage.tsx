import {
  Sparkles,
  ArrowRight,
  Download,
  Bot,
  User,
  X,
  CalendarDays,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardCaption, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkline } from "@/components/data-display/Sparkline";
import { TrendChart } from "@/components/data-display/TrendChart";

import { KPIS } from "@/mocks/seed/kpis";
import { RISKS } from "@/mocks/seed/risks";
import { DEPT_VELOCITY, VELOCITY_12W } from "@/mocks/seed/velocity";
import { AI_DECISIONS } from "@/mocks/seed/insightsAI";
import { cn } from "@/lib/utils";
import { formatBy } from "@/lib/format";

const TREND_SERIES = [
  { key: "followThrough",     label: "Follow-through %", color: "hsl(var(--brand-500))" },
  { key: "decisionVelocity",  label: "Decision velocity", color: "hsl(var(--accent-500))" },
  { key: "fourE",             label: "Avg 4E score",      color: "hsl(var(--success-500))" },
];

const OUTCOME_ICON = { auto: Bot, human: User, rejected: X } as const;

export default function DashboardPage() {
  const heroRisk = RISKS.find((r) => r.id === "r-priority-conflict")!;
  const heroFix = heroRisk.resolutions?.find((r) => r.recommended);
  const recentActivity = AI_DECISIONS.slice(0, 6);

  return (
    <div className="px-6 lg:px-10 py-8 lg:py-10 max-w-[1440px] mx-auto space-y-6 reveal-stack">
      <PageHeader
        greeting={
          <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.16em] text-ink-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-success-500 opacity-60 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success-500" />
              </span>
              Live
            </span>
            <span className="text-ink-disabled">·</span>
            <span>Mon · Apr 28 · 7:42 am</span>
          </div>
        }
        title="Overview"
        subtitle="Northwind Inc. · 100 members · 8 departments"
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


      {/* KPI grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {KPIS.map((k) => {
          const trendingUp = k.delta > 0;
          const goodIfUp = !k.invertedDelta;
          const positive = trendingUp ? goodIfUp : !goodIfUp;
          const Arrow = trendingUp ? ArrowUpRight : ArrowDownRight;
          return (
            <div
              key={k.label}
              className={cn(
                "group relative isolate overflow-hidden",
                "rounded-xl bg-surface border border-border-soft p-4",
                "shadow-[0_1px_0_rgba(8,6,22,0.02)]",
                "transition-[border-color,transform] duration-200",
                "hover:border-border hover:-translate-y-px"
              )}
            >
              {/* hover gradient wash */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background:
                    "radial-gradient(120% 80% at 100% 0%, hsl(var(--brand-500) / 0.06), transparent 65%)",
                }}
              />
              <p className="text-[10.5px] uppercase tracking-[0.12em] text-ink-muted font-medium leading-tight">
                {k.label}
              </p>
              <p
                className="mt-3 tabular-nums leading-none text-ink-primary"
                style={{ fontSize: "2.125rem", fontWeight: 600, letterSpacing: "-0.025em" }}
              >
                {formatBy(k.value, k.format)}
              </p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 text-[11px] font-mono tabular-nums font-medium px-1.5 py-0.5 rounded",
                    positive ? "text-success-700 bg-success-50" : "text-danger-700 bg-danger-50"
                  )}
                >
                  <Arrow className="h-3 w-3" strokeWidth={2.25} />
                  {Math.abs(k.delta).toFixed(1)}%
                </span>
                <Sparkline data={k.trend} positive={positive} width={64} height={20} />
              </div>
            </div>
          );
        })}
      </section>

      {/* Risk banner */}
      <Card className="ai-edge overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] items-center gap-5 px-6 py-5">
          <div className="flex items-start gap-4 min-w-0">
            <div className="relative h-11 w-11 rounded-lg grid place-items-center bg-gradient-to-br from-danger-50 to-danger-50/40 text-danger-700 shrink-0 ring-1 ring-danger-500/15">
              <AlertTriangle className="h-5 w-5" strokeWidth={2.25} />
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-danger-500 ring-2 ring-surface animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge tone="danger" dot size="sm">
                  Critical
                </Badge>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-50 text-accent-700 text-[10px] font-medium uppercase tracking-[0.12em] ring-1 ring-accent-500/15">
                  <Sparkles className="h-3 w-3" /> AI ready
                </span>
                <span className="text-[11px] text-ink-muted">surfaced {heroRisk.age} ago</span>
              </div>
              <h2 className="mt-1.5 text-h3 text-ink-primary leading-snug">{heroRisk.title}</h2>
            </div>
          </div>
          <div className="hidden lg:block min-w-0 pl-4 border-l border-border-soft">
            <p className="text-[11px] uppercase tracking-[0.12em] text-ink-muted font-medium mb-1">
              AI suggestion
            </p>
            <p className="text-body-sm text-ink-secondary leading-snug truncate">
              {heroFix?.label}
            </p>
            <p className="text-[11px] mt-1">
              <span className="text-success-700 font-medium tabular-nums">
                ${(heroRisk.dollarImpact! / 1_000_000).toFixed(1)}M
              </span>
              <span className="text-ink-muted"> at stake · 30-min decision-only meeting</span>
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="secondary" size="md">
              Options
            </Button>
            <Button variant="ai" size="md">
              <Sparkles className="h-4 w-4" />
              Resolve
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Main chart + activity feed */}
      <section className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-end justify-between gap-3">
            <div>
              <CardCaption>Outcome trends · 12 weeks</CardCaption>
              <CardTitle className="mt-1.5">
                Follow-through, decision velocity, 4E
              </CardTitle>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              {TREND_SERIES.map((s) => (
                <span
                  key={s.key}
                  className="inline-flex items-center gap-1.5 text-ink-muted"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: s.color }}
                  />
                  {s.label}
                </span>
              ))}
            </div>
          </CardHeader>
          <div className="px-5 pb-5">
            <TrendChart
              data={VELOCITY_12W}
              xKey="week"
              series={TREND_SERIES}
              height={260}
              formatY={(v) => `${v.toFixed(0)}`}
            />
          </div>
        </Card>

        <Card className="overflow-hidden flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardCaption>Live activity</CardCaption>
              <CardTitle className="mt-1.5">Agent decisions · today</CardTitle>
            </div>
            <Badge tone="accent" size="sm" dot>
              Live
            </Badge>
          </CardHeader>
          <ol className="px-5 pb-5 relative flex-1">
            <span className="absolute left-[26px] top-1 bottom-1 w-px bg-border-soft" />
            {recentActivity.map((d) => {
              const Icon = OUTCOME_ICON[d.outcome];
              return (
                <li
                  key={d.id}
                  className="relative pl-9 py-2.5 first:pt-0 last:pb-0 group hover:bg-subtle/40 -mx-3 px-3 rounded-md transition-colors"
                >
                  <span
                    className={cn(
                      "absolute left-[8px] top-3 h-4 w-4 rounded-full ring-[3px] ring-surface grid place-items-center",
                      d.outcome === "auto"
                        ? "bg-accent-50 text-accent-700"
                        : d.outcome === "human"
                        ? "bg-brand-50 text-brand-700"
                        : "bg-subtle text-ink-muted"
                    )}
                  >
                    <Icon className="h-2.5 w-2.5" strokeWidth={2.5} />
                  </span>
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-body-sm font-medium text-ink-primary leading-snug pr-2">
                      {d.action}
                    </p>
                    <span className="text-[10.5px] font-mono tabular-nums text-ink-muted shrink-0">
                      {d.time}
                    </span>
                  </div>
                  <p className="text-[11.5px] text-ink-muted leading-snug mt-0.5">
                    {d.detail}
                  </p>
                  {d.saved && (
                    <p className="text-[11px] text-success-700 font-medium mt-1 tabular-nums">
                      {d.saved}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </Card>
      </section>

      {/* Department performance */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-end justify-between gap-3">
          <div>
            <CardCaption>Department performance</CardCaption>
            <CardTitle className="mt-1.5">
              8 teams · ranked by follow-through
            </CardTitle>
          </div>
          <Badge tone="info" size="sm" dot>
            Updated 4s ago
          </Badge>
        </CardHeader>
        <div className="overflow-hidden">
          <table className="w-full text-body">
            <thead className="border-y border-border-soft bg-subtle/40">
              <tr className="text-left text-[10px] uppercase tracking-[0.12em] text-ink-muted font-medium">
                <th className="px-6 py-2.5">Department</th>
                <th className="px-3 py-2.5 text-right">Mtgs / wk</th>
                <th className="px-3 py-2.5">Follow-through</th>
                <th className="px-3 py-2.5 text-right">Decision → done</th>
                <th className="px-3 py-2.5 text-right">4E avg</th>
                <th className="px-3 py-2.5">12-wk</th>
                <th className="px-6 py-2.5">Flag</th>
              </tr>
            </thead>
            <tbody>
              {[...DEPT_VELOCITY]
                .sort((a, b) => b.followThroughPct - a.followThroughPct)
                .map((d) => {
                  const tone =
                    d.followThroughPct >= 90
                      ? "text-success-700"
                      : d.followThroughPct >= 80
                      ? "text-ink-primary"
                      : d.followThroughPct >= 70
                      ? "text-warning-700"
                      : "text-danger-700";
                  const barTone =
                    d.followThroughPct >= 90
                      ? "bg-success-500"
                      : d.followThroughPct >= 80
                      ? "bg-brand-500"
                      : d.followThroughPct >= 70
                      ? "bg-warning-500"
                      : "bg-danger-500";
                  return (
                    <tr
                      key={d.department}
                      className="border-b border-border-soft last:border-b-0 hover:bg-subtle/40 transition-colors"
                    >
                      <td className="px-6 py-3.5 text-body-sm font-medium text-ink-primary">
                        {d.department}
                      </td>
                      <td className="px-3 py-3.5 text-right font-mono tabular-nums text-body-sm text-ink-secondary">
                        {d.meetingsPerWeek}
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-2.5 max-w-[180px]">
                          <div className="relative h-1.5 flex-1 rounded-full bg-subtle overflow-hidden">
                            <div
                              className={cn("absolute inset-y-0 left-0 rounded-full", barTone)}
                              style={{ width: `${d.followThroughPct}%` }}
                            />
                          </div>
                          <span
                            className={cn(
                              "font-mono tabular-nums text-body-sm font-medium shrink-0 w-9 text-right",
                              tone
                            )}
                          >
                            {d.followThroughPct}%
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-right font-mono tabular-nums text-body-sm text-ink-secondary">
                        {d.avgDecisionToCompletionDays.toFixed(1)}d
                      </td>
                      <td className="px-3 py-3.5 text-right font-mono tabular-nums text-body-sm text-ink-primary">
                        {d.fourEAvg}
                      </td>
                      <td className="px-3 py-3.5">
                        <Sparkline
                          data={d.trend}
                          positive={d.followThroughPct >= 75}
                          width={88}
                          height={20}
                        />
                      </td>
                      <td className="px-6 py-3.5">
                        {d.flag ? (
                          <Badge tone={d.flag.tone} size="sm" dot>
                            {d.flag.label}
                          </Badge>
                        ) : (
                          <span className="text-[11px] text-ink-disabled">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
