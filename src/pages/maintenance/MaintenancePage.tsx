import { useMemo, useState } from "react";
import {
  Search,
  Sparkles,
  Wrench,
  ShieldCheck,
  Plus,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardCaption, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatTile } from "@/components/data-display/StatTile";
import { PredictionsTable } from "@/features/maintenance/PredictionsTable";
import { WorkOrderBoard } from "@/features/maintenance/WorkOrderBoard";
import {
  PREDICTIONS,
  WORK_ORDERS,
  HEALTH_DISTRIBUTION,
  type Prediction,
} from "@/mocks/seed/maintenance";
import { cn } from "@/lib/utils";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "high", label: "High risk" },
  { key: "medium", label: "Medium" },
  { key: "low", label: "Low" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

export default function MaintenancePage() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return PREDICTIONS.filter((p) => {
      if (filter !== "all" && p.level !== filter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        p.unit.toLowerCase().includes(q) ||
        p.driver.toLowerCase().includes(q) ||
        p.issue.toLowerCase().includes(q) ||
        p.system.toLowerCase().includes(q)
      );
    });
  }, [filter, query]);

  const counts = useMemo(() => {
    const flagged = PREDICTIONS.length;
    const high = PREDICTIONS.filter((p) => p.level === "high").length;
    const open = WORK_ORDERS.filter((o) => o.status !== "completed").length;
    const avoided = PREDICTIONS.reduce((s, p) => s + p.costAvoided, 0);
    const totalUnits = HEALTH_DISTRIBUTION.reduce((s, h) => s + h.count, 0);
    const healthAvg =
      Math.round(
        ((HEALTH_DISTRIBUTION[0].count * 97 +
          HEALTH_DISTRIBUTION[1].count * 89 +
          HEALTH_DISTRIBUTION[2].count * 78 +
          HEALTH_DISTRIBUTION[3].count * 62) /
          totalUnits) *
          10
      ) / 10;
    return { flagged, high, open, avoided, totalUnits, healthAvg };
  }, []);

  const hero: Prediction =
    PREDICTIONS.find((p) => p.unit === "#217") ?? PREDICTIONS[0];

  const counter = (k: FilterKey) =>
    k === "all" ? PREDICTIONS.length : PREDICTIONS.filter((p) => p.level === k).length;

  return (
    <div className="px-6 lg:px-8 py-6 lg:py-8 max-w-[1440px] mx-auto space-y-6 reveal-stack">
      <PageHeader
        title="Predictive Maintenance"
        subtitle="AI watches every truck's telematics and flags failures 6–9 days before they hit the road."
        actions={
          <>
            <Button variant="secondary" size="md">
              <ShieldCheck className="h-4 w-4" />
              Health report
            </Button>
            <Button variant="ai" size="md">
              <Sparkles className="h-4 w-4" />
              Run prediction scan
            </Button>
            <Button variant="primary" size="md">
              <Plus className="h-4 w-4" />
              New work order
            </Button>
          </>
        }
      />

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile
          label="Trucks flagged"
          value={counts.flagged}
          note={`${counts.high} high · ${PREDICTIONS.filter((p) => p.level === "medium").length} medium`}
          tone={counts.high ? "danger" : "neutral"}
        />
        <StatTile
          label="Open work orders"
          value={counts.open}
          note={`${WORK_ORDERS.filter((o) => o.status === "completed").length} completed today`}
        />
        <StatTile
          label="Cost avoided · 30d"
          value={`$${(counts.avoided / 1000).toFixed(1)}K`}
          note="vs unscheduled roadside"
          tone="success"
        />
        <StatTile
          label="Avg fleet health"
          value={`${counts.healthAvg}`}
          note={`${counts.totalUnits} units monitored`}
          tone={counts.healthAvg >= 90 ? "success" : counts.healthAvg >= 80 ? "neutral" : "warning"}
        />
      </section>

      {/* Hero AI suggestion */}
      <Card className="ai-edge overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          <div className="lg:col-span-2 p-5 lg:p-6 border-b lg:border-b-0 lg:border-r border-border-soft">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <Badge tone="danger" dot size="sm">
                High risk · top of queue
              </Badge>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-50 text-accent-700 text-[10px] font-medium uppercase tracking-[0.1em]">
                <Sparkles className="h-3 w-3" /> AI prediction
              </span>
              <span className="text-[11px] text-ink-muted">model conf · {hero.probabilityPct}%</span>
            </div>
            <h2 className="font-display text-h2 text-ink-primary tracking-tight leading-tight">
              Unit {hero.unit} · {hero.issue}
            </h2>
            <p className="mt-2 text-body text-ink-muted leading-relaxed max-w-xl">
              Pattern matches injector wear in our 4-year telematics history. Predicted failure window{" "}
              <span className="text-ink-primary font-medium">{hero.windowDays}</span>. The truck naturally lays over at the
              Memphis terminal Friday — the ideal service window.
            </p>
            <div className="mt-3 flex items-center flex-wrap gap-3 text-body-sm">
              <span className="text-ink-secondary">
                Driver <span className="text-ink-primary font-medium">{hero.driver}</span>
              </span>
              <span className="text-ink-disabled">·</span>
              <span className="text-success-700 font-medium tabular-nums">
                Avoid ${hero.costAvoided.toLocaleString()} roadside cost
              </span>
              <span className="text-ink-disabled">·</span>
              <span className="text-ink-secondary">{hero.recommendedAt}</span>
            </div>
          </div>
          <div className="p-5 lg:p-6 flex flex-col justify-between gap-4">
            <div>
              <p className="text-caption uppercase tracking-[0.1em] text-ink-muted">
                AI recommended action
              </p>
              <p className="mt-1 text-body font-medium text-ink-primary leading-snug">
                {hero.recommendedAction}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="ai" size="md">
                <Wrench className="h-4 w-4" />
                Create work order
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="md">
                Snooze 24h
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Predictions + Health */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 overflow-hidden">
          <CardHeader className="flex flex-row items-end justify-between gap-3">
            <div>
              <CardCaption>Predicted failures</CardCaption>
              <CardTitle className="mt-1">Ranked by probability + cost</CardTitle>
            </div>
            <Badge tone="accent" dot size="sm">
              AI ranked
            </Badge>
          </CardHeader>

          <div className="px-5 pb-3 flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
              <input
                type="text"
                placeholder="Search by unit, driver, system, issue…"
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

          <PredictionsTable rows={filtered} />
        </Card>

        {/* Health distribution */}
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardCaption>Fleet health</CardCaption>
            <CardTitle className="mt-1">Score distribution</CardTitle>
          </CardHeader>
          <div className="px-5 pb-5 space-y-3">
            {HEALTH_DISTRIBUTION.map((h) => {
              const pct = (h.count / counts.totalUnits) * 100;
              return (
                <div key={h.range}>
                  <div className="flex items-baseline justify-between text-body-sm">
                    <span className="text-ink-secondary">
                      Score <span className="font-mono text-ink-primary">{h.range}</span>
                    </span>
                    <span className="tabular-nums text-ink-muted">
                      {h.count} unit{h.count !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-subtle overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        h.tone === "success" && "bg-success-500",
                        h.tone === "info" && "bg-brand-500",
                        h.tone === "warning" && "bg-warning-500",
                        h.tone === "danger" && "bg-danger-500"
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <div className="pt-3 border-t border-border-soft text-body-sm text-ink-muted">
              <div className="flex items-baseline justify-between">
                <span>Fleet average</span>
                <span className="tabular-nums text-h3 text-ink-primary">{counts.healthAvg}</span>
              </div>
              <p className="mt-1 text-[11px]">
                +1.6 vs last quarter — driven by 78% predictive maintenance hit rate.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Work order board */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-caption uppercase tracking-[0.1em] text-ink-muted">Work orders</p>
            <h2 className="font-display text-h3 text-ink-primary tracking-tight mt-0.5">
              {WORK_ORDERS.length} active across the fleet
            </h2>
          </div>
          <Button variant="ghost" size="sm">
            View archive
          </Button>
        </div>
        <WorkOrderBoard orders={WORK_ORDERS} />
      </section>
    </div>
  );
}
