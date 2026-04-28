import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/data-display/StatusBadge";
import { TrendChart } from "@/components/data-display/TrendChart";
import type { Driver } from "@/mocks/seed/drivers";
import {
  Star,
  Clock,
  Phone,
  Truck,
  Sparkles,
  Award,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { driver: Driver | null; open: boolean; onOpenChange: (v: boolean) => void };

export function DriverDetailSheet({ driver, open, onOpenChange }: Props) {
  if (!driver) return null;
  const initials = driver.name
    .replace("Unassigned · ", "")
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const trendData = driver.trend.map((v, i) => ({ wk: `W${i + 1}`, score: v }));
  const showAI = driver.status === "hos_critical";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" width="sm:max-w-[560px]" className="flex flex-col p-0">
        <SheetHeader className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 shrink-0 rounded-full bg-gradient-to-br from-brand-700 to-accent-700 grid place-items-center text-ink-invert text-[14px] font-semibold">
              {initials || "—"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-body-sm text-ink-muted">{driver.unit}</span>
                <span className="text-ink-disabled">·</span>
                <StatusBadge status={driver.status} />
                <Badge tone="neutral" size="sm">{driver.region}</Badge>
              </div>
              <SheetTitle className="!text-h2 leading-tight pr-8 mt-1">{driver.name}</SheetTitle>
              <p className="text-body-sm text-ink-muted mt-0.5">
                {driver.tenureYrs.toFixed(1)} yrs tenure
                {driver.currentLoad && (
                  <>
                    {" "}· On{" "}
                    <span className="font-mono text-ink-secondary">{driver.currentLoad}</span>
                  </>
                )}
              </p>
            </div>
          </div>
        </SheetHeader>

        <SheetBody className="flex-1 space-y-5">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            <Tile
              icon={<Star className="h-3.5 w-3.5 text-warning-500 fill-warning-500" />}
              label="Performance"
              value={driver.score.toFixed(1)}
              note="last 12 wks"
            />
            <Tile
              label="On-time delivery"
              value={`${driver.otdPct.toFixed(1)}%`}
              tone={driver.otdPct >= 95 ? "success" : driver.otdPct >= 90 ? "neutral" : "warning"}
            />
            <Tile
              icon={<Clock className="h-3.5 w-3.5" />}
              label="HOS clock"
              value={driver.hoursLeft}
              tone={
                driver.hoursLeftMins <= 120
                  ? "danger"
                  : driver.hoursLeftMins <= 240
                  ? "warning"
                  : "success"
              }
            />
            <Tile label="Miles YTD" value={`${(driver.milesYtd / 1000).toFixed(1)}k`} wide />
            <Tile label="Tenure" value={`${driver.tenureYrs.toFixed(1)} yrs`} wide />
          </div>

          {/* AI suggestion for HOS critical */}
          {showAI && (
            <section className="ai-edge rounded-xl bg-surface p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-50 text-accent-700 text-[10px] font-medium uppercase tracking-[0.1em]">
                  <Sparkles className="h-3 w-3" /> AI suggestion
                </span>
              </div>
              <p className="text-body text-ink-secondary leading-relaxed">
                <strong className="text-ink-primary">Re-assign load {driver.currentLoad ?? "—"} to Unit #308.</strong>{" "}
                Driver L. Cole is unloading 18 mi north and clears in 22 minutes. Avoids HOS violation and keeps the
                delivery on time.
              </p>
              <div className="mt-3 flex gap-2">
                <Button variant="ai" size="sm">
                  <Truck className="h-3.5 w-3.5" />
                  Re-assign to #308
                </Button>
                <Button variant="ghost" size="sm">
                  Notify driver only
                </Button>
              </div>
            </section>
          )}

          {/* Performance trend */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-caption uppercase tracking-[0.1em] text-ink-muted">
                Performance · 12 weeks
              </h3>
              <span className="text-[11px] text-ink-muted">
                Score range {Math.min(...driver.trend).toFixed(1)} – {Math.max(...driver.trend).toFixed(1)}
              </span>
            </div>
            <div className="rounded-lg border border-border-soft bg-surface p-3">
              <TrendChart
                data={trendData}
                xKey="wk"
                series={[{ key: "score", label: "Score", color: "hsl(var(--brand-500))" }]}
                height={140}
                formatY={(v) => v.toFixed(1)}
              />
            </div>
          </section>

          {/* Highlight or recent activity */}
          {driver.highlight && (
            <section className="rounded-lg border border-border-soft bg-subtle/40 p-3 flex items-start gap-3">
              <Award className="h-4 w-4 text-accent-500 shrink-0 mt-0.5" strokeWidth={2} />
              <div className="flex-1">
                <p className="text-caption uppercase tracking-[0.1em] text-ink-muted">AI insight</p>
                <p className="text-body text-ink-secondary mt-0.5 leading-relaxed">{driver.highlight}</p>
              </div>
            </section>
          )}
        </SheetBody>

        <SheetFooter>
          <Button variant="ghost" size="md" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button variant="secondary" size="md">
            <Phone className="h-3.5 w-3.5" />
            Contact
          </Button>
          <Button variant="primary" size="md">
            View history
            <ArrowRight className="h-4 w-4" />
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Tile({
  icon,
  label,
  value,
  note,
  tone,
  wide,
}: {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
  note?: string;
  tone?: "success" | "warning" | "danger" | "neutral";
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg bg-subtle/60 border border-border-soft p-3",
        wide && "col-span-3 sm:col-span-1"
      )}
    >
      <div className="flex items-center gap-1.5 text-ink-muted text-caption uppercase tracking-[0.1em]">
        {icon}
        {label}
      </div>
      <p
        className={cn(
          "mt-1 text-body font-medium tabular-nums",
          tone === "success" && "text-success-700",
          tone === "warning" && "text-warning-700",
          tone === "danger" && "text-danger-700",
          (!tone || tone === "neutral") && "text-ink-primary"
        )}
      >
        {value}
      </p>
      {note && <p className="text-[11px] text-ink-muted mt-0.5">{note}</p>}
    </div>
  );
}
