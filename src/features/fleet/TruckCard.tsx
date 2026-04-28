import { AlertTriangle, Fuel, Gauge, Wifi, WifiOff } from "lucide-react";
import type { Truck } from "@/mocks/seed/trucks";
import { StatusBadge } from "@/components/data-display/StatusBadge";
import { cn } from "@/lib/utils";

const FUEL_TONE = (pct: number) =>
  pct >= 60 ? "text-success-700" : pct >= 30 ? "text-warning-700" : "text-danger-700";

export function TruckCard({ truck, active, onClick }: { truck: Truck; active?: boolean; onClick?: () => void }) {
  const Wi = truck.status === "offline" ? WifiOff : Wifi;
  const initials = (truck.driver === "—"
    ? "—"
    : truck.driver
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2));

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-lg border bg-surface p-3 transition-all group",
        active ? "border-brand-500 ring-2 ring-brand-500/15" : "border-border-soft hover:border-border"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-brand-700 to-accent-700 grid place-items-center text-ink-invert text-[11px] font-semibold">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-body-sm text-ink-primary">{truck.unit}</span>
            <StatusBadge status={truck.status} />
          </div>
          <p className="text-[11px] text-ink-muted mt-0.5 truncate">
            {truck.driver}{truck.load ? ` · ${truck.load}` : ""}
          </p>
        </div>
        <Wi
          className={cn(
            "h-3.5 w-3.5 shrink-0",
            truck.status === "offline" ? "text-danger-500" : "text-success-500"
          )}
        />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        <Mini icon={<Fuel className="h-3 w-3" />} value={`${truck.fuelPct}%`} tone={FUEL_TONE(truck.fuelPct)} />
        <Mini icon={<Gauge className="h-3 w-3" />} value={`${truck.speedMph} mph`} />
        <Mini value={`${truck.fuelMpg.toFixed(1)} mpg`} dim={truck.fuelMpg < truck.fuelMpgBaseline - 0.4} />
      </div>
      {truck.anomalies && truck.anomalies.length > 0 && (
        <div className="mt-2 pt-2 border-t border-border-soft">
          {truck.anomalies.slice(0, 1).map((a) => (
            <div
              key={a.kind}
              className={cn(
                "flex items-start gap-1.5 text-[11px] leading-tight",
                a.severity === "high"
                  ? "text-danger-700"
                  : a.severity === "medium"
                  ? "text-warning-700"
                  : "text-ink-muted"
              )}
            >
              <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" strokeWidth={2.25} />
              <span>{a.label}</span>
            </div>
          ))}
        </div>
      )}
    </button>
  );
}

function Mini({ icon, value, tone, dim }: { icon?: React.ReactNode; value: string; tone?: string; dim?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 text-[11px] tabular-nums px-1.5 py-1 rounded-md bg-subtle/60",
        dim ? "text-warning-700" : tone || "text-ink-secondary"
      )}
    >
      {icon}
      <span className="font-medium">{value}</span>
    </div>
  );
}
