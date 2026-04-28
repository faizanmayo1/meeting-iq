import { useMemo, useState } from "react";
import { Search, Download, Plus, SlidersHorizontal, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatTile } from "@/components/data-display/StatTile";
import { LoadsTable } from "@/features/loads/LoadsTable";
import { LoadDetailSheet } from "@/features/loads/LoadDetailSheet";
import { LOADS, type LoadRow } from "@/mocks/seed/loads";
import type { LoadStatus } from "@/lib/status";
import { cn } from "@/lib/utils";

const FILTERS: { key: "all" | LoadStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "on_time", label: "On time" },
  { key: "at_risk", label: "At risk" },
  { key: "delayed", label: "Delayed" },
  { key: "scheduled", label: "Scheduled" },
  { key: "delivered", label: "Delivered" },
];

export default function LoadsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<LoadRow | null>(null);

  const filtered = useMemo(() => {
    return LOADS.filter((l) => {
      if (filter !== "all" && l.status !== filter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        l.id.toLowerCase().includes(q) ||
        l.driver.toLowerCase().includes(q) ||
        l.customer.toLowerCase().includes(q) ||
        l.origin.toLowerCase().includes(q) ||
        l.dest.toLowerCase().includes(q)
      );
    });
  }, [filter, query]);

  const counts = useMemo(() => {
    const all = LOADS.length;
    const at_risk = LOADS.filter((l) => l.status === "at_risk").length;
    const delayed = LOADS.filter((l) => l.status === "delayed").length;
    const delivered = LOADS.filter((l) => l.status === "delivered").length;
    const revenue = LOADS.reduce((s, l) => s + l.revenue, 0);
    return { all, at_risk, delayed, delivered, revenue };
  }, []);

  return (
    <div className="px-6 lg:px-8 py-6 lg:py-8 max-w-[1440px] mx-auto space-y-6 reveal-stack">
      <PageHeader
        title="Loads"
        subtitle="Live shipments across your fleet, ranked by attention required."
        actions={
          <>
            <Button variant="secondary" size="md">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="primary" size="md">
              <Plus className="h-4 w-4" />
              New load
            </Button>
          </>
        }
      />

      {/* Summary stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile label="Active loads" value={counts.all - counts.delivered} note={`${counts.delivered} delivered today`} />
        <StatTile label="At risk" value={counts.at_risk} note="3 with AI recommendation" tone="warning" />
        <StatTile label="Delayed" value={counts.delayed} note="needs human review" tone="danger" />
        <StatTile label="Revenue · today" value={`$${(counts.revenue / 1000).toFixed(1)}K`} note={`${LOADS.length} loads`} />
      </section>

      {/* Filter bar */}
      <Card className="overflow-hidden">
        <div className="p-4 flex items-center gap-3 border-b border-border-soft">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
            <input
              type="text"
              placeholder="Search by load, driver, customer, lane…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-9 w-full pl-9 pr-3 rounded-md border border-border-soft bg-subtle/40 text-body text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-surface transition-all"
            />
          </div>
          <div className="flex items-center gap-1 overflow-x-auto">
            {FILTERS.map((f) => {
              const isActive = filter === f.key;
              const count =
                f.key === "all"
                  ? LOADS.length
                  : LOADS.filter((l) => l.status === f.key).length;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={cn(
                    "h-8 px-3 rounded-md text-body-sm font-medium transition-colors flex items-center gap-1.5",
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
          <Button variant="ghost" size="icon" aria-label="More filters">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-3 flex items-center gap-2 border-b border-border-soft bg-subtle/30">
          <Sparkles className="h-3.5 w-3.5 text-accent-700" />
          <p className="text-body-sm text-ink-secondary">
            <span className="font-medium text-accent-700">AI ranked</span> these{" "}
            <span className="font-medium text-ink-primary">{filtered.length}</span> loads by margin-at-stake.
            Top three carry one-click recommendations.
          </p>
        </div>

        <LoadsTable loads={filtered} onOpen={(l) => setActive(l)} />

        {/* Pagination footer */}
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-border-soft text-body-sm text-ink-muted">
          <span>
            Showing <span className="text-ink-primary font-medium tabular-nums">1–{filtered.length}</span> of{" "}
            <span className="tabular-nums">{LOADS.length}</span>
          </span>
          <div className="flex items-center gap-1">
            <button className="h-7 px-2.5 rounded-md hover:bg-subtle text-ink-muted">Prev</button>
            <button className="h-7 px-2.5 rounded-md hover:bg-subtle text-ink-muted">Next</button>
          </div>
        </div>
      </Card>

      <LoadDetailSheet load={active} open={!!active} onOpenChange={(o) => !o && setActive(null)} />
    </div>
  );
}
