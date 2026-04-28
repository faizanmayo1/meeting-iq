import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Sparkles,
  Bot,
  CircleAlert,
  ZapOff,
  Settings,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardCaption, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatTile } from "@/components/data-display/StatTile";

import { WorkflowCard } from "@/features/meeting-workflows/WorkflowCard";
import { ApprovalInbox } from "@/features/meeting-workflows/ApprovalInbox";
import { RunHistory } from "@/features/meeting-workflows/RunHistory";

import { WORKFLOWS, APPROVAL_INBOX, RUN_HISTORY, type Workflow } from "@/mocks/seed/meetingWorkflows";
import { cn } from "@/lib/utils";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "auto", label: "Auto", Icon: Bot },
  { key: "human_approval", label: "Approval", Icon: CircleAlert },
  { key: "calibrating", label: "Calibrating", Icon: Settings },
  { key: "off", label: "Disabled", Icon: ZapOff },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

export default function WorkflowsPage() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return WORKFLOWS.filter((w) => {
      if (filter !== "all" && w.mode !== filter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        w.name.toLowerCase().includes(q) ||
        w.trigger.toLowerCase().includes(q) ||
        w.action.toLowerCase().includes(q)
      );
    });
  }, [filter, query]);

  const counts = useMemo(() => {
    const total = WORKFLOWS.length;
    const auto = WORKFLOWS.filter((w) => w.mode === "auto").length;
    const approval = WORKFLOWS.filter((w) => w.mode === "human_approval").length;
    const off = WORKFLOWS.filter((w) => w.mode === "off" || !w.enabled).length;
    const runsToday = WORKFLOWS.reduce((s, w) => s + w.runsToday, 0);
    const avgSuccess =
      WORKFLOWS.filter((w) => w.runsToday > 0).reduce((s, w) => s + w.successPct, 0) /
      Math.max(1, WORKFLOWS.filter((w) => w.runsToday > 0).length);
    return { total, auto, approval, off, runsToday, avgSuccess };
  }, []);

  const counter = (k: FilterKey): number => {
    if (k === "all") return WORKFLOWS.length;
    return WORKFLOWS.filter((w: Workflow) => w.mode === k).length;
  };

  return (
    <div className="px-6 lg:px-8 py-6 lg:py-8 max-w-[1440px] mx-auto space-y-6 reveal-stack">
      <PageHeader
        title="Outcome Workflows"
        subtitle="Automations that turn meeting outcomes into action — fully auto, or pause for human approval where it matters."
        actions={
          <>
            <Button variant="secondary" size="md">Run history</Button>
            <Button variant="ai" size="md">
              <Sparkles className="h-4 w-4" />
              Suggest workflow
            </Button>
            <Button variant="primary" size="md">
              <Plus className="h-4 w-4" />
              New workflow
            </Button>
          </>
        }
      />

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile
          label="Active workflows"
          value={counts.total - counts.off}
          note={`${counts.auto} auto · ${counts.approval} need approval`}
          tone="success"
        />
        <StatTile
          label="Runs · today"
          value={counts.runsToday}
          note={`Avg success ${counts.avgSuccess.toFixed(1)}%`}
        />
        <StatTile
          label="Awaiting approval"
          value={APPROVAL_INBOX.length}
          note="ranked by impact"
          tone="warning"
        />
        <StatTile
          label="Saved · this week"
          value="$12.8K"
          note="meeting time + protected revenue"
          tone="success"
        />
      </section>

      <Card className="ai-edge overflow-hidden">
        <CardHeader className="flex flex-row items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-50 text-accent-700 text-[10px] font-medium uppercase tracking-[0.1em]">
                <Sparkles className="h-3 w-3" />
                Approval inbox
              </span>
              <Badge tone="warning" size="sm" dot>
                {APPROVAL_INBOX.length} pending
              </Badge>
            </div>
            <CardTitle className="mt-1.5">
              {APPROVAL_INBOX.length} agent decisions awaiting your call
            </CardTitle>
          </div>
          <button className="text-body-sm font-medium text-brand-600 hover:text-brand-700">
            Approve all eligible →
          </button>
        </CardHeader>
        <ApprovalInbox items={APPROVAL_INBOX} />
      </Card>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardCaption>Workflow library</CardCaption>
              <CardTitle className="mt-1">{counts.total} configured · {counts.total - counts.off} live</CardTitle>
            </div>
            <Badge tone="success" dot size="sm">
              All systems normal
            </Badge>
          </CardHeader>

          <div className="px-5 pb-3 flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
              <input
                type="text"
                placeholder="Search workflows…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-9 w-full pl-9 pr-3 rounded-md border border-border-soft bg-subtle/40 text-body text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-surface transition-all"
              />
            </div>
            <div className="flex items-center gap-1 overflow-x-auto">
              {FILTERS.map((f) => {
                const isActive = filter === f.key;
                return (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={cn(
                      "h-8 px-3 rounded-md text-body-sm font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap",
                      isActive
                        ? "bg-ink-primary text-ink-invert"
                        : "text-ink-secondary hover:bg-subtle hover:text-ink-primary"
                    )}
                  >
                    {"Icon" in f && f.Icon && <f.Icon className="h-3.5 w-3.5" />}
                    {f.label}
                    <span
                      className={cn(
                        "tabular-nums text-[11px] px-1.5 rounded",
                        isActive ? "bg-white/15" : "bg-subtle text-ink-muted"
                      )}
                    >
                      {counter(f.key)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((w) => (
              <WorkflowCard key={w.id} wf={w} />
            ))}
          </div>
        </Card>

        <Card className="xl:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardCaption>Recent runs</CardCaption>
              <CardTitle className="mt-1">Today</CardTitle>
            </div>
            <Badge tone="accent" dot size="sm">
              Live
            </Badge>
          </CardHeader>
          <div className="px-5 pb-5">
            <RunHistory rows={RUN_HISTORY} />
          </div>
        </Card>
      </section>
    </div>
  );
}
