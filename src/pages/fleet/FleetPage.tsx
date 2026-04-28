import { useMemo, useState } from "react";
import {
  Search,
  Truck as TruckIcon,
  AlertTriangle,
  Fuel,
  Wrench,
  Download,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardCaption, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatTile } from "@/components/data-display/StatTile";
import { LiveMap } from "@/components/map/LiveMap";
import { TruckCard } from "@/features/fleet/TruckCard";
import { TruckDetailSheet } from "@/features/fleet/TruckDetailSheet";
import { TRUCKS, type Truck } from "@/mocks/seed/trucks";
import { cn } from "@/lib/utils";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "moving", label: "Moving" },
  { key: "idle", label: "Idle" },
  { key: "maintenance", label: "In service" },
  { key: "offline", label: "Offline" },
  { key: "anomaly", label: "Anomalies" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

export default function FleetPage() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Truck | null>(null);

  const filtered = useMemo(() => {
    return TRUCKS.filter((t) => {
      if (filter === "anomaly") {
        if (!t.anomalies || t.anomalies.length === 0) return false;
      } else if (filter !== "all" && t.status !== filter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        t.unit.toLowerCase().includes(q) ||
        t.driver.toLowerCase().includes(q) ||
        (t.load ?? "").toLowerCase().includes(q)
      );
    });
  }, [filter, query]);

  const counts = useMemo(() => {
    const total = TRUCKS.length;
    const moving = TRUCKS.filter((t) => t.status === "moving").length;
    const idle = TRUCKS.filter((t) => t.status === "idle").length;
    const maint = TRUCKS.filter((t) => t.status === "maintenance").length;
    const offline = TRUCKS.filter((t) => t.status === "offline").length;
    const anomalies = TRUCKS.filter((t) => t.anomalies && t.anomalies.length > 0).length;
    const utilization = Math.round((moving / total) * 100);
    return { total, moving, idle, maint, offline, anomalies, utilization };
  }, []);

  const fuelAlerts = TRUCKS.filter((t) =>
    t.anomalies?.some((a) => a.kind === "fuel_drop")
  );
  const maintenanceFlags = TRUCKS.filter((t) =>
    t.anomalies?.some((a) => a.kind === "maintenance_due")
  );

  return (
    <div className="px-6 lg:px-8 py-6 lg:py-8 max-w-[1440px] mx-auto space-y-6 reveal-stack">
      <PageHeader
        title="Fleet"
        subtitle="Live telematics for every unit, with AI flagging fuel and maintenance anomalies the moment they appear."
        actions={
          <>
            <Button variant="secondary" size="md">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="ai" size="md">
              <Sparkles className="h-4 w-4" />
              AI fleet review
            </Button>
          </>
        }
      />

      {/* Summary stats — reusing StatTile */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile
          label="Active units"
          value={counts.total}
          note={`${counts.moving} moving · ${counts.idle} idle`}
          icon={<TruckIcon className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="Utilization"
          value={`${counts.utilization}%`}
          note="+2.1% vs last week"
          tone="success"
        />
        <StatTile
          label="Fuel anomalies"
          value={fuelAlerts.length}
          note={fuelAlerts.length ? "review recommended" : "no alerts"}
          tone={fuelAlerts.length ? "warning" : "neutral"}
          icon={<Fuel className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="Predicted failures"
          value={maintenanceFlags.length}
          note="next 14 days"
          tone={maintenanceFlags.length ? "danger" : "neutral"}
          icon={<Wrench className="h-3.5 w-3.5" />}
        />
      </section>

      {/* Map + truck rail */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardCaption>Live operations</CardCaption>
              <CardTitle className="mt-1">North America · {counts.total} units</CardTitle>
            </div>
            <Badge tone="success" dot size="sm">
              Live · updated 4s ago
            </Badge>
          </CardHeader>
          <div className="px-5 pb-5">
            <LiveMap trucks={TRUCKS} height={460} />
          </div>
        </Card>

        {/* Right rail: anomaly summary + AI insight */}
        <div className="xl:col-span-1 flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardCaption>Anomalies</CardCaption>
              <CardTitle className="mt-1">{counts.anomalies} units flagged</CardTitle>
            </CardHeader>
            <ul className="px-3 pb-3 space-y-1">
              {TRUCKS.filter((t) => t.anomalies && t.anomalies.length > 0).map((t) => {
                const top = t.anomalies![0];
                return (
                  <li key={t.id}>
                    <button
                      onClick={() => setActive(t)}
                      className="w-full flex items-start gap-2.5 px-3 py-2 rounded-md hover:bg-subtle/60 text-left transition-colors"
                    >
                      <AlertTriangle
                        className={cn(
                          "h-3.5 w-3.5 mt-0.5 shrink-0",
                          top.severity === "high" ? "text-danger-500" : "text-warning-500"
                        )}
                        strokeWidth={2.25}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[12px] text-ink-primary">{t.unit}</span>
                          <span className="text-[11px] text-ink-muted truncate">{t.driver}</span>
                        </div>
                        <p className="text-body-sm text-ink-secondary leading-snug truncate">
                          {top.label}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card className="ai-edge">
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-50 text-accent-700 text-[10px] font-medium uppercase tracking-[0.1em]">
                  <Sparkles className="h-3 w-3" /> AI insight
                </span>
              </div>
              <CardTitle className="mt-1.5 text-h3">
                Unit #217 fuel efficiency down 14%
              </CardTitle>
            </CardHeader>
            <div className="px-5 pb-5 -mt-2 space-y-3">
              <p className="text-body-sm text-ink-secondary leading-relaxed">
                Pattern is consistent with injector wear. Predicted failure window: 6–9 days.
                Memphis terminal is on the truck's natural Friday layover.
              </p>
              <div className="flex gap-2">
                <Button variant="ai" size="sm">
                  <Wrench className="h-3.5 w-3.5" />
                  Schedule service
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActive(TRUCKS.find((t) => t.unit === "#217") ?? null)}
                >
                  See unit
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Filter bar + truck grid */}
      <Card className="overflow-hidden">
        <div className="p-4 flex items-center gap-3 border-b border-border-soft">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
            <input
              type="text"
              placeholder="Search by unit, driver, or load…"
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
                  ? TRUCKS.length
                  : f.key === "anomaly"
                  ? counts.anomalies
                  : TRUCKS.filter((t) => t.status === f.key).length;
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
          {filtered.map((t) => (
            <TruckCard
              key={t.id}
              truck={t}
              active={active?.id === t.id}
              onClick={() => setActive(t)}
            />
          ))}
        </div>
      </Card>

      <TruckDetailSheet truck={active} open={!!active} onOpenChange={(o) => !o && setActive(null)} />
    </div>
  );
}
