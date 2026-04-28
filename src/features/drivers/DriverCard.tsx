import { Star, Clock } from "lucide-react";
import type { Driver } from "@/mocks/seed/drivers";
import { StatusBadge } from "@/components/data-display/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Sparkline } from "@/components/data-display/Sparkline";
import { cn } from "@/lib/utils";

const HOURS_TONE = (mins: number) =>
  mins <= 120 ? "text-danger-700" : mins <= 240 ? "text-warning-700" : "text-ink-secondary";

export function DriverCard({
  driver,
  active,
  onClick,
}: {
  driver: Driver;
  active?: boolean;
  onClick?: () => void;
}) {
  const initials = driver.name
    .replace("Unassigned · ", "")
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const trendDelta =
    driver.trend.length > 1
      ? driver.trend[driver.trend.length - 1] - driver.trend[0]
      : 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-lg border bg-surface p-3.5 transition-all group",
        active ? "border-brand-500 ring-2 ring-brand-500/15" : "border-border-soft hover:border-border"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-brand-700 to-accent-700 grid place-items-center text-ink-invert text-[12px] font-semibold">
          {initials || "—"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-body font-medium text-ink-primary truncate">{driver.name}</span>
            <span className="font-mono text-[11px] text-ink-muted shrink-0">{driver.unit}</span>
          </div>
          <div className="mt-1 flex items-center gap-2 flex-wrap">
            <StatusBadge status={driver.status} />
            {driver.flag && (
              <Badge tone={driver.flag.tone} size="sm" dot>
                {driver.flag.label}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <Stat
          label="Score"
          value={
            <span className="inline-flex items-center gap-0.5">
              <Star className="h-3 w-3 text-warning-500 fill-warning-500" />
              {driver.score.toFixed(1)}
            </span>
          }
        />
        <Stat label="OTD" value={`${driver.otdPct.toFixed(1)}%`} />
        <Stat
          label="HOS"
          value={
            <span className={cn("inline-flex items-center gap-0.5", HOURS_TONE(driver.hoursLeftMins))}>
              <Clock className="h-3 w-3" />
              {driver.hoursLeft}
            </span>
          }
        />
      </div>

      {/* Trend sparkline + miles */}
      <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-border-soft">
        <span className="text-[11px] text-ink-muted">
          {(driver.milesYtd / 1000).toFixed(1)}k mi YTD
        </span>
        <Sparkline data={driver.trend} positive={trendDelta >= 0} width={86} height={22} />
      </div>

      {driver.highlight && (
        <p
          className={cn(
            "mt-2 text-[11px] leading-snug truncate",
            driver.flag?.tone === "danger"
              ? "text-danger-700"
              : driver.flag?.tone === "warning"
              ? "text-warning-700"
              : "text-ink-muted"
          )}
        >
          {driver.highlight}
        </p>
      )}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md bg-subtle/60 px-2 py-1.5">
      <p className="text-[10px] uppercase tracking-[0.1em] text-ink-muted">{label}</p>
      <p className="text-body-sm font-medium text-ink-primary tabular-nums leading-tight mt-0.5">
        {value}
      </p>
    </div>
  );
}
