import { useMemo, useState } from "react";
import {
  Search,
  Download,
  Plus,
  Sparkles,
  CheckSquare,
  CircleCheck,
  AlertOctagon,
  CheckCircle2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatTile } from "@/components/data-display/StatTile";
import { ActionsTable } from "@/features/actions/ActionsTable";
import { DecisionsTable } from "@/features/actions/DecisionsTable";
import { ACTIONS, type ActionStatus } from "@/mocks/seed/actions";
import { DECISIONS, type DecisionStatus } from "@/mocks/seed/decisions";
import { cn } from "@/lib/utils";

type Tab = "actions" | "decisions";

const ACTION_FILTERS: { key: "all" | ActionStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "open", label: "Open" },
  { key: "in_progress", label: "In progress" },
  { key: "blocked", label: "Blocked" },
  { key: "overdue", label: "Overdue" },
  { key: "done", label: "Done" },
];

const DECISION_FILTERS: { key: "all" | DecisionStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "decided", label: "Decided" },
  { key: "open", label: "Open" },
  { key: "blocked", label: "Blocked" },
  { key: "conflict", label: "Conflicts" },
];

export default function ActionsPage() {
  const [tab, setTab] = useState<Tab>("actions");
  const [aFilter, setAFilter] = useState<(typeof ACTION_FILTERS)[number]["key"]>("all");
  const [dFilter, setDFilter] = useState<(typeof DECISION_FILTERS)[number]["key"]>("all");
  const [query, setQuery] = useState("");

  const filteredActions = useMemo(() => {
    return ACTIONS.filter((a) => {
      if (aFilter !== "all" && a.status !== aFilter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        (a.description ?? "").toLowerCase().includes(q) ||
        a.ownerDept.toLowerCase().includes(q)
      );
    });
  }, [aFilter, query]);

  const filteredDecisions = useMemo(() => {
    return DECISIONS.filter((d) => {
      if (dFilter !== "all" && d.status !== dFilter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.departments.join(" ").toLowerCase().includes(q)
      );
    });
  }, [dFilter, query]);

  const counts = useMemo(() => {
    const totalActions = ACTIONS.length;
    const open = ACTIONS.filter(
      (a) => a.status === "open" || a.status === "in_progress"
    ).length;
    const overdue = ACTIONS.filter((a) => a.status === "overdue").length;
    const blocked = ACTIONS.filter((a) => a.status === "blocked").length;
    const done = ACTIONS.filter((a) => a.status === "done").length;
    const totalDecisions = DECISIONS.length;
    const conflicts = DECISIONS.filter((d) => d.status === "conflict").length;
    const decided = DECISIONS.filter((d) => d.status === "decided").length;
    return { totalActions, open, overdue, blocked, done, totalDecisions, conflicts, decided };
  }, []);

  return (
    <div className="px-6 lg:px-8 py-6 lg:py-8 max-w-[1440px] mx-auto space-y-6 reveal-stack">
      <PageHeader
        title="Actions &amp; Decisions"
        subtitle="Auto-extracted from every meeting — owners, deadlines, dependencies, sync state."
        actions={
          <>
            <Button variant="secondary" size="md">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="ai" size="md">
              <Sparkles className="h-4 w-4" />
              Re-extract from week
            </Button>
            <Button variant="primary" size="md">
              <Plus className="h-4 w-4" />
              New action
            </Button>
          </>
        }
      />

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile
          label="Open actions"
          value={counts.open}
          note={`${counts.totalActions} tracked across the fleet`}
          icon={<CheckSquare className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="Overdue"
          value={counts.overdue}
          note={counts.overdue ? "review immediately" : "all clear"}
          tone={counts.overdue ? "danger" : "success"}
          icon={<AlertOctagon className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="Decided this quarter"
          value={counts.decided}
          note={`${counts.conflicts} in conflict · ${counts.totalDecisions} total`}
          tone="success"
          icon={<CircleCheck className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="Auto-completed"
          value="62%"
          note="of routine actions · workflow auto-close"
          tone="accent"
          icon={<CheckCircle2 className="h-3.5 w-3.5" />}
        />
      </section>

      <Card className="overflow-hidden">
        {/* Tab nav */}
        <div className="px-5 pt-3 flex items-center gap-1 border-b border-border-soft">
          {([
            { key: "actions" as const, label: "Action items", count: counts.totalActions },
            { key: "decisions" as const, label: "Decisions", count: counts.totalDecisions },
          ]).map((t) => {
            const isActive = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "relative h-10 px-3 inline-flex items-center gap-1.5 text-body-sm font-medium transition-colors",
                  isActive ? "text-ink-primary" : "text-ink-muted hover:text-ink-secondary"
                )}
              >
                {t.label}
                <span
                  className={cn(
                    "tabular-nums text-[11px] px-1.5 rounded",
                    isActive ? "bg-brand-50 text-brand-700" : "bg-subtle text-ink-muted"
                  )}
                >
                  {t.count}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-500 rounded-t" />
                )}
              </button>
            );
          })}
        </div>

        {/* Filter bar */}
        <div className="p-4 flex items-center gap-3 border-b border-border-soft flex-wrap">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
            <input
              type="text"
              placeholder={
                tab === "actions"
                  ? "Search actions, owners, departments…"
                  : "Search decisions, departments…"
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-9 w-full pl-9 pr-3 rounded-md border border-border-soft bg-subtle/40 text-body text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-surface transition-all"
            />
          </div>
          <div className="flex items-center gap-1 overflow-x-auto">
            {(tab === "actions" ? ACTION_FILTERS : DECISION_FILTERS).map((f) => {
              const value = tab === "actions" ? aFilter : dFilter;
              const set = tab === "actions" ? setAFilter : setDFilter;
              const isActive = value === f.key;
              const count =
                f.key === "all"
                  ? tab === "actions"
                    ? ACTIONS.length
                    : DECISIONS.length
                  : tab === "actions"
                  ? ACTIONS.filter((a) => a.status === f.key).length
                  : DECISIONS.filter((d) => d.status === f.key).length;
              return (
                <button
                  key={f.key}
                  onClick={() => set(f.key as never)}
                  className={cn(
                    "h-8 px-3 rounded-md text-body-sm font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap",
                    isActive
                      ? "bg-ink-primary text-ink-invert"
                      : "text-ink-secondary hover:bg-subtle hover:text-ink-primary"
                  )}
                >
                  {f.label}
                  <span
                    className={cn(
                      "tabular-nums text-[11px] px-1.5 rounded",
                      isActive ? "bg-white/15" : "bg-subtle text-ink-muted"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI extraction banner — only on actions */}
        {tab === "actions" && (
          <div className="p-3 flex items-center gap-2 border-b border-border-soft bg-subtle/30">
            <Sparkles className="h-3.5 w-3.5 text-accent-700" />
            <p className="text-body-sm text-ink-secondary">
              <span className="font-medium text-accent-700">AI extracted</span>{" "}
              <span className="font-medium text-ink-primary">{filteredActions.length}</span> actions from{" "}
              this week's meetings · avg confidence{" "}
              <span className="font-medium text-ink-primary">
                {filteredActions.length > 0
                  ? Math.round(
                      (filteredActions.reduce((s, a) => s + a.confidence, 0) /
                        filteredActions.length) *
                        100
                    )
                  : 0}
                %
              </span>
              <span className="ml-2">
                <Badge tone="accent" size="sm" dot>
                  Auto-synced to Jira / Asana
                </Badge>
              </span>
            </p>
          </div>
        )}

        {tab === "actions" ? (
          <ActionsTable rows={filteredActions} />
        ) : (
          <DecisionsTable rows={filteredDecisions} />
        )}

        <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-border-soft text-body-sm text-ink-muted">
          <span>
            Showing{" "}
            <span className="text-ink-primary font-medium tabular-nums">
              1–{tab === "actions" ? filteredActions.length : filteredDecisions.length}
            </span>{" "}
            of{" "}
            <span className="tabular-nums">
              {(tab === "actions" ? counts.totalActions : counts.totalDecisions).toLocaleString()}
            </span>
            {" · this view"}
          </span>
          <div className="flex items-center gap-1">
            <button className="h-7 px-2.5 rounded-md hover:bg-subtle text-ink-muted">Prev</button>
            <button className="h-7 px-2.5 rounded-md hover:bg-subtle text-ink-muted">Next</button>
          </div>
        </div>
      </Card>
    </div>
  );
}
