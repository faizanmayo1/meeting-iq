import { useMemo, useState } from "react";
import {
  Search,
  Download,
  Sparkles,
  Star,
  Clock,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardCaption, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatTile } from "@/components/data-display/StatTile";
import { DriverCard } from "@/features/drivers/DriverCard";
import { DriverDetailSheet } from "@/features/drivers/DriverDetailSheet";
import { DRIVERS, type Driver } from "@/mocks/seed/drivers";
import { cn } from "@/lib/utils";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "on_duty", label: "On duty" },
  { key: "hos_warning", label: "HOS watch" },
  { key: "hos_critical", label: "HOS critical" },
  { key: "off_duty", label: "Off duty" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

export default function DriversPage() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Driver | null>(null);

  const filtered = useMemo(() => {
    return DRIVERS.filter((d) => {
      if (filter !== "all" && d.status !== filter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        d.name.toLowerCase().includes(q) ||
        d.unit.toLowerCase().includes(q) ||
        (d.currentLoad ?? "").toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q)
      );
    });
  }, [filter, query]);

  const counts = useMemo(() => {
    const total = DRIVERS.length;
    const onDuty = DRIVERS.filter((d) => d.status === "on_duty").length;
    const hosCrit = DRIVERS.filter((d) => d.status === "hos_critical").length;
    const hosWarn = DRIVERS.filter((d) => d.status === "hos_warning").length;
    const offDuty = DRIVERS.filter((d) => d.status === "off_duty").length;
    const avgScore =
      DRIVERS.filter((d) => d.score > 0).reduce((s, d) => s + d.score, 0) /
      DRIVERS.filter((d) => d.score > 0).length;
    const avgOtd =
      DRIVERS.filter((d) => d.otdPct > 0).reduce((s, d) => s + d.otdPct, 0) /
      DRIVERS.filter((d) => d.otdPct > 0).length;
    return { total, onDuty, hosCrit, hosWarn, offDuty, avgScore, avgOtd };
  }, []);

  const top3 = useMemo(
    () => [...DRIVERS].filter((d) => d.score > 0).sort((a, b) => b.score - a.score).slice(0, 3),
    []
  );

  return (
    <div className="px-6 lg:px-8 py-6 lg:py-8 max-w-[1440px] mx-auto space-y-6 reveal-stack">
      <PageHeader
        title="Drivers"
        subtitle="Performance, HOS clock, and AI-prioritized actions for every driver in the fleet."
        actions={
          <>
            <Button variant="secondary" size="md">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="primary" size="md">
              <UserPlus className="h-4 w-4" />
              Add driver
            </Button>
          </>
        }
      />

      {/* Stats — reusing StatTile */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile
          label="Active drivers"
          value={counts.total - counts.offDuty}
          note={`${counts.onDuty} on duty · ${counts.offDuty} off duty`}
        />
        <StatTile
          label="Avg performance"
          value={
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-4 w-4 text-warning-500 fill-warning-500" />
              {counts.avgScore.toFixed(1)}
            </span>
          }
          note={`${counts.avgOtd.toFixed(1)}% avg OTD`}
          tone="success"
        />
        <StatTile
          label="HOS warnings"
          value={counts.hosWarn}
          note="next 4h window"
          tone={counts.hosWarn ? "warning" : "neutral"}
          icon={<Clock className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="HOS critical"
          value={counts.hosCrit}
          note={counts.hosCrit ? "AI re-assign suggested" : "all clear"}
          tone={counts.hosCrit ? "danger" : "success"}
        />
      </section>

      {/* Top performers + AI insight (reusing Card pattern) */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-end justify-between gap-3">
            <div>
              <CardCaption>Top performers</CardCaption>
              <CardTitle className="mt-1">This quarter · ranked by AI</CardTitle>
            </div>
            <Badge tone="accent" size="sm" dot>
              Refreshed daily
            </Badge>
          </CardHeader>
          <ol className="px-5 pb-5 grid grid-cols-1 md:grid-cols-3 gap-3">
            {top3.map((d, i) => {
              const initials = d.name
                .split(/\s+/)
                .map((p) => p[0])
                .join("")
                .slice(0, 2);
              return (
                <li
                  key={d.id}
                  onClick={() => setActive(d)}
                  className={cn(
                    "rounded-lg border border-border-soft bg-subtle/30 p-3 cursor-pointer hover:bg-subtle/60 transition-colors",
                    i === 0 && "ai-edge bg-surface"
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={cn(
                        "h-6 w-6 rounded-full grid place-items-center text-[11px] font-mono font-semibold",
                        i === 0
                          ? "bg-accent-500 text-ink-invert"
                          : "bg-subtle text-ink-secondary"
                      )}
                    >
                      {i + 1}
                    </span>
                    <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-brand-700 to-accent-700 grid place-items-center text-ink-invert text-[11px] font-semibold">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-body-sm font-medium text-ink-primary truncate">{d.name}</p>
                      <p className="text-[11px] font-mono text-ink-muted">{d.unit}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-body-sm">
                    <span className="inline-flex items-center gap-1 text-ink-secondary">
                      <Star className="h-3 w-3 text-warning-500 fill-warning-500" />
                      <span className="font-medium tabular-nums text-ink-primary">{d.score.toFixed(1)}</span>
                    </span>
                    <span className="tabular-nums text-success-700 font-medium">{d.otdPct.toFixed(1)}% OTD</span>
                  </div>
                </li>
              );
            })}
          </ol>
        </Card>

        {/* AI HOS panel */}
        <Card className="ai-edge">
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-50 text-accent-700 text-[10px] font-medium uppercase tracking-[0.1em]">
                <Sparkles className="h-3 w-3" /> AI alert
              </span>
            </div>
            <CardTitle className="mt-1.5 text-h3">
              R. Patel — HOS exhaustion in 1h 40m
            </CardTitle>
          </CardHeader>
          <div className="px-5 pb-5 -mt-2 space-y-3">
            <p className="text-body-sm text-ink-secondary leading-relaxed">
              Driver is on <span className="font-mono text-ink-primary">DFW-44247</span>.
              Re-assigning to Unit #308 keeps the load on time and avoids a roadside layover.
            </p>
            <div className="flex gap-2">
              <Button
                variant="ai"
                size="sm"
                onClick={() => setActive(DRIVERS.find((d) => d.id === "d-patel") ?? null)}
              >
                <ArrowRight className="h-3.5 w-3.5" />
                Open re-assign
              </Button>
              <Button variant="ghost" size="sm">
                Snooze 30m
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Filter bar + driver grid */}
      <Card className="overflow-hidden">
        <div className="p-4 flex items-center gap-3 border-b border-border-soft">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
            <input
              type="text"
              placeholder="Search drivers, units, regions, loads…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-9 w-full pl-9 pr-3 rounded-md border border-border-soft bg-subtle/40 text-body text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-surface transition-all"
            />
          </div>
          <div className="flex items-center gap-1 overflow-x-auto">
            {FILTERS.map((f) => {
              const isActive = filter === f.key;
              const c =
                f.key === "all"
                  ? DRIVERS.length
                  : DRIVERS.filter((d) => d.status === f.key).length;
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
                    {c}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((d) => (
            <DriverCard
              key={d.id}
              driver={d}
              active={active?.id === d.id}
              onClick={() => setActive(d)}
            />
          ))}
        </div>
      </Card>

      <DriverDetailSheet driver={active} open={!!active} onOpenChange={(o) => !o && setActive(null)} />
    </div>
  );
}
