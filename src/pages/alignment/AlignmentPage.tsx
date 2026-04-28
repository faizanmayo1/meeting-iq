import { useState } from "react";
import {
  GitMerge,
  AlertTriangle,
  Sparkles,
  Download,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardCaption, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatTile } from "@/components/data-display/StatTile";
import { StatusBadge } from "@/components/data-display/StatusBadge";
import { DecisionGraph } from "@/features/decisions/DecisionGraph";
import { DECISIONS, type Decision } from "@/mocks/seed/decisions";
import { meetingById } from "@/mocks/seed/meetings";
import { userById } from "@/mocks/seed/users";

export default function AlignmentPage() {
  const [selected, setSelected] = useState<Decision | null>(null);

  const total = DECISIONS.length;
  const conflicts = DECISIONS.filter((d) => d.status === "conflict").length;
  const blocked = DECISIONS.filter((d) => d.status === "blocked").length;
  const dependencies = DECISIONS.reduce((s, d) => s + (d.dependsOn?.length ?? 0), 0);

  const heroConflict = DECISIONS.find((d) => d.id === "d-rollout-phased")!;
  const conflictWith = heroConflict.conflictWith
    ? DECISIONS.find((d) => d.id === heroConflict.conflictWith)
    : undefined;

  return (
    <div className="px-6 lg:px-8 py-6 lg:py-8 max-w-[1440px] mx-auto space-y-6 reveal-stack">
      <PageHeader
        title="Decision Graph"
        subtitle="Cross-team decisions, dependencies, and conflicts — surfaced before they cost a launch."
        actions={
          <>
            <Button variant="secondary" size="md">
              <Download className="h-4 w-4" />
              Export graph
            </Button>
            <Button variant="ai" size="md">
              <Sparkles className="h-4 w-4" />
              AI alignment scan
            </Button>
          </>
        }
      />

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile
          label="Active decisions"
          value={total}
          note="across the company"
          icon={<GitMerge className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="Conflicts"
          value={conflicts}
          note={conflicts ? "AI cross-meeting detection" : "all aligned"}
          tone={conflicts ? "danger" : "success"}
          icon={<AlertTriangle className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="Blocked"
          value={blocked}
          note="waiting on dependencies"
          tone={blocked ? "warning" : "neutral"}
        />
        <StatTile
          label="Dependencies"
          value={dependencies}
          note="auto-mapped from meeting context"
          tone="accent"
        />
      </section>

      {/* Hero conflict callout (full width) */}
      <Card className="ai-edge overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          <div className="lg:col-span-2 p-5 lg:p-6 border-b lg:border-b-0 lg:border-r border-border-soft">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <Badge tone="danger" dot size="sm">
                Cross-team conflict detected
              </Badge>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-50 text-accent-700 text-[10px] font-medium uppercase tracking-[0.1em]">
                <Sparkles className="h-3 w-3" /> AI · cross-meeting analysis
              </span>
            </div>
            <h2 className="font-display text-h2 text-ink-primary tracking-tight leading-tight">
              Q3 enterprise rollout · phased plan vs single-launch commit
            </h2>
            <p className="mt-2 text-body text-ink-muted leading-relaxed max-w-2xl">
              Two decisions made in two different meetings carry incompatible commitments to enterprise
              customers. AI detected the conflict by linking the Q3 Steering decision to Sales' pricing
              negotiation note and the resulting commercial commitments.
            </p>
            {conflictWith && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <CompactDecisionCard d={heroConflict} />
                <CompactDecisionCard d={conflictWith} />
              </div>
            )}
          </div>
          <div className="p-5 lg:p-6 flex flex-col justify-between gap-4">
            <div>
              <p className="text-caption uppercase tracking-[0.1em] text-ink-muted">
                AI recommended action
              </p>
              <p className="mt-1 text-body font-medium text-ink-primary leading-snug">
                Schedule cross-functional alignment meeting
              </p>
              <p className="mt-1 text-body-sm text-ink-muted leading-relaxed">
                Auto-schedule a 30-min decision-only session with Product, Sales, Engineering, and CS
                owners. AI drafts the agenda with the conflict and 3 resolution options.
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

      {/* The graph */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-end justify-between gap-3">
          <div>
            <CardCaption>Decision graph</CardCaption>
            <CardTitle className="mt-1">
              {total} decisions · {conflicts + blocked} need attention
            </CardTitle>
            <p className="text-[11px] text-ink-muted mt-1">
              Hover a node to highlight its connections · click to drill in
            </p>
          </div>
          <Badge tone="accent" size="sm" dot>
            Live · auto-refreshed
          </Badge>
        </CardHeader>
        <div className="px-5 pb-5">
          <DecisionGraph onSelect={(d) => setSelected(d)} />
        </div>
      </Card>

      {/* Selected node detail (compact inline) */}
      {selected && (
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-end justify-between gap-3">
            <div>
              <CardCaption>Selected decision</CardCaption>
              <CardTitle className="mt-1">{selected.title}</CardTitle>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-body-sm text-ink-muted hover:text-ink-primary"
            >
              Close ×
            </button>
          </CardHeader>
          <div className="px-5 pb-5 space-y-3">
            <p className="text-body text-ink-secondary leading-relaxed">{selected.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Mini label="Status" value={<StatusBadge status={selected.status} />} />
              <Mini label="Owner" value={userById(selected.owner)?.name ?? "—"} />
              <Mini label="Source" value={meetingById(selected.meetingId)?.title ?? "—"} />
              <Mini label="Departments" value={selected.departments.join(", ")} />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

function CompactDecisionCard({ d }: { d: Decision }) {
  const meeting = meetingById(d.meetingId);
  return (
    <div className="rounded-lg border border-border-soft bg-subtle/40 p-3">
      <div className="flex items-center gap-2 mb-1">
        <StatusBadge status={d.status} />
        <span className="text-[10px] text-ink-muted uppercase tracking-[0.1em]">
          {d.departments[0]}
        </span>
      </div>
      <p className="text-body-sm font-medium text-ink-primary leading-snug">{d.title}</p>
      <p className="text-[11px] text-ink-muted mt-1 truncate">
        from <span className="text-ink-secondary">{meeting?.title}</span>
      </p>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md bg-subtle/60 p-2.5">
      <p className="text-[10px] uppercase tracking-[0.1em] text-ink-muted">{label}</p>
      <div className="mt-1 text-body-sm text-ink-primary">{value}</div>
    </div>
  );
}
