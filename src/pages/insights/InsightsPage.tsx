import { Sparkles, Brain, Zap, DollarSign, Settings2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardCaption, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatTile } from "@/components/data-display/StatTile";
import { TrendChart } from "@/components/data-display/TrendChart";
import { AIInsightCard } from "@/components/ai/AIInsightCard";

import { CapabilityCard } from "@/features/insights/CapabilityCard";
import { MeetingFixesTable } from "@/features/insights/MeetingFixesTable";
import { AIDecisionLog } from "@/features/insights/AIDecisionLog";

import {
  CAPABILITIES,
  MEETING_FIXES,
  FOUR_E_TREND,
  AI_DECISIONS,
} from "@/mocks/seed/insightsAI";
import { INSIGHTS } from "@/mocks/seed/insights";

const SERIES = [
  { key: "Engagement",    label: "Engagement",    color: "hsl(var(--brand-500))" },
  { key: "Effectiveness", label: "Effectiveness", color: "hsl(var(--accent-500))" },
  { key: "Execution",     label: "Execution",     color: "hsl(var(--success-500))" },
  { key: "Efficiency",    label: "Efficiency",    color: "hsl(var(--warning-500))" },
];

export default function InsightsPage() {
  const totalScoreLift = MEETING_FIXES.reduce((s, r) => s + r.impactPts, 0);
  const autoCount = AI_DECISIONS.filter((d) => d.outcome === "auto").length;
  const humanCount = AI_DECISIONS.filter((d) => d.outcome === "human").length;
  const decisionsToday = AI_DECISIONS.length + 14;
  const accuracyAvg = Math.round(
    CAPABILITIES.reduce((s, c) => s + c.accuracy, 0) / CAPABILITIES.length
  );

  return (
    <div className="px-6 lg:px-8 py-6 lg:py-8 max-w-[1440px] mx-auto space-y-6 reveal-stack">
      <PageHeader
        title="AI Insights"
        subtitle="Predictions, scoring, and meeting-quality recommendations running across your org right now."
        actions={
          <>
            <Button variant="secondary" size="md">
              <Settings2 className="h-4 w-4" />
              Model settings
            </Button>
            <Button variant="ai" size="md">
              <Sparkles className="h-4 w-4" />
              Run AI brief
            </Button>
          </>
        }
      />

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile
          label="Decisions · today"
          value={decisionsToday}
          note={`${autoCount} auto · ${humanCount} human-approved`}
          icon={<Brain className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="Score lift available"
          value={`+${totalScoreLift} pts`}
          note="across 5 meeting fixes"
          tone="success"
          icon={<DollarSign className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="Avg model accuracy"
          value={`${accuracyAvg}%`}
          note="6 capabilities · 1 calibrating"
          tone="success"
        />
        <StatTile
          label="Auto-resolved"
          value="62%"
          note="of routine outcomes"
          tone="accent"
          icon={<Zap className="h-3.5 w-3.5" />}
        />
      </section>

      {/* Capability grid */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-caption uppercase tracking-[0.1em] text-ink-muted">Capabilities</p>
            <h2 className="font-display text-h3 text-ink-primary tracking-tight mt-0.5">
              What MeetingIQ is doing for you right now
            </h2>
          </div>
          <Badge tone="success" dot size="sm">
            {CAPABILITIES.filter((c) => c.status === "live").length} live
          </Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CAPABILITIES.map((c) => (
            <CapabilityCard key={c.key} cap={c} />
          ))}
        </div>
      </section>

      {/* Meeting fixes + insights feed */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 overflow-hidden">
          <CardHeader className="flex flex-row items-end justify-between gap-3">
            <div>
              <CardCaption>Meeting-quality fixes</CardCaption>
              <CardTitle className="mt-1">
                5 recommendations · +{totalScoreLift} pts opportunity
              </CardTitle>
            </div>
            <Badge tone="accent" size="sm" dot>
              AI ranked
            </Badge>
          </CardHeader>
          <MeetingFixesTable rows={MEETING_FIXES} />
        </Card>

        <Card className="xl:col-span-1 flex flex-col">
          <CardHeader>
            <CardCaption>AI insights</CardCaption>
            <CardTitle className="mt-1">{INSIGHTS.length} for review</CardTitle>
          </CardHeader>
          <div className="px-3 pb-3 space-y-2 flex-1 overflow-y-auto">
            {INSIGHTS.slice(0, 3).map((i) => (
              <AIInsightCard key={i.id} insight={i} />
            ))}
          </div>
        </Card>
      </section>

      {/* 4E trend + decision log */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-end justify-between gap-3">
            <div>
              <CardCaption>4E score · 12 weeks</CardCaption>
              <CardTitle className="mt-1">Engagement, effectiveness, execution, efficiency</CardTitle>
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
            <TrendChart data={FOUR_E_TREND} xKey="week" series={SERIES} height={240} formatY={(v) => `${v}`} />
          </div>
          <div className="border-t border-border-soft px-5 py-3 flex items-center gap-2 bg-subtle/30">
            <Sparkles className="h-3.5 w-3.5 text-accent-700 shrink-0" />
            <p className="text-body-sm text-ink-secondary">
              <span className="font-medium text-accent-700">Engagement -8 pts</span> on Q3 Steering driving the
              dip — AI agenda restructure projected to recover it next session.
            </p>
          </div>
        </Card>

        <Card className="xl:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardCaption>Agent decision log</CardCaption>
              <CardTitle className="mt-1">Last 6 actions</CardTitle>
            </div>
            <Badge tone="accent" size="sm" dot>
              Live
            </Badge>
          </CardHeader>
          <div className="px-5 pb-5">
            <AIDecisionLog decisions={AI_DECISIONS} />
          </div>
        </Card>
      </section>
    </div>
  );
}
