import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/data-display/StatusBadge";
import { Badge } from "@/components/ui/badge";
import type { Truck } from "@/mocks/seed/trucks";
import {
  AlertTriangle,
  Fuel,
  Gauge,
  Sparkles,
  Wrench,
  ArrowRight,
  Phone,
  MapPin,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { truck: Truck | null; open: boolean; onOpenChange: (v: boolean) => void };

export function TruckDetailSheet({ truck, open, onOpenChange }: Props) {
  if (!truck) return null;
  const mpgDelta = truck.fuelMpg - truck.fuelMpgBaseline;
  const initials = truck.driver
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" width="sm:max-w-[560px]" className="flex flex-col p-0">
        <SheetHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-body-sm text-ink-muted">Unit {truck.unit}</span>
            <span className="text-ink-disabled">·</span>
            <StatusBadge status={truck.status} />
            <Badge tone="neutral" size="sm">
              {truck.region}
            </Badge>
          </div>
          <SheetTitle className="!text-h2 leading-tight pr-8">
            {truck.driver !== "—" ? truck.driver : "Unassigned"}
          </SheetTitle>
          {truck.load && (
            <p className="text-body-sm text-ink-muted">
              On load <span className="font-mono text-ink-primary">{truck.load}</span>
            </p>
          )}
        </SheetHeader>

        <SheetBody className="flex-1 space-y-5">
          {/* Telematics row */}
          <div className="grid grid-cols-3 gap-2">
            <Tile
              icon={<Fuel className="h-3.5 w-3.5" />}
              label="Fuel"
              value={`${truck.fuelPct}%`}
              tone={truck.fuelPct >= 60 ? "success" : truck.fuelPct >= 30 ? "warning" : "danger"}
            />
            <Tile
              icon={<Gauge className="h-3.5 w-3.5" />}
              label="Speed"
              value={`${truck.speedMph} mph`}
            />
            <Tile
              icon={<Activity className="h-3.5 w-3.5" />}
              label="Avg MPG"
              value={truck.fuelMpg.toFixed(1)}
              note={`${mpgDelta >= 0 ? "+" : ""}${mpgDelta.toFixed(1)} vs baseline`}
              tone={mpgDelta < -0.4 ? "warning" : "success"}
            />
            <Tile
              icon={<MapPin className="h-3.5 w-3.5" />}
              label="Last seen"
              value={truck.lastSeen}
              wide
            />
            <Tile
              label="Odometer"
              value={`${(truck.odometer / 1000).toFixed(0)}k mi`}
              wide
            />
          </div>

          {/* Anomalies */}
          {truck.anomalies && truck.anomalies.length > 0 && (
            <section>
              <h3 className="text-caption uppercase tracking-[0.1em] text-ink-muted flex items-center gap-1.5 mb-2">
                <AlertTriangle className="h-3.5 w-3.5" /> Anomalies · {truck.anomalies.length}
              </h3>
              <ul className="space-y-1.5">
                {truck.anomalies.map((a) => (
                  <li
                    key={a.kind}
                    className={cn(
                      "rounded-lg border p-3 flex items-start gap-2.5",
                      a.severity === "high"
                        ? "border-danger-500/25 bg-danger-50/40"
                        : a.severity === "medium"
                        ? "border-warning-500/25 bg-warning-50/40"
                        : "border-border-soft bg-subtle/50"
                    )}
                  >
                    <Badge
                      tone={a.severity === "high" ? "danger" : a.severity === "medium" ? "warning" : "neutral"}
                      size="sm"
                      dot
                    >
                      {a.severity}
                    </Badge>
                    <p className="text-body-sm text-ink-primary">{a.label}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* AI suggestion (if anomalies exist) */}
          {truck.anomalies?.some((a) => a.kind === "fuel_drop" || a.kind === "maintenance_due") && (
            <section className="ai-edge rounded-xl bg-surface p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-50 text-accent-700 text-[10px] font-medium uppercase tracking-[0.1em]">
                  <Sparkles className="h-3 w-3" /> AI Suggestion
                </span>
              </div>
              <p className="text-body text-ink-secondary leading-relaxed">
                <strong className="text-ink-primary">Schedule injector service Friday at the Memphis terminal.</strong>{" "}
                Unit {truck.unit} naturally lays over there post-delivery. Avoids a $4.2K roadside repair window in 6–9
                days.
              </p>
              <div className="mt-3 flex gap-2">
                <Button variant="ai" size="sm">
                  <Wrench className="h-3.5 w-3.5" />
                  Create work order
                </Button>
                <Button variant="ghost" size="sm">
                  Snooze 24h
                </Button>
              </div>
            </section>
          )}

          {/* Driver chip */}
          {truck.driver !== "—" && (
            <section className="rounded-lg bg-subtle/60 border border-border-soft p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-700 to-accent-700 grid place-items-center text-ink-invert text-[11px] font-semibold">
                  {initials}
                </div>
                <div>
                  <p className="text-body-sm font-medium text-ink-primary">{truck.driver}</p>
                  <p className="text-[11px] text-ink-muted">4.9 score · 2.1 yrs · HOS 8h 12m left</p>
                </div>
              </div>
              <Button variant="secondary" size="sm">
                <Phone className="h-3.5 w-3.5" />
                Contact
              </Button>
            </section>
          )}
        </SheetBody>

        <SheetFooter>
          <Button variant="ghost" size="md" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button variant="secondary" size="md">
            Open in TMS
          </Button>
          <Button variant="primary" size="md">
            View route
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
  value: string;
  note?: string;
  tone?: "success" | "warning" | "danger";
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
          !tone && "text-ink-primary"
        )}
      >
        {value}
      </p>
      {note && <p className="text-[11px] text-ink-muted mt-0.5">{note}</p>}
    </div>
  );
}
