import { Sparkline } from "./Sparkline";
import { DeltaPill } from "./DeltaPill";
import { cn } from "@/lib/utils";
import { formatBy, type KPIFormat } from "@/lib/format";
import { Info } from "lucide-react";

export type KPI = {
  label: string;
  value: number;
  format: KPIFormat;
  delta: number;
  invertedDelta?: boolean;
  trend: number[];
  annotation?: string;
};

export function KPICard({ kpi, className }: { kpi: KPI; className?: string }) {
  const trendingUp = kpi.delta > 0;
  const goodIfUp = !kpi.invertedDelta;
  const positive = trendingUp ? goodIfUp : !goodIfUp;

  return (
    <div
      className={cn(
        "group relative isolate rounded-xl bg-surface border border-border-soft shadow-elev-1 p-4 transition-[border-color,box-shadow] duration-200",
        "hover:border-border hover:shadow-[0_2px_8px_-2px_rgba(15,23,42,0.06)]",
        "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-xl before:bg-[radial-gradient(80%_60%_at_100%_0%,hsl(var(--brand-500)/0.05),transparent)] before:opacity-0 hover:before:opacity-100 before:transition-opacity",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-1.5 min-w-0">
          <p className="text-caption uppercase text-ink-muted truncate">{kpi.label}</p>
          <Info className="h-3 w-3 text-ink-disabled opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <Sparkline data={kpi.trend} positive={positive} />
      </div>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-kpi tabular-nums leading-none">{formatBy(kpi.value, kpi.format)}</span>
        <DeltaPill value={kpi.delta} inverted={kpi.invertedDelta} className="mb-1" />
      </div>
      {kpi.annotation && (
        <p className="mt-2 text-body-sm text-ink-muted line-clamp-1">{kpi.annotation}</p>
      )}
    </div>
  );
}
